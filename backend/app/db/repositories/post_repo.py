"""Repository for social media post operations."""

from typing import Any, Optional
from uuid import UUID

from supabase._async.client import AsyncClient

from app.db.repositories.base import BaseRepository

TABLE = "posts"


class PostRepository(BaseRepository):
    """Data-access layer for the *posts* table.

    All queries are scoped by organisation to enforce multi-tenant isolation.
    """

    def __init__(self, client: AsyncClient) -> None:
        super().__init__(client)

    async def get_posts(
        self,
        org_id: UUID,
        *,
        filters: Optional[dict[str, Any]] = None,
        page: int = 1,
        size: int = 20,
    ) -> tuple[list[dict[str, Any]], int]:
        """Return a paginated list of posts for an organisation.

        Args:
            org_id: Organisation scope.
            filters: Optional equality filters (e.g. {"status": "draft"}).
            page: 1-indexed page number.
            size: Maximum rows per page.

        Returns:
            A tuple of (rows, total_count).
        """
        return await self.list_all(TABLE, org_id, filters=filters, page=page, size=size)

    async def create_post(
        self,
        org_id: UUID,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        """Create a new post within an organisation.

        Args:
            org_id: Organisation that owns the post.
            data: Post field values (content, platform, etc.).

        Returns:
            The newly created post row.
        """
        data["organization_id"] = str(org_id)
        return await self.create(TABLE, data)

    async def update_post_status(
        self,
        post_id: UUID,
        status: str,
        *,
        org_id: Optional[UUID] = None,
    ) -> Optional[dict[str, Any]]:
        """Transition a post to a new status.

        Args:
            post_id: Post primary key.
            status: New status value (draft, scheduled, publishing, published, failed).
            org_id: Organisation scope for additional safety.

        Returns:
            The updated post row, or None if not found.
        """
        return await self.update(TABLE, post_id, {"status": status}, org_id=org_id)

    async def get_posts_by_campaign(
        self,
        campaign_id: UUID,
        *,
        org_id: Optional[UUID] = None,
        page: int = 1,
        size: int = 50,
    ) -> tuple[list[dict[str, Any]], int]:
        """Return all posts linked to a specific campaign.

        Args:
            campaign_id: Campaign identifier.
            org_id: Organisation scope.
            page: 1-indexed page number.
            size: Maximum rows per page.

        Returns:
            A tuple of (rows, total_count).
        """
        offset = (page - 1) * size
        query = (
            self._client.table(TABLE)
            .select("*", count="exact")
            .eq("campaign_id", str(campaign_id))
        )
        if org_id is not None:
            query = query.eq("organization_id", str(org_id))
        query = query.order("created_at", desc=True).range(offset, offset + size - 1)
        response = await query.execute()
        return response.data or [], response.count or 0
