"""
Edge API — Exam Execution

Variant loading, answer submission, exam completion.
Protected by edge-local RSA-signed JWT.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/exam")


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Load exam session with candidate's variant (graph-colored question order)."""
    # TODO: Decrypt questions, apply variant mapping, return to kiosk
    ...


@router.post("/answer")
async def submit_answer():
    """Submit or update an answer. Auto-saved to SQLite immediately."""
    # TODO: Upsert answer (session_id, question_id), create recovery snapshot, log audit
    ...


@router.post("/submit")
async def submit_exam():
    """Final exam submission. Freezes timer, generates submission hash."""
    # TODO: Collect all answers, generate submission hash, sign, log audit
    ...
