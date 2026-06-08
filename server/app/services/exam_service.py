"""
Exam Service — compilation, graph coloring, variant generation.

Compiles an exam from blueprint: selects questions, runs graph coloring,
generates variant mappings, creates signed package.
"""


class ExamService:
    """Manages exam lifecycle from creation to compilation."""

    async def create(self, name: str, subject: str, duration_minutes: int, blueprint: dict, author_id: str):
        """Create an exam definition."""
        # TODO: Implement
        ...

    async def compile(self, exam_id: str):
        """Compile exam: select questions per blueprint, run graph coloring, generate package."""
        # TODO: Implement
        ...

    async def release_key(self, exam_id: str, center_id: str):
        """Admin-triggered key release (D-012). Encrypt AES key with center RSA public key."""
        # TODO: Implement
        ...

    async def get(self, exam_id: str):
        """Get exam details."""
        # TODO: Implement
        ...

    async def list_all(self):
        """List all exams."""
        # TODO: Implement
        ...
