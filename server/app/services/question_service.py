"""
Question Service — CRUD + auto-encryption.

All question content is AES-256-GCM encrypted before storage.
Plaintext never persists in the database.
"""


class QuestionService:
    """Manages encrypted question lifecycle."""

    async def create(self, subject: str, difficulty: str, content: str, options: list, correct_option: int, author_id: str):
        """Create a question: encrypt content with AES-256-GCM, store ciphertext, log audit."""
        # TODO: Implement
        ...

    async def get(self, question_id: str):
        """Get question metadata (does not decrypt content)."""
        # TODO: Implement
        ...

    async def list_all(self, page: int = 1, page_size: int = 20):
        """List questions with pagination."""
        # TODO: Implement
        ...

    async def update(self, question_id: str, content: str, options: list, editor_id: str):
        """Update and re-encrypt question content."""
        # TODO: Implement
        ...

    async def delete(self, question_id: str):
        """Soft-delete a question."""
        # TODO: Implement
        ...
