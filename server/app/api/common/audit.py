"""
Common API — Audit Trail

Hash-chained audit ledger endpoints.
Available in both cloud and edge modes.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/audit")


@router.get("/chain")
async def get_audit_chain():
    """Get the full audit chain for verification."""
    # TODO: Return ordered chain of audit events with hashes
    ...


@router.post("/verify")
async def verify_chain():
    """Verify the integrity of the hash chain. Detects tampering."""
    # TODO: Walk chain, verify each hash link, return result
    ...


@router.get("/events")
async def list_audit_events():
    """List audit events with filtering."""
    # TODO: Return paginated audit events
    ...
