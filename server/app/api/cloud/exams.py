"""
Cloud API — Exam Management

Exam configuration, compilation, and key release endpoints.
Protected by Clerk JWT middleware.

Routes:
  POST /exams/                      — Create exam
  GET  /exams/                      — List all exams
  GET  /exams/{exam_id}             — Get exam details
  POST /exams/{exam_id}/compile     — Compile exam into package
  POST /exams/{exam_id}/release-key — D-012: Admin-triggered AES key release
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.db.database import get_db
from server.app.schemas.packages import ReleaseKeyRequest, ReleaseKeyResponse
from server.app.services.distribution_service import DistributionService

router = APIRouter(prefix="/exams")


@router.post("/")
async def create_exam():
    """Create a new exam definition with blueprint."""
    # TODO: Validate blueprint, store exam, log audit event (Module 01)
    ...


@router.get("/")
async def list_exams():
    """List all exams with status."""
    # TODO: Query DB (Module 01)
    ...


@router.get("/{exam_id}")
async def get_exam(exam_id: str):
    """Get exam details."""
    # TODO: Query DB (Module 01)
    ...


@router.post("/{exam_id}/compile")
async def compile_exam(exam_id: str):
    """
    Compile exam: select questions per blueprint, generate variants via
    graph coloring, create signed+encrypted package.
    """
    # TODO: Select questions, run graph coloring, call PackageService.generate() (Module 01)
    ...


@router.post("/{exam_id}/release-key", response_model=ReleaseKeyResponse)
async def release_key(
    exam_id: str,
    request: ReleaseKeyRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Admin-triggered key release (D-012).

    The admin clicks this button at exam start time. The server wraps the
    package AES key with the center's RSA public key and returns it. Only
    the center's private key can unwrap it to decrypt the exam package.

    This is the hackathon simplification of "time-locked keys". In production,
    this would use TEE-enforced time verification (AWS Nitro Enclaves / HSM).

    Demo flow:
    1. Admin calls this endpoint with center's public key
    2. Server returns wrapped_key_b64
    3. Edge node unwraps with center private key → gets AES key
    4. Edge node decrypts package → exam content is live
    """
    svc = DistributionService(db)

    try:
        result = await svc.release_key(
            exam_id=exam_id,
            center_public_key_pem=request.center_public_key_pem,
        )
        await db.commit()
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return ReleaseKeyResponse(
        exam_id=result["exam_id"],
        package_id=result["package_id"],
        wrapped_key_b64=result["wrapped_key_b64"],
        released_at=result["released_at"],
    )
