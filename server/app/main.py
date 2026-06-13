"""
FortisExam Server — Entry Point

Mode-switchable FastAPI application:
  - SERVER_MODE=cloud  → PostgreSQL, Clerk JWT auth, cloud routes
  - SERVER_MODE=edge   → SQLite (WAL), custom RSA JWT auth, edge routes

Usage:
  uvicorn server.app.main:app --host 0.0.0.0 --port 8000
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown hooks."""
    import os
    from server.app.db.database import engine, Base
    import server.app.models  # Ensure all models are imported before create_all
    from shared.crypto.rsa import RSASigner
    from sqlalchemy.ext.asyncio import async_sessionmaker
    from server.app.models.candidate import Candidate
    from server.app.models.exam import Exam
    from sqlalchemy import select
    
    # Auto-generate RSA keys for mock if missing
    if not os.path.exists("./keys"):
        os.makedirs("./keys", exist_ok=True)
    if not os.path.exists("./keys/private.pem"):
        private_pem, public_pem = RSASigner.generate_key_pair()
        with open("./keys/private.pem", "wb") as f:
            f.write(private_pem)
        with open("./keys/public.pem", "wb") as f:
            f.write(public_pem)
            
    # Auto-create tables (useful for edge mode SQLite and hackathon cloud mock)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        # Inject dummy candidate and questions for Vercel Kiosk mock if missing
    AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    async with AsyncSessionLocal() as session:
        from server.app.models.question import Question
        q_count = await session.execute(select(func.count(Question.id)))
        if q_count.scalar() == 0:
            # Seed questions
            from server.seed_test_data import seed
            # Note: seed() uses create_async_engine and asyncio.run internally, 
            # so it's better to just inline the questions here to avoid loop conflicts
            questions = [
                Question(subject="Physics", difficulty="Easy", encrypted_content="enc1", encryption_iv="iv1", content_hash="hash1", created_by="system"),
                Question(subject="Physics", difficulty="Hard", encrypted_content="enc2", encryption_iv="iv2", content_hash="hash2", created_by="system"),
                Question(subject="Chemistry", difficulty="Medium", encrypted_content="enc3", encryption_iv="iv3", content_hash="hash3", created_by="system"),
            ]
            session.add_all(questions)
            
            dummy_exam = Exam(id='21e87336-b68c-45c6-8f2b-3de2d8696ec3', name='Hackathon Demo Exam', subject='Demo', blueprint={}, duration_minutes='60', created_by='system')
            dummy_candidate = Candidate(id='4a4224cb-d420-4107-bc62-d778f416dc99', name='Test Candidate', roll_number='TEST001', center_id='c1', exam_id='21e87336-b68c-45c6-8f2b-3de2d8696ec3', seat_number='1A')
            session.add_all([dummy_exam, dummy_candidate])
            await session.commit()
        
    yield
    await engine.dispose()


def create_app() -> FastAPI:
    """Factory function to create the FastAPI application based on SERVER_MODE."""
    app = FastAPI(
        title="FortisExam API",
        description=f"Zero-Trust Examination Infrastructure — Mode: {settings.server_mode}",
        version="0.1.0",
        lifespan=lifespan,
    )

    # --- CORS Middleware ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Common Routes (both modes) ---
    from server.app.api.common.health import router as health_router
    from server.app.api.common.audit import router as audit_router

    app.include_router(health_router, tags=["Health"])
    app.include_router(audit_router, prefix="/api/v1", tags=["Audit"])

    # --- Mode-specific Routes ---
    if settings.server_mode == "cloud":
        _mount_cloud_routes(app)
    elif settings.server_mode == "edge":
        _mount_edge_routes(app)

    return app


def _mount_cloud_routes(app: FastAPI) -> None:
    """Mount cloud-only API routes (questions, exams, packages, distribution, centers)."""
    from server.app.api.cloud.questions import router as questions_router
    from server.app.api.cloud.exams import router as exams_router
    from server.app.api.cloud.packages import router as packages_router
    from server.app.api.cloud.distribution import router as distribution_router
    from server.app.api.cloud.users import router as users_router
    from server.app.api.cloud.dashboard import router as dashboard_router
    from server.app.api.cloud.centers import router as centers_router

    app.include_router(questions_router, prefix="/api/v1", tags=["Questions"])
    app.include_router(exams_router, prefix="/api/v1", tags=["Exams"])
    app.include_router(packages_router, prefix="/api/v1", tags=["Packages"])
    app.include_router(distribution_router, prefix="/api/v1", tags=["Distribution"])
    app.include_router(users_router, prefix="/api/v1", tags=["Users"])
    app.include_router(dashboard_router, prefix="/api/v1", tags=["Dashboard"])
    app.include_router(centers_router, prefix="/api/v1", tags=["Centers"])



def _mount_edge_routes(app: FastAPI) -> None:
    """Mount edge-only API routes (auth, exam execution, recovery, monitoring)."""
    from server.app.api.edge.auth import router as auth_router
    from server.app.api.edge.exam import router as exam_router
    from server.app.api.edge.recovery import router as recovery_router
    from server.app.api.edge.monitoring import router as monitoring_router

    app.include_router(auth_router, prefix="/api/v1", tags=["Authentication"])
    app.include_router(exam_router, prefix="/api/v1", tags=["Exam"])
    app.include_router(recovery_router, prefix="/api/v1", tags=["Recovery"])
    app.include_router(monitoring_router, prefix="/api/v1", tags=["Monitoring"])


app = create_app()
