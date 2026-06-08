"""
Clerk JWT Verification Middleware — Cloud mode only.

Validates Clerk session tokens on every cloud API request.
Extracts user_id, role from Clerk claims for RBAC.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()


async def verify_clerk_jwt(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Dependency: verify Clerk JWT and return user claims.

    Returns:
        dict with keys: clerk_user_id, role, email
    """
    token = credentials.credentials
    # TODO: Verify JWT signature against Clerk JWKS
    # TODO: Check token expiration
    # TODO: Extract and return claims
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Clerk JWT verification not yet implemented",
    )


async def require_role(required_roles: list[str]):
    """
    Dependency factory: enforce RBAC on a route.

    Usage:
        @router.post("/questions", dependencies=[Depends(require_role(["admin", "expert"]))])
    """
    async def _check_role(
        claims: dict = Depends(verify_clerk_jwt),
    ):
        if claims.get("role") not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires one of: {required_roles}",
            )
        return claims

    return _check_role
