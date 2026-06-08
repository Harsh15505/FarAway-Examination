"""
FortisExam — Test Configuration

Shared fixtures for all test types (unit, integration, security).
"""

import pytest


@pytest.fixture
def aes_key():
    """Generate a test AES-256 key."""
    return b'\x00' * 32  # TODO: Use os.urandom(32)


@pytest.fixture
def rsa_key_pair():
    """Generate a test RSA-2048 key pair."""
    # TODO: Generate ephemeral key pair for testing
    return (b"private_key_pem", b"public_key_pem")


@pytest.fixture
def sample_question():
    """Sample question data for testing."""
    return {
        "subject": "Mathematics",
        "difficulty": "medium",
        "content": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correct_option": 1,
    }


@pytest.fixture
def sample_audit_events():
    """Sample audit events for chain testing."""
    return [
        {"event_type": "QUESTION_CREATED", "actor_id": "user-1", "payload": {"question_id": "q-1"}},
        {"event_type": "QUESTION_CREATED", "actor_id": "user-1", "payload": {"question_id": "q-2"}},
        {"event_type": "PACKAGE_GENERATED", "actor_id": "user-1", "payload": {"package_id": "p-1"}},
    ]
