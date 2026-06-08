"""
JWT Handler — Token creation and verification.

Two JWT modes:
  - Cloud: Clerk-issued JWTs (verified via JWKS, not created here)
  - Edge: Custom RSA-signed JWTs (created and verified locally per-node)
"""


class JWTHandler:
    """JWT creation and verification for edge-local sessions."""

    @staticmethod
    def create_token(payload: dict, private_key_pem: bytes, expires_minutes: int = 180) -> str:
        """Create RSA-signed JWT for edge session."""
        # TODO: Implement with PyJWT + RS256 algorithm
        ...

    @staticmethod
    def verify_token(token: str, public_key_pem: bytes) -> dict:
        """Verify RSA-signed JWT and return payload."""
        # TODO: Implement with PyJWT + RS256 algorithm
        ...

    @staticmethod
    def decode_clerk_jwt(token: str, jwks_url: str) -> dict:
        """Verify Clerk-issued JWT against Clerk JWKS endpoint (cloud mode)."""
        # TODO: Fetch JWKS, verify signature, return claims
        ...
