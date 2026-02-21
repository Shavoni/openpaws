"""Integration tests for post management API routes."""
import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest

from tests.factories import make_post


class TestCreatePost:
    """Tests for the POST /api/v1/posts endpoint."""

    @pytest.mark.asyncio
    async def test_create_post(
        self,
        async_client,
        mock_supabase: AsyncMock,
        auth_headers: dict[str, str],
        test_org_id: str,
        test_user_id: str,
    ):
        """Creating a post via the API should return the created post with 201."""
        new_post = make_post(
            organization_id=test_org_id,
            author_id=test_user_id,
            title="API Test Post",
            body="Content created via the API.",
            platform="twitter",
            status="draft",
        )

        # Mock the auth middleware to return a valid user
        mock_supabase.auth.get_user.return_value = MagicMock(
            user=MagicMock(id=test_user_id, email="test@example.com"),
        )

        # Mock the insert operation
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(
            data=[new_post]
        )

        response = await async_client.post(
            "/api/v1/posts",
            json={
                "organization_id": test_org_id,
                "title": "API Test Post",
                "body": "Content created via the API.",
                "platform": "twitter",
            },
            headers=auth_headers,
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "API Test Post"
        assert data["status"] == "draft"
        assert data["platform"] == "twitter"


class TestListPosts:
    """Tests for the GET /api/v1/posts endpoint."""

    @pytest.mark.asyncio
    async def test_list_posts_pagination(
        self,
        async_client,
        mock_supabase: AsyncMock,
        auth_headers: dict[str, str],
        test_org_id: str,
        test_user_id: str,
    ):
        """Listing posts should support pagination with limit/offset."""
        posts = [make_post(organization_id=test_org_id) for _ in range(3)]

        mock_supabase.auth.get_user.return_value = MagicMock(
            user=MagicMock(id=test_user_id, email="test@example.com"),
        )

        mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value.range.return_value.execute.return_value = MagicMock(
            data=posts, count=10
        )

        response = await async_client.get(
            "/api/v1/posts",
            params={
                "organization_id": test_org_id,
                "limit": 3,
                "offset": 0,
            },
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert len(data["items"]) == 3
        assert "total" in data


class TestApprovePostFlow:
    """Tests for the POST /api/v1/posts/{post_id}/approve endpoint."""

    @pytest.mark.asyncio
    async def test_approve_post_flow(
        self,
        async_client,
        mock_supabase: AsyncMock,
        auth_headers: dict[str, str],
        test_user_id: str,
    ):
        """Approving a post should update its status to 'approved'."""
        post = make_post(status="pending_review")
        approved_post = {**post, "status": "approved"}

        mock_supabase.auth.get_user.return_value = MagicMock(
            user=MagicMock(id=test_user_id, email="test@example.com"),
        )

        # Mock fetching the post
        mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
            data=post
        )

        # Mock updating the post
        mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[approved_post]
        )

        response = await async_client.post(
            f"/api/v1/posts/{post['id']}/approve",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "approved"
