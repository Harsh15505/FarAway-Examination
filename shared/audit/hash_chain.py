"""
Hash Chain — cryptographic event chain for tamper-evident audit trail.

Each event hash = SHA-256(sequence || payload_hash || previous_hash).
Tampering with any event breaks the chain from that point forward.
"""


class HashChain:
    """Linear hash chain for audit events."""

    def __init__(self, genesis_hash: str = "0" * 64):
        """Initialize chain with genesis hash."""
        self._previous_hash = genesis_hash

    def append(self, sequence: int, payload_hash: str) -> str:
        """
        Compute hash for next event in chain.

        Args:
            sequence: Monotonic event counter
            payload_hash: SHA-256 of event payload

        Returns:
            event_hash: SHA-256(sequence + payload_hash + previous_hash)
        """
        # TODO: Implement
        ...

    @property
    def previous_hash(self) -> str:
        """Get the hash of the most recent event (chain head)."""
        return self._previous_hash
