"""Repository for social account operations."""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from supabase._async.client import AsyncClient

from app.db.repositories.base import BaseRepository

TABLE = "social_accounts"


class SocialAccountRepository(BaseRepository):
    """Data-access layer for the *social_accounts* table."""

    def __init__(self, client: AsyncClient) -> None:
        super().__init__(client)

    async def get_by_platform(
        self,
        org_id: UUID,
        platform: str,
    ) -> list[dict[str, Any]]:
        """Return all social accounts for a given platform within an organisation.

        Args:
            org_id: Organisation scope.
            platform: Platform name (twitter, instagram, linkedin, etc.).

        Returns:
            List of matching social account rows.
        """
        response = await (
            self._client.table(TABLE)
            .select("*")
            .eq("organization_id", str(org_id))
            .eq("platform", platform)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []

    async def update_tokens(
        self,
        account_id: UUID,
        access_token: str,
        refresh_token: Optional[str],
        expires_at: Optional[datetime],
        *,
        org_id: Optional[UUID] = None,
    ) -> Optional[dict[str, Any]]:
        """Refresh the OAuth tokens stored for a social account.

        Args:
            account_id: Social account primary key.
            access_token: New access token.
            refresh_token: New refresh token (may be None if unchanged).
            expires_at: Token expiry timestamp.
            org_id: Organisation scope for additional safety.

        Returns:
            The updated row, or None if the account was not found.
        """
        payload: dict[str, Any] = {"access_token": access_token}
        if refresh_token is not None:
            payload["refresh_token"] = refresh_token
        if expires_at is not None:
            payload["token_expires_at"] = expires_at.isoformat()

        return await self.update(TABLE, account_id, payload, org_id=org_id)
