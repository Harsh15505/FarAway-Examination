"""
Edge API — Monitoring

Security event ingestion from desktop kiosk (MediaPipe alerts).
Protected by edge-local RSA-signed JWT.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/monitoring")


@router.post("/event")
async def report_security_event():
    """Report a security event from the desktop kiosk (e.g. multiple faces, gaze deviation)."""
    # TODO: Store event, notify proctor (WebSocket), log audit
    ...


@router.get("/events")
async def list_events():
    """List security events for proctor dashboard."""
    # TODO: Return paginated events with severity
    ...
