"""
AES-256-GCM Encryption/Decryption

Used for:
  - Question content encryption at rest
  - Exam package encryption for distribution
  - Recovery snapshot encryption (optional)

Spec: NIST SP 800-38D
"""


class AESCipher:
    """AES-256-GCM authenticated encryption."""

    @staticmethod
    def generate_key() -> bytes:
        """Generate a random 256-bit AES key."""
        # TODO: return os.urandom(32)
        ...

    @staticmethod
    def encrypt(plaintext: bytes, key: bytes) -> tuple[bytes, bytes, bytes]:
        """
        Encrypt plaintext with AES-256-GCM.

        Returns:
            (ciphertext, nonce, tag)
        """
        # TODO: Implement using cryptography.hazmat
        ...

    @staticmethod
    def decrypt(ciphertext: bytes, key: bytes, nonce: bytes, tag: bytes) -> bytes:
        """
        Decrypt AES-256-GCM ciphertext.

        Returns:
            plaintext bytes

        Raises:
            InvalidTag: if ciphertext has been tampered with
        """
        # TODO: Implement using cryptography.hazmat
        ...
