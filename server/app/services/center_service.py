"""
Center Service — CRUD operations for exam centers.

Manages center creation, listing, update, and deletion.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func as sa_func, delete
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.models.center import Center


class CenterService:
    """Manages exam center lifecycle."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        name: str,
        code: str,
        seat_count: int,
        city: str = "",
        state: str = "",
        address: str = "",
    ) -> Center:
        """Create a new exam center."""
        center = Center(
            id=str(uuid.uuid4()),
            name=name,
            code=code,
            city=city,
            state=state,
            address=address,
            seat_count=seat_count,
            risk_score=0.0,
            status="active",
        )
        self.db.add(center)
        await self.db.flush()
        return center

    async def get(self, center_id: str) -> dict:
        """Get center by ID."""
        stmt = select(Center).where(Center.id == center_id)
        result = await self.db.execute(stmt)
        center = result.scalar_one_or_none()

        if not center:
            raise ValueError(f"Center not found: {center_id}")

        return self._to_dict(center)

    async def list_all(self, page: int = 1, page_size: int = 50) -> dict:
        """List all centers with pagination."""
        count_stmt = select(sa_func.count()).select_from(Center)
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar() or 0

        stmt = (
            select(Center)
            .order_by(Center.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        result = await self.db.execute(stmt)
        centers = result.scalars().all()

        return {
            "items": [self._to_dict(c) for c in centers],
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    async def update(
        self,
        center_id: str,
        name: str | None = None,
        city: str | None = None,
        state: str | None = None,
        seat_count: int | None = None,
        address: str | None = None,
    ) -> dict:
        """Update a center."""
        stmt = select(Center).where(Center.id == center_id)
        result = await self.db.execute(stmt)
        center = result.scalar_one_or_none()

        if not center:
            raise ValueError(f"Center not found: {center_id}")

        if name is not None:
            center.name = name
        if city is not None:
            center.city = city
        if state is not None:
            center.state = state
        if seat_count is not None:
            center.seat_count = seat_count
        if address is not None:
            center.address = address

        await self.db.flush()
        return self._to_dict(center)

    async def delete_center(self, center_id: str) -> None:
        """Delete a center."""
        stmt = select(Center).where(Center.id == center_id)
        result = await self.db.execute(stmt)
        center = result.scalar_one_or_none()

        if not center:
            raise ValueError(f"Center not found: {center_id}")

        await self.db.delete(center)
        await self.db.flush()

    def _to_dict(self, center: Center) -> dict:
        """Convert Center model to dict."""
        return {
            "id": str(center.id),
            "name": center.name,
            "code": center.code,
            "city": center.city or "",
            "state": center.state or "",
            "address": center.address or "",
            "seat_count": center.seat_count,
            "risk_score": center.risk_score or 0.0,
            "status": center.status or "active",
            "created_at": center.created_at.isoformat() if center.created_at else "",
        }
