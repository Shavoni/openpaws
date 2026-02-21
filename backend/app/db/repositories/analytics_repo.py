"""Repository for analytics and metrics operations."""

from datetime import date
from typing import Any, Optional
from uuid import UUID

from supabase._async.client import AsyncClient

from app.db.repositories.base import BaseRepository

TABLE = "analytics"


class AnalyticsRepository(BaseRepository):
    """Data-access layer for the *analytics* table."""

    def __init__(self, client: AsyncClient) -> None:
        super().__init__(client)

    async def save_metrics(
        self,
        post_id: UUID,
        org_id: UUID,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        """Upsert engagement metrics for a post.

        If a row for the given *post_id* already exists it will be updated;
        otherwise a new row is inserted.

        Args:
            post_id: Associated post identifier.
            org_id: Organisation scope.
            data: Metrics payload (impressions, reach, likes, etc.).

        Returns:
            The upserted analytics row.
        """
        payload = {
            "post_id": str(post_id),
            "organization_id": str(org_id),
            **data,
        }
        response = await (
            self._client.table(TABLE)
            .upsert(payload, on_conflict="post_id")
            .execute()
        )
        return response.data[0]

    async def get_post_analytics(
        self,
        post_id: UUID,
        *,
        org_id: Optional[UUID] = None,
    ) -> Optional[dict[str, Any]]:
        """Retrieve analytics for a single post.

        Args:
            post_id: Post identifier.
            org_id: Optional organisation scope for extra safety.

        Returns:
            The analytics row, or None if no data exists yet.
        """
        query = (
            self._client.table(TABLE)
            .select("*")
            .eq("post_id", str(post_id))
        )
        if org_id is not None:
            query = query.eq("organization_id", str(org_id))
        response = await query.maybe_single().execute()
        return response.data

    async def get_org_summary(
        self,
        org_id: UUID,
        start_date: date,
        end_date: date,
    ) -> dict[str, Any]:
        """Compute an aggregated analytics summary for an organisation.

        Fetches all analytics rows within the date range and computes
        totals client-side.  For high-volume deployments, consider
        replacing this with a Supabase RPC / database function.

        Args:
            org_id: Organisation scope.
            start_date: Inclusive period start.
            end_date: Inclusive period end.

        Returns:
            A dict with keys: total_posts, total_impressions,
            total_engagement, avg_engagement_rate, period,
            start_date, end_date.
        """
        response = await (
            self._client.table(TABLE)
            .select("*")
            .eq("organization_id", str(org_id))
            .gte("created_at", start_date.isoformat())
            .lte("created_at", end_date.isoformat())
            .execute()
        )

        rows = response.data or []

        total_impressions = 0
        total_engagement = 0

        for row in rows:
            metrics = row.get("metrics", {})
            total_impressions += metrics.get("impressions", 0)
            total_engagement += (
                metrics.get("likes", 0)
                + metrics.get("comments", 0)
                + metrics.get("shares", 0)
                + metrics.get("clicks", 0)
            )

        avg_engagement_rate = (
            (total_engagement / total_impressions) if total_impressions > 0 else 0.0
        )

        return {
            "total_posts": len(rows),
            "total_impressions": total_impressions,
            "total_engagement": total_engagement,
            "avg_engagement_rate": round(avg_engagement_rate, 6),
            "period": f"{start_date.isoformat()} to {end_date.isoformat()}",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        }
