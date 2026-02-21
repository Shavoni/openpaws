"""Synchronous Supabase client for route handlers."""

from supabase import Client, create_client

from app.config import settings

_sync_client: Client | None = None


def get_supabase_client() -> Client:
    """Return a sync Supabase client (used by auth/user routes)."""
    global _sync_client
    if _sync_client is None:
        _sync_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY,
        )
    return _sync_client
