"""
Cloud API — Center Management

CRUD endpoints for exam centers.
Protected by Clerk JWT middleware.

Routes:
  POST   /centers/            — Create center
  GET    /centers/            — List all centers
  GET    /centers/{center_id} — Get center details
  PUT    /centers/{center_id} — Update center
  DELETE /centers/{center_id} — Delete center
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.db.database import get_db
from server.app.middleware.clerk_auth import require_role
from server.app.schemas.center import CenterCreate, CenterUpdate
from server.app.services.center_service import CenterService

router = APIRouter(prefix="/centers")


def _get_center_service(db: AsyncSession = Depends(get_db)) -> CenterService:
    return CenterService(db)


@router.post("/", status_code=201)
async def create_center(
    data: CenterCreate,
    auth: dict = Depends(require_role("admin", "center_admin")),
    svc: CenterService = Depends(_get_center_service),
):
    """Create a new exam center."""
    center = await svc.create(
        name=data.name,
        code=data.code,
        seat_count=data.seat_count,
        city=data.city,
        state=data.state,
        address=data.address,
    )
    await svc.db.commit()
    return {"id": str(center.id), "status": "created"}


@router.get("/")
async def list_centers(
    page: int = 1,
    page_size: int = 50,
    auth: dict = Depends(require_role("admin", "center_admin")),
    svc: CenterService = Depends(_get_center_service),
):
    """List all centers."""
    return await svc.list_all(page=page, page_size=page_size)


@router.get("/{center_id}")
async def get_center(
    center_id: str,
    auth: dict = Depends(require_role("admin", "center_admin")),
    svc: CenterService = Depends(_get_center_service),
):
    """Get center details."""
    try:
        return await svc.get(center_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{center_id}")
async def update_center(
    center_id: str,
    data: CenterUpdate,
    auth: dict = Depends(require_role("admin", "center_admin")),
    svc: CenterService = Depends(_get_center_service),
):
    """Update a center."""
    try:
        result = await svc.update(
            center_id=center_id,
            name=data.name,
            city=data.city,
            state=data.state,
            seat_count=data.seat_count,
            address=data.address,
        )
        await svc.db.commit()
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{center_id}")
async def delete_center(
    center_id: str,
    auth: dict = Depends(require_role("admin")),
    svc: CenterService = Depends(_get_center_service),
):
    """Delete a center."""
    try:
        await svc.delete_center(center_id)
        await svc.db.commit()
        return {"id": center_id, "status": "deleted"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
