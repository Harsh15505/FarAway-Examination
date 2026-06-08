"""Pydantic schemas for Question API request/response validation."""

from pydantic import BaseModel


class QuestionCreate(BaseModel):
    """Request body for creating a question."""
    subject: str
    difficulty: str  # easy, medium, hard
    content: str  # Plaintext — will be encrypted before storage
    options: list[str]
    correct_option: int  # 0-indexed


class QuestionResponse(BaseModel):
    """Response body for question metadata (encrypted content not exposed)."""
    id: str
    subject: str
    difficulty: str
    content_hash: str
    created_by: str
    created_at: str

    model_config = {"from_attributes": True}
