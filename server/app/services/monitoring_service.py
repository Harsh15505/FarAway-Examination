"""
Monitoring Service — security event management (edge only).

Receives anomaly events from desktop kiosk and alerts proctor.
"""


class MonitoringService:
    """Security event ingestion and proctor notification."""

    async def report_event(self, session_id: str, event_type: str, severity: str, details: dict):
        """Record security event and notify proctor."""
        # TODO: Implement
        ...

    async def list_events(self, session_id: str | None = None, severity: str | None = None):
        """List security events with optional filtering."""
        # TODO: Implement
        ...
