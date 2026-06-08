"""Unit tests — shared/crypto (AES, RSA, hashing, JWT)."""


class TestAESCipher:
    """AES-256-GCM encryption/decryption tests."""

    def test_encrypt_decrypt_roundtrip(self):
        """Encrypted data should decrypt to original plaintext."""
        # TODO: Implement
        ...

    def test_different_nonce_per_encryption(self):
        """Each encryption must produce a unique nonce."""
        # TODO: Implement
        ...

    def test_tampered_ciphertext_fails(self):
        """Modified ciphertext should raise InvalidTag."""
        # TODO: Implement
        ...


class TestRSASigner:
    """RSA-2048 signing/verification tests."""

    def test_sign_verify_roundtrip(self):
        """Signed data should verify with matching public key."""
        # TODO: Implement
        ...

    def test_wrong_key_fails_verification(self):
        """Signature should fail with wrong public key."""
        # TODO: Implement
        ...

    def test_key_wrapping_roundtrip(self):
        """AES key should survive RSA encrypt → decrypt."""
        # TODO: Implement
        ...


class TestHashChain:
    """Hash chain integrity tests."""

    def test_chain_links_correctly(self):
        """Each event hash should include previous event hash."""
        # TODO: Implement
        ...

    def test_tampered_event_breaks_chain(self):
        """Modifying any event should cause verification failure."""
        # TODO: Implement
        ...

    def test_empty_chain_is_valid(self):
        """An empty chain should verify as valid."""
        # TODO: Implement
        ...
