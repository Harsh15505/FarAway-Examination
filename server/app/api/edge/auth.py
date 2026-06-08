"""
Edge API — Candidate Authentication

QR token validation + face embedding comparison.
Offline — no Clerk dependency. Uses custom RSA-signed JWTs.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/auth")


@router.post("/authenticate")
async def authenticate():
    """Full dual-factor authentication: QR token + face verification."""
    # TODO: Verify QR RSA signature, check nonce, compare face embedding, create JWT session
    ...


@router.post("/supervisor-override")
async def supervisor_override():
    """Manual authentication override by invigilator. Audit-logged."""
    # TODO: Verify invigilator credentials, create session, log audit event
    ...
