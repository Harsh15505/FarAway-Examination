"""
Edge API — Monitoring

Security event ingestion from desktop kiosk (MediaPipe alerts).
Protected by edge-local RSA-signed JWT.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from server.app.db.database import get_db
from server.app.middleware.edge_auth import verify_edge_jwt
from server.app.schemas.monitoring import (
    DetectionFrameRequest,
    DetectionResultResponse,
    EventListResponse,
    SecurityAlertResponse,
    SessionSummaryResponse,
)
from server.app.services.monitoring_service import MonitoringService
from shared.monitoring.rule_engine import DetectionFrame

router = APIRouter(prefix="/monitoring")


def _get_monitoring_service(db: AsyncSession = Depends(get_db)) -> MonitoringService:
    return MonitoringService(db)


@router.post("/event", response_model=DetectionResultResponse)
async def report_security_event(
    data: DetectionFrameRequest,
    auth: dict = Depends(verify_edge_jwt),
    svc: MonitoringService = Depends(_get_monitoring_service),
):
    """Report a security event from the desktop kiosk (e.g. multiple faces, gaze deviation)."""
    frame = DetectionFrame(
        session_id=data.session_id,
        candidate_id=data.candidate_id,
        face_count=data.face_count,
        gaze_yaw=data.gaze_yaw,
        gaze_pitch=data.gaze_pitch,
        camera_active=data.camera_active,
        answer_changes_last_30s=data.answer_changes_last_30s,
        timestamp=data.timestamp,
    )

    alerts = await svc.process_frame(frame)

    return DetectionResultResponse(
        alerts_generated=len(alerts),
        alerts=[
            SecurityAlertResponse(
                alert_type=a.alert_type.value,
                severity=a.severity.value,
                details=a.details,
                evidence_hash=a.evidence_hash,
            )
            for a in alerts
        ],
        message=f"{len(alerts)} alert(s) generated" if alerts else "No anomalies detected",
    )


@router.get("/events", response_model=EventListResponse)
async def list_events(
    session_id: str | None = None,
    severity: str | None = None,
    event_type: str | None = None,
    page: int = 1,
    page_size: int = 50,
    auth: dict = Depends(verify_edge_jwt),
    svc: MonitoringService = Depends(_get_monitoring_service),
):
    """List security events for proctor dashboard."""
    result = await svc.list_events(
        session_id=session_id,
        severity=severity,
        event_type=event_type,
        page=page,
        page_size=page_size,
    )
    return EventListResponse(**result)


@router.get("/events/{session_id}/summary", response_model=SessionSummaryResponse)
async def get_session_summary(
    session_id: str,
    auth: dict = Depends(verify_edge_jwt),
    svc: MonitoringService = Depends(_get_monitoring_service),
):
    """Get anomaly summary for a specific session."""
    result = await svc.get_session_summary(session_id)
    if result["total_events"] == 0:
        return SessionSummaryResponse(**result)
    return SessionSummaryResponse(**result)
