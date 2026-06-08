"""
Cloud API — Distribution

Package distribution to edge nodes.
Protected by Clerk JWT middleware.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/distribution")


@router.post("/distribute/{exam_id}")
async def distribute_to_centers(exam_id: str):
    """Distribute encrypted package to registered center edge nodes."""
    # TODO: Push package + encrypted key to each center
    ...


@router.get("/status/{exam_id}")
async def distribution_status(exam_id: str):
    """Check distribution status for all centers."""
    ...
