"""Supabase client management.

Provides async-compatible client initialization/teardown for the
FastAPI application lifecycle, plus a synchronous getter for use
inside Celery worker tasks.
"""

from __future__ import annotations

from typing import Any

import structlog
from supabase import Client, create_client

from app.config import settings

logger = structlog.get_logger(__name__)

# Module-level singleton (initialised at startup, closed at shutdown)
_supabase_client: Client | None = None


def init_supabase() -> Client:
    """Create and cache the Supabase client singleton.

    Should be called once during the FastAPI ``lifespan`` startup
    event.

    Returns:
        The initialised Supabase ``Client``.
    """
    global _supabase_client  # noqa: PLW0603
    _supabase_client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_KEY,
    )
    logger.info("supabase_client_initialized", url=settings.SUPABASE_URL)
    return _supabase_client


def close_supabase() -> None:
    """Release the Supabase client on application shutdown."""
    global _supabase_client  # noqa: PLW0603
    if _supabase_client is not None:
        # supabase-py does not expose a close method; clear the reference
        _supabase_client = None
        logger.info("supabase_client_closed")


def get_supabase() -> Client:
    """FastAPI dependency that returns the Supabase client.

    Raises:
        RuntimeError: If the client has not been initialised.

    Returns:
        The active Supabase ``Client``.
    """
    if _supabase_client is None:
        raise RuntimeError(
            "Supabase client is not initialised. "
            "Ensure init_supabase() is called during application startup."
        )
    return _supabase_client


def get_supabase_sync() -> Client:
    """Return the Supabase client for synchronous contexts (e.g. Celery workers).

    If the client has not been initialised yet (common in worker
    processes), this function will create it on the fly.

    Returns:
        The Supabase ``Client``.
    """
    global _supabase_client  # noqa: PLW0603
    if _supabase_client is None:
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY,
        )
        logger.info("supabase_client_initialized_sync", url=settings.SUPABASE_URL)
    return _supabase_client
