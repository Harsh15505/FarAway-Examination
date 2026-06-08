"""Pydantic schemas for Authentication (edge) request/response validation."""

from pydantic import BaseModel


class QRTokenPayload(BaseModel):
    """Decoded QR token payload for validation."""
    candidate_id: str
    exam_id: str
    center_id: str
    nonce: str
    issued_at: str
    expires_at: str
    signature: str  # Base64 RSA-2048 signature


class AuthRequest(BaseModel):
    """Full authentication request: QR data + face image."""
    qr_data: str  # Raw QR code content (JSON)
    face_image_base64: str | None = None  # Optional face capture


class AuthResponse(BaseModel):
    """Authentication result with JWT session token."""
    session_id: str
    token: str  # RSA-signed JWT
    variant_id: int
    expires_at: str
