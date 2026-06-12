"""Pydantic schemas for Center API request/response validation."""

from pydantic import BaseModel


class CenterCreate(BaseModel):
    """Request body for creating a center."""
    name: str
    code: str
    city: str = ""
    state: str = ""
    seat_count: int
    address: str = ""


class CenterUpdate(BaseModel):
    """Request body for updating a center."""
    name: str | None = None
    city: str | None = None
    state: str | None = None
    seat_count: int | None = None
    address: str | None = None


class CenterResponse(BaseModel):
    """Response body for center details."""
    id: str
    name: str
    code: str
    seat_count: int
    city: str
    state: str
    address: str
    risk_score: float
    status: str
    created_at: str

    model_config = {"from_attributes": True}


class CenterListResponse(BaseModel):
    """Paginated center list."""
    items: list[CenterResponse]
    total: int
    page: int
    page_size: int
