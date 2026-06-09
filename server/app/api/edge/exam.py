"""
Edge API — Exam Execution

Variant loading, answer submission, exam completion.
Protected by edge-local RSA-signed JWT.

Endpoints:
  GET  /exam/session/{session_id}  — Load exam session with variant
  POST /exam/answer                — Submit/update answer + auto-snapshot
  POST /exam/submit                — Final exam submission
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.db.database import get_db
from server.app.models.session import ExamSession
from server.app.schemas.recovery import (
    ExamSessionResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    SubmitExamRequest,
    SubmitExamResponse,
)
from server.app.services.recovery_service import RecoveryService

router = APIRouter(prefix="/exam")


@router.get("/session/{session_id}", response_model=ExamSessionResponse)
async def get_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Load exam session with candidate's variant (graph-colored question order)."""
    stmt = select(ExamSession).where(ExamSession.id == session_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    return ExamSessionResponse(
        session_id=session.id,
        candidate_id=session.candidate_id,
        exam_id=session.exam_id,
        variant_id=session.variant_id,
        status=session.status,
        current_question_index=session.current_question_index,
        started_at=session.started_at.isoformat() if session.started_at else "",
    )


@router.post("/answer", response_model=SubmitAnswerResponse)
async def submit_answer(
    request: SubmitAnswerRequest,
    db: AsyncSession = Depends(get_db),
):
    """Submit or update an answer. Auto-saved to SQLite immediately."""
    svc = RecoveryService(db)

    try:
        # 1. Save/update the answer
        answer = await svc.save_answer(
            session_id=request.session_id,
            question_id=request.question_id,
            selected_option=request.selected_option,
        )

        # 2. Save recovery snapshot (auto-save on every answer)
        snapshot = await svc.save_snapshot(
            session_id=request.session_id,
            current_question_index=request.current_question_index,
            remaining_seconds=request.remaining_seconds,
        )

        await db.commit()

        return SubmitAnswerResponse(
            saved=True,
            answer_id=answer.id,
            snapshot_saved=True,
            answer_hash=answer.answer_hash,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/submit", response_model=SubmitExamResponse)
async def submit_exam(
    request: SubmitExamRequest,
    db: AsyncSession = Depends(get_db),
):
    """Final exam submission. Freezes timer, generates submission hash."""
    svc = RecoveryService(db)

    try:
        result = await svc.submit_exam(request.session_id)
        await db.commit()

        return SubmitExamResponse(
            submission_id=result["submission_id"],
            total_answers=result["total_answers"],
            submission_hash=result["submission_hash"],
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
