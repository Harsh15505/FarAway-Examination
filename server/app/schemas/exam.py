"""Pydantic schemas for Exam API request/response validation."""

from pydantic import BaseModel


class ExamCreate(BaseModel):
    """Request body for creating an exam."""
    name: str
    subject: str
    duration_minutes: int
    blueprint: dict  # { difficulty_distribution: { easy: N, medium: N, hard: N } }


class ExamResponse(BaseModel):
    """Response body for exam details."""
    id: str
    name: str
    subject: str
    status: str
    duration_minutes: str
    created_at: str

    model_config = {"from_attributes": True}
