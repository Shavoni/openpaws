"""Integration tests for authentication API routes."""
import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest


class TestSignup:
    """Tests for the POST /api/v1/auth/signup endpoint."""

    @pytest.mark.asyncio
    async def test_signup_creates_user(self, async_client, mock_supabase: AsyncMock):
        """A valid signup request should create a user and return tokens."""
        user_id = str(uuid.uuid4())
        mock_supabase.auth.sign_up.return_value = MagicMock(
            user=MagicMock(id=user_id, email="newuser@example.com"),
            session=MagicMock(
                access_token="new-access-token",
                refresh_token="new-refresh-token",
            ),
        )

        response = await async_client.post(
            "/api/v1/auth/signup",
            json={
                "email": "newuser@example.com",
                "password": "SecureP@ssw0rd!",
                "full_name": "New User",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == "newuser@example.com"
        mock_supabase.auth.sign_up.assert_called_once()


class TestLogin:
    """Tests for the POST /api/v1/auth/login endpoint."""

    @pytest.mark.asyncio
    async def test_login_returns_tokens(self, async_client, mock_supabase: AsyncMock):
        """A valid login should return access and refresh tokens."""
        user_id = str(uuid.uuid4())
        mock_supabase.auth.sign_in_with_password.return_value = MagicMock(
            user=MagicMock(id=user_id, email="existing@example.com"),
            session=MagicMock(
                access_token="login-access-token",
                refresh_token="login-refresh-token",
            ),
        )

        response = await async_client.post(
            "/api/v1/auth/login",
            json={
                "email": "existing@example.com",
                "password": "SecureP@ssw0rd!",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["access_token"] == "login-access-token"
        assert data["refresh_token"] == "login-refresh-token"
        mock_supabase.auth.sign_in_with_password.assert_called_once()


class TestProtectedRoute:
    """Tests for authentication enforcement on protected routes."""

    @pytest.mark.asyncio
    async def test_protected_route_requires_auth(self, async_client):
        """Accessing a protected route without a token should return 401."""
        response = await async_client.get("/api/v1/organizations")

        assert response.status_code in (401, 403), (
            f"Expected 401/403 for unauthenticated request, got {response.status_code}"
        )
