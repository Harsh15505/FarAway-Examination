"""
Edge JWT Verification Middleware — Edge mode only.

Validates per-node RSA-signed JWTs for candidate sessions.
No Clerk dependency — fully offline.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()


async def verify_edge_jwt(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Dependency: verify edge-local RSA-signed JWT and return session claims.

    Returns:
        dict with keys: session_id, candidate_id, exam_id, variant_id
    """
    token = credentials.credentials
    # TODO: Verify RSA signature with edge node's public key
    # TODO: Check token expiration
    # TODO: Extract and return session claims
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Edge JWT verification not yet implemented",
    )
