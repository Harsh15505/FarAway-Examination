"""
SHA-256 Hashing Utilities

Used for:
  - Content hash generation (question, answer, package)
  - Audit chain hash linking
  - Nonce generation

Spec: FIPS 180-4
"""

import hashlib


class HashUtils:
    """SHA-256 hashing and utility functions."""

    @staticmethod
    def sha256(data: bytes) -> str:
        """Compute SHA-256 hex digest."""
        return hashlib.sha256(data).hexdigest()

    @staticmethod
    def sha256_json(obj: dict) -> str:
        """Compute SHA-256 of JSON-serialized dict (deterministic)."""
        # TODO: Use json.dumps with sort_keys=True for determinism
        ...

    @staticmethod
    def generate_nonce(length: int = 32) -> str:
        """Generate a cryptographically secure random nonce."""
        # TODO: Use secrets.token_hex(length)
        ...
