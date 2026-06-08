"""
Event Logger — structured audit event creation.

Creates audit events with deterministic JSON serialization,
computes payload hashes, and feeds to hash chain.
"""


class EventLogger:
    """Creates structured audit events for the hash chain."""

    # Event types
    QUESTION_CREATED = "QUESTION_CREATED"
    QUESTION_MODIFIED = "QUESTION_MODIFIED"
    PACKAGE_GENERATED = "PACKAGE_GENERATED"
    PACKAGE_DISTRIBUTED = "PACKAGE_DISTRIBUTED"
    KEY_RELEASED = "KEY_RELEASED"
    CANDIDATE_AUTHENTICATED = "CANDIDATE_AUTHENTICATED"
    ANSWER_SUBMITTED = "ANSWER_SUBMITTED"
    EXAM_SUBMITTED = "EXAM_SUBMITTED"
    SESSION_RECOVERED = "SESSION_RECOVERED"
    ANOMALY_DETECTED = "ANOMALY_DETECTED"

    def create_event(self, event_type: str, actor_id: str, payload: dict) -> dict:
        """
        Create a structured audit event.

        Returns:
            { event_type, actor_id, payload, payload_hash, timestamp }
        """
        # TODO: Serialize payload deterministically, compute SHA-256, add timestamp
        ...
