"""Recovery snapshot model — crash recovery state for exam sessions."""

from sqlalchemy import Column, String, Text, DateTime, Integer, func

from server.app.db.database import Base


class RecoverySnapshot(Base):
    """Recovery snapshot saved on every answer submission for crash recovery."""

    __tablename__ = "recovery_snapshots"

    id = Column(String(36), primary_key=True)
    session_id = Column(String(36), nullable=False, unique=True)
    answers_json = Column(Text, nullable=False)  # JSON: { question_id: selected_option }
    current_question_index = Column(Integer, nullable=False)
    remaining_seconds = Column(Integer, nullable=False)
    snapshot_hash = Column(String(64), nullable=False)  # SHA-256 for integrity
    created_at = Column(DateTime, server_default=func.now())
