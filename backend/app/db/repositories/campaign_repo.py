"""Repository for campaign operations."""

from typing import Any
from uuid import UUID

from supabase._async.client import AsyncClient

from app.db.repositories.base import BaseRepository

TABLE = "campaigns"


class CampaignRepository(BaseRepository):
    """Data-access layer for the *campaigns* table."""

    def __init__(self, client: AsyncClient) -> None:
        super().__init__(client)

    async def get_campaigns(
        self,
        org_id: UUID,
        *,
        page: int = 1,
        size: int = 20,
    ) -> tuple[list[dict[str, Any]], int]:
        """Return a paginated list of campaigns for an organisation.

        Args:
            org_id: Organisation scope.
            page: 1-indexed page number.
            size: Maximum rows per page.

        Returns:
            A tuple of (rows, total_count).
        """
        return await self.list_all(TABLE, org_id, page=page, size=size)

    async def create_campaign(
        self,
        org_id: UUID,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        """Create a new campaign within an organisation.

        Args:
            org_id: Organisation that owns the campaign.
            data: Campaign field values (name, description, dates, etc.).

        Returns:
            The newly created campaign row.
        """
        data["organization_id"] = str(org_id)
        return await self.create(TABLE, data)

    async def get_active_campaigns(
        self,
        org_id: UUID,
    ) -> list[dict[str, Any]]:
        """Return all campaigns with an *active* status for an organisation.

        Args:
            org_id: Organisation scope.

        Returns:
            List of active campaign rows ordered by start date descending.
        """
        response = await (
            self._client.table(TABLE)
            .select("*")
            .eq("organization_id", str(org_id))
            .eq("status", "active")
            .order("start_date", desc=True)
            .execute()
        )
        return response.data or []
