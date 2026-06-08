"""
Distribution Service — package delivery to edge nodes.

Pushes encrypted packages and wrapped keys to center edge servers.
"""


class DistributionService:
    """Manages package distribution to exam centers."""

    async def distribute(self, exam_id: str, center_ids: list[str]):
        """Distribute encrypted package to specified centers."""
        # TODO: Implement
        ...

    async def get_status(self, exam_id: str) -> dict:
        """Get distribution status for all centers."""
        # TODO: Implement
        ...
