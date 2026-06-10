"""Integration tests for Question Cloud API endpoints."""

import pytest
from fastapi.testclient import TestClient

from server.app.main import app
from server.app.middleware.clerk_auth import require_role
from server.app.api.cloud.questions import get_question_service

client = TestClient(app)

# Mock auth dependency
async def mock_require_role():
    return {"clerk_user_id": "test_admin", "role": "admin"}


class MockQuestionService:
    async def create(self, subject, difficulty, content, options, correct_option, author_id):
        from unittest.mock import MagicMock
        from uuid import uuid4
        q = MagicMock()
        q.id = uuid4()
        return q

    async def list_all(self, page, page_size):
        return [{"id": "1", "subject": "Math", "difficulty": "easy", "created_by": "test_admin", "content_hash": "hash"}]

    async def get(self, question_id):
        return {"id": question_id, "subject": "Math", "content": "2+2?", "options": ["4"], "correct_option": 0}

    async def update(self, **kwargs):
        return {"id": kwargs["question_id"], "status": "updated"}

    async def delete(self, question_id, deleter_id):
        return True


# Override dependencies
app.dependency_overrides[require_role("admin", "expert")] = mock_require_role
app.dependency_overrides[require_role("admin")] = mock_require_role
app.dependency_overrides[get_question_service] = lambda: MockQuestionService()


def test_create_question():
    response = client.post(
        "/api/v1/questions/",
        json={
            "subject": "Math",
            "difficulty": "medium",
            "content": "What is 2+2?",
            "options": ["3", "4", "5", "6"],
            "correct_option": 1
        }
    )
    assert response.status_code == 200
    assert "id" in response.json()
    assert response.json()["status"] == "created"


def test_list_questions():
    response = client.get("/api/v1/questions/")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_question():
    response = client.get("/api/v1/questions/123")
    assert response.status_code == 200
    assert response.json()["subject"] == "Math"


def test_update_question():
    response = client.put(
        "/api/v1/questions/123",
        json={
            "subject": "Science",
            "difficulty": "hard",
            "content": "Water?",
            "options": ["H2O"],
            "correct_option": 0
        }
    )
    assert response.status_code == 200
    assert response.json()["status"] == "updated"


def test_delete_question():
    response = client.delete("/api/v1/questions/123")
    assert response.status_code == 200
    assert response.json()["status"] == "deleted"
