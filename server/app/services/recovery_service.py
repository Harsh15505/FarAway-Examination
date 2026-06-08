"""
Recovery Service — state persistence + crash restoration (edge only).

Saves snapshots on every answer submission.
Restores session state in < 60 seconds after crash.
"""


class RecoveryService:
    """Exam state recovery from SQLite snapshots."""

    async def save_snapshot(self, session_id: str, answers: dict, question_index: int, remaining_seconds: int):
        """Save recovery snapshot on every answer submission."""
        # TODO: Implement
        ...

    async def get_snapshot(self, candidate_id: str):
        """Get latest recovery snapshot for a candidate."""
        # TODO: Implement
        ...

    async def restore_session(self, session_id: str) -> dict:
        """Restore session from snapshot: answers, timer, question position."""
        # TODO: Implement
        ...
