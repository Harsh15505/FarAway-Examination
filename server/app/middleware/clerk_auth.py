"""
Clerk JWT Verification Middleware — Cloud mode only.

Validates Clerk session tokens on every cloud API request.
Extracts user_id, role from Clerk claims for RBAC.

Dev bypass: if CLERK_SECRET_KEY is not set, returns a mock admin claim
so development works without Clerk credentials.
"""

from __future__ import annotations

import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from server.app.config import settings

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)

# Clerk JWKS URL template — replace with your Clerk frontend API URL
# Format: https://<your-clerk-frontend-api>/.well-known/jwks.json
CLERK_JWKS_URL = "https://api.clerk.dev/.well-known/jwks.json"


def _extract_role_from_claims(claims: dict) -> str:
    """
    Extract role from Clerk JWT claims.

    Clerk stores custom metadata in `publicMetadata` or `metadata`.
    Falls back to 'expert' if no role is set (safe default).
    """
    # Clerk puts public metadata under 'public_metadata' or 'metadata'
    metadata = claims.get("public_metadata", claims.get("metadata", {}))
    return metadata.get("role", "expert")


async def verify_clerk_jwt(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    FastAPI dependency: verify Clerk JWT and return user claims.

    Dev mode: if CLERK_SECRET_KEY is empty, allows any Bearer token and
    returns a mock admin claim. This prevents blocking development.

    Returns:
        dict with keys: clerk_user_id, role, email
    """
    # --- Dev bypass ---
    if not settings.clerk_secret_key:
        logger.warning(
            "CLERK_SECRET_KEY not set — running in dev bypass mode. "
            "All requests treated as admin. Do NOT use in production."
        )
        if credentials is None:
            # Completely unauthenticated — still give dev access
            return {
                "clerk_user_id": "dev_user",
                "role": "admin",
                "email": "dev@fortisexam.local",
            }
        return {
            "clerk_user_id": credentials.credentials[:16] if credentials else "dev_user",
            "role": "admin",
            "email": "dev@fortisexam.local",
        }

    # --- Production: real Clerk JWT verification ---
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )

    token = credentials.credentials
    try:
        from shared.crypto.jwt_handler import JWTHandler

        claims = JWTHandler.decode_clerk_jwt(token, jwks_url=CLERK_JWKS_URL)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Clerk JWT: {exc}",
        ) from exc

    return {
        "clerk_user_id": claims.get("sub", ""),
        "role": _extract_role_from_claims(claims),
        "email": claims.get("email", ""),
        "raw_claims": claims,
    }


def require_role(*required_roles: str):
    """
    Dependency factory: enforce RBAC on a route.

    Usage:
        @router.post("/questions", dependencies=[Depends(require_role("admin", "expert"))])

    Args:
        *required_roles: One or more role strings that are permitted.

    Returns:
        FastAPI dependency function that validates the user role.
    """

    async def _check_role(
        claims: dict = Depends(verify_clerk_jwt),
    ) -> dict:
        user_role = claims.get("role", "")
        if user_role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required: {list(required_roles)}, got: '{user_role}'",
            )
        return claims

    return _check_role
