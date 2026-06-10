"""
Cloud API — Question Management

CRUD endpoints for encrypted questions.
Protected by Clerk JWT middleware.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

from server.app.db.database import get_db
from server.app.middleware.clerk_auth import verify_clerk_jwt, require_role
from server.app.schemas.question import QuestionCreate
from server.app.services.question_service import QuestionService

router = APIRouter(prefix="/questions", tags=["Questions"])

# Demo master AES key (32 bytes) for encrypting all questions
# In production, this would be managed by an HSM or KMS
DEMO_MASTER_AES_KEY = b"12345678901234567890123456789012"

def get_question_service(db: AsyncSession = Depends(get_db)) -> QuestionService:
    return QuestionService(db, DEMO_MASTER_AES_KEY)


@router.post("/")
async def create_question(
    data: QuestionCreate,
    auth: dict = Depends(require_role("admin", "expert")),
    svc: QuestionService = Depends(get_question_service),
):
    """Create a new question. Content is AES-256-GCM encrypted before storage."""
    q = await svc.create(
        subject=data.subject,
        difficulty=data.difficulty,
        content=data.content,
        options=data.options,
        correct_option=data.correct_option,
        author_id=auth["clerk_user_id"],
    )
    return {"id": str(q.id), "status": "created"}


@router.get("/")
async def list_questions(
    page: int = 1,
    page_size: int = 20,
    auth: dict = Depends(require_role("admin", "expert")),
    svc: QuestionService = Depends(get_question_service),
):
    """List all questions (metadata only — encrypted content not returned)."""
    return await svc.list_all(page=page, page_size=page_size)


@router.get("/{question_id}")
async def get_question(
    question_id: str,
    auth: dict = Depends(require_role("admin", "expert")),
    svc: QuestionService = Depends(get_question_service),
):
    """Get question details by ID (returns decrypted content)."""
    try:
        return await svc.get(question_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{question_id}")
async def update_question(
    question_id: str,
    data: QuestionCreate,
    auth: dict = Depends(require_role("admin", "expert")),
    svc: QuestionService = Depends(get_question_service),
):
    """Update a question. Re-encrypts content on save."""
    try:
        return await svc.update(
            question_id=question_id,
            subject=data.subject,
            difficulty=data.difficulty,
            content=data.content,
            options=data.options,
            correct_option=data.correct_option,
            editor_id=auth["clerk_user_id"],
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{question_id}")
async def delete_question(
    question_id: str,
    auth: dict = Depends(require_role("admin")),
    svc: QuestionService = Depends(get_question_service),
):
    """Soft-delete a question."""
    try:
        await svc.delete(question_id, deleter_id=auth["clerk_user_id"])
        return {"id": question_id, "status": "deleted"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

