"""
Audit Service — hash-chained audit ledger.

Appends events to a hash chain where each event includes SHA-256 of the previous.
"""


class AuditService:
    """Manages the hash-chained audit ledger."""

    async def log_event(self, event_type: str, actor_id: str, payload: dict):
        """Append event to hash chain: compute hash, link to previous event."""
        # TODO: Implement
        ...

    async def get_chain(self) -> list:
        """Get full audit chain ordered by sequence."""
        # TODO: Implement
        ...

    async def verify_chain(self) -> dict:
        """Verify chain integrity. Walk and check each hash link."""
        # TODO: Implement
        ...

    async def list_events(self, event_type: str | None = None, page: int = 1, page_size: int = 50):
        """List events with optional type filtering."""
        # TODO: Implement
        ...
