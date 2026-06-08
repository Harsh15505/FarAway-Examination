"""Audit event model — hash-chained audit ledger entry."""

from sqlalchemy import Column, String, Text, DateTime, Integer, func

from server.app.db.database import Base


class AuditEvent(Base):
    """Single event in the hash-chained audit ledger."""

    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True)
    sequence = Column(Integer, nullable=False, unique=True)  # Monotonic counter
    event_type = Column(String(50), nullable=False)  # QUESTION_CREATED, CANDIDATE_AUTHENTICATED, etc.
    actor_id = Column(String(255), nullable=False)
    payload = Column(Text, nullable=False)  # JSON event data
    payload_hash = Column(String(64), nullable=False)  # SHA-256 of payload
    previous_hash = Column(String(64), nullable=False)  # SHA-256 hash of previous event (chain link)
    event_hash = Column(String(64), nullable=False)  # SHA-256(sequence + payload_hash + previous_hash)
    created_at = Column(DateTime, server_default=func.now())
