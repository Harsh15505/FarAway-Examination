"""
Auth Service — QR validation + face embedding comparison (edge only).

Offline authentication: no Clerk, no internet.
Uses RSA-signed QR tokens and pre-computed face embeddings.
"""


class AuthService:
    """Candidate authentication on edge node."""

    async def authenticate(self, qr_data: str, face_image_base64: str | None = None):
        """Full dual-factor auth: verify QR signature + compare face embedding."""
        # TODO: Implement
        ...

    async def verify_qr_token(self, qr_data: str) -> dict:
        """Verify RSA-2048 signature on QR token, check nonce, validate assignment."""
        # TODO: Implement
        ...

    async def compare_face(self, candidate_id: str, face_image_base64: str) -> float:
        """Compare captured face against stored embedding. Returns similarity score."""
        # TODO: Implement
        ...

    async def create_session(self, candidate_id: str, exam_id: str, variant_id: int) -> dict:
        """Create edge-local JWT session signed with node's RSA key."""
        # TODO: Implement
        ...

    async def supervisor_override(self, invigilator_id: str, candidate_id: str, reason: str):
        """Manual override: create session without face verification. Audit-logged."""
        # TODO: Implement
        ...
