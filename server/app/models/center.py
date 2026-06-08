"""Center model — exam center with seating layout for graph coloring."""

from sqlalchemy import Column, String, Integer, DateTime, JSON, func
from sqlalchemy.dialects.postgresql import UUID

from server.app.db.database import Base


class Center(Base):
    """Examination center with seating layout and RSA public key."""

    __tablename__ = "centers"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    seating_layout = Column(JSON, nullable=True)  # { seats: [], adjacency: [] }
    seat_count = Column(Integer, nullable=False)
    rsa_public_key = Column(String, nullable=True)  # Center's RSA-2048 public key (PEM)
    created_at = Column(DateTime, server_default=func.now())
