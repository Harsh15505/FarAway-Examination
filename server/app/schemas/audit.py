"""Pydantic schemas for Audit API request/response validation."""

from pydantic import BaseModel


class AuditEventResponse(BaseModel):
    """Response body for a single audit event."""
    id: str
    sequence: int
    event_type: str
    actor_id: str
    payload_hash: str
    previous_hash: str
    event_hash: str
    created_at: str

    model_config = {"from_attributes": True}


class ChainVerificationResult(BaseModel):
    """Result of hash chain integrity verification."""
    is_valid: bool
    total_events: int
    first_broken_link: int | None = None
    message: str
