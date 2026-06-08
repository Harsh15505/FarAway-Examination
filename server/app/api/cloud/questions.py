"""
Cloud API — Question Management

CRUD endpoints for encrypted questions.
Protected by Clerk JWT middleware.
"""

from fastapi import APIRouter, Depends

router = APIRouter(prefix="/questions")


@router.post("/")
async def create_question():
    """Create a new question. Content is AES-256-GCM encrypted before storage."""
    # TODO: Validate input, encrypt content, store in PostgreSQL, log audit event
    ...


@router.get("/")
async def list_questions():
    """List all questions (metadata only — encrypted content not returned)."""
    # TODO: Return paginated question metadata
    ...


@router.get("/{question_id}")
async def get_question(question_id: str):
    """Get question details by ID."""
    # TODO: Return question metadata + encrypted content
    ...


@router.put("/{question_id}")
async def update_question(question_id: str):
    """Update a question. Re-encrypts content on save."""
    # TODO: Validate, re-encrypt, update, log audit event
    ...


@router.delete("/{question_id}")
async def delete_question(question_id: str):
    """Soft-delete a question."""
    # TODO: Set is_deleted=True, log audit event
    ...
