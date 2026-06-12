"""
Cloud API — Dashboard Statistics (GAP-6)

Aggregates counts from Questions, Exams, and Audit tables
for the admin dashboard stat cards.

Route:
  GET /dashboard/stats  → DashboardStats
"""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.db.database import get_db
from server.app.middleware.clerk_auth import require_role
from server.app.models.question import Question
from server.app.models.exam import Exam

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(
    auth: dict = Depends(require_role("admin", "expert", "auditor")),
    db: AsyncSession = Depends(get_db),
):
    """
    Aggregated statistics for the Admin Dashboard.

    Returns totals for questions, exams, and recent audit activity.
    Centers count is a placeholder until GAP-1/2/3 are implemented.
    """
    try:
        # Total non-deleted questions
        q_count = await db.scalar(
            select(func.count()).select_from(Question).where(Question.is_deleted == False)
        )

        # Exam counts by status
        exam_total = await db.scalar(
            select(func.count()).select_from(Exam)
        )
        exam_active = await db.scalar(
            select(func.count()).select_from(Exam).where(Exam.status == "active")
        )

        return {
            "total_questions": q_count or 0,
            "total_exams": exam_total or 0,
            "total_centers": 8,          # placeholder until Centers CRUD (GAP-1/2/3)
            "total_audit_events": 0,     # Audit chain is in SQLite edge mode — not available here
            "active_sessions": exam_active or 0,
            "critical_alerts": 0,
            "recent_activity": [
                {
                    "id": "sys-1",
                    "type": "INFO",
                    "message": f"System online — {q_count or 0} questions in vault",
                    "actor": "system",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            ],
            "package_distribution_status": [],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard stats error: {e}")
