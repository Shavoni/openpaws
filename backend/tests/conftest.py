"""Pytest configuration and shared fixtures for OpenPaws backend tests."""
import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient


# ---------------------------------------------------------------------------
# ID fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def test_org_id() -> str:
    """Return a deterministic organization UUID for tests."""
    return "a1b2c3d4-e5f6-7890-abcd-ef1234567890"


@pytest.fixture
def test_user_id() -> str:
    """Return a deterministic user UUID for tests."""
    return "f0e1d2c3-b4a5-6789-0abc-def123456789"


# ---------------------------------------------------------------------------
# Supabase mock
# ---------------------------------------------------------------------------

@pytest.fixture
def mock_supabase() -> AsyncMock:
    """Provide a fully-mocked async Supabase client.

    The mock supports chained query-builder calls such as:
        supabase.table('posts').select('*').eq('id', ...).execute()
    """
    client = AsyncMock()

    # Build a chain-able query mock
    query = AsyncMock()
    query.select.return_value = query
    query.insert.return_value = query
    query.update.return_value = query
    query.delete.return_value = query
    query.eq.return_value = query
    query.neq.return_value = query
    query.in_.return_value = query
    query.order.return_value = query
    query.limit.return_value = query
    query.range.return_value = query
    query.single.return_value = query
    query.execute.return_value = MagicMock(data=[], count=0)

    client.table.return_value = query

    # Auth helpers
    client.auth = AsyncMock()
    client.auth.sign_up.return_value = MagicMock(
        user=MagicMock(id=str(uuid.uuid4()), email="test@example.com"),
        session=MagicMock(access_token="test-access-token", refresh_token="test-refresh-token"),
    )
    client.auth.sign_in_with_password.return_value = MagicMock(
        user=MagicMock(id=str(uuid.uuid4()), email="test@example.com"),
        session=MagicMock(access_token="test-access-token", refresh_token="test-refresh-token"),
    )
    client.auth.get_user.return_value = MagicMock(
        user=MagicMock(id=str(uuid.uuid4()), email="test@example.com"),
    )

    # Storage helpers
    storage_bucket = MagicMock()
    storage_bucket.upload.return_value = MagicMock(path="uploads/test.png")
    storage_bucket.get_public_url.return_value = "https://storage.example.com/uploads/test.png"
    client.storage.from_.return_value = storage_bucket

    return client


# ---------------------------------------------------------------------------
# Settings mock
# ---------------------------------------------------------------------------

@pytest.fixture
def mock_settings() -> MagicMock:
    """Provide a mock Settings object with sensible defaults."""
    settings = MagicMock()
    settings.SUPABASE_URL = "https://test.supabase.co"
    settings.SUPABASE_KEY = "test-supabase-key"
    settings.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key"
    settings.JWT_SECRET = "test-jwt-secret-key-for-testing"
    settings.JWT_ALGORITHM = "HS256"
    settings.JWT_EXPIRATION_MINUTES = 60
    settings.OPENAI_API_KEY = "test-openai-key"
    settings.ANTHROPIC_API_KEY = "test-anthropic-key"
    settings.REDIS_URL = "redis://localhost:6379/1"
    settings.ENVIRONMENT = "test"
    settings.DEBUG = True
    settings.CORS_ORIGINS = ["http://localhost:3000"]
    return settings


# ---------------------------------------------------------------------------
# FastAPI app / TestClient fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def app(mock_supabase: AsyncMock, mock_settings: MagicMock) -> FastAPI:
    """Create a FastAPI application with dependency overrides for testing."""
    from app.core.deps import get_settings, get_supabase

    test_app = FastAPI(title="OpenPaws Test")

    # Import and include routers
    try:
        from app.api.v1.router import api_router
        test_app.include_router(api_router, prefix="/api/v1")
    except ImportError:
        # Routers may not exist yet during early TDD phases
        pass

    # Override dependencies
    test_app.dependency_overrides[get_supabase] = lambda: mock_supabase
    test_app.dependency_overrides[get_settings] = lambda: mock_settings

    return test_app


@pytest.fixture
def client(app: FastAPI) -> TestClient:
    """Synchronous test client."""
    return TestClient(app)


@pytest.fixture
async def async_client(app: FastAPI):
    """Async test client using httpx.AsyncClient."""
    from httpx import ASGITransport, AsyncClient

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# ---------------------------------------------------------------------------
# Auth helper fixture
# ---------------------------------------------------------------------------

@pytest.fixture
def auth_headers(test_user_id: str) -> dict[str, str]:
    """Return authorization headers with a test bearer token."""
    return {"Authorization": "Bearer test-access-token"}
