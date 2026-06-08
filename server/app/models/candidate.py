"""Candidate model — exam candidate with pre-computed face embedding."""

from sqlalchemy import Column, String, LargeBinary, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from server.app.db.database import Base


class Candidate(Base):
    """Exam candidate with pre-loaded face embedding for verification."""

    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    name = Column(String(255), nullable=False)
    roll_number = Column(String(50), unique=True, nullable=False)
    center_id = Column(UUID(as_uuid=True), ForeignKey("centers.id"), nullable=False)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id"), nullable=False)
    seat_number = Column(String(10), nullable=True)
    photo_embedding = Column(LargeBinary, nullable=True)  # 512-dim face embedding
    created_at = Column(DateTime, server_default=func.now())
