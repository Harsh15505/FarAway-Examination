"""
Edge API — State Recovery

Crash recovery: snapshot save/restore for exam sessions.
Protected by edge-local RSA-signed JWT.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/recovery")


@router.get("/{candidate_id}")
async def get_recovery_snapshot(candidate_id: str):
    """Get latest recovery snapshot for a candidate's session."""
    # TODO: Load from SQLite: answers, timer position, current question index
    ...


@router.post("/restore/{session_id}")
async def restore_session(session_id: str):
    """Restore a crashed session from the latest snapshot."""
    # TODO: Load snapshot, rebuild session state, log audit
    ...
