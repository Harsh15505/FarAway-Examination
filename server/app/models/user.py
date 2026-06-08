"""User model — synced from Clerk (D-014). No password stored locally."""

from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID

from server.app.db.database import Base


class User(Base):
    """Admin portal user (synced from Clerk). Stores role mapping only."""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    clerk_user_id = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), nullable=False)  # admin, expert, center_admin, invigilator, auditor
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
