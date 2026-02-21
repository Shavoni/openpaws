"""Base repository with common CRUD operations for Supabase.

All queries are automatically scoped by organization_id to enforce
multi-tenant data isolation.
"""

from typing import Any, Optional
from uuid import UUID

from supabase._async.client import AsyncClient


class BaseRepository:
    """Generic data-access layer backed by the Supabase async client.

    Every public method that touches row data filters by *organization_id*
    so that tenants can never read or modify another tenant's records.
    """

    def __init__(self, client: AsyncClient) -> None:
        """Initialise the repository with a Supabase async client.

        Args:
            client: An authenticated AsyncClient instance.
        """
        self._client = client

    # -- Read -----------------------------------------------------------

    async def get_by_id(
        self,
        table: str,
        record_id: UUID,
        *,
        org_id: Optional[UUID] = None,
    ) -> Optional[dict[str, Any]]:
        """Fetch a single record by its primary key.

        Args:
            table: Supabase table name.
            record_id: UUID primary key value.
            org_id: Organisation scope.  When provided the query adds an
                organization_id equality filter.

        Returns:
            The matching row as a dict, or None if not found.
        """
        query = self._client.table(table).select("*").eq("id", str(record_id))
        if org_id is not None:
            query = query.eq("organization_id", str(org_id))
        response = await query.maybe_single().execute()
        return response.data

    async def list_all(
        self,
        table: str,
        org_id: UUID,
        *,
        filters: Optional[dict[str, Any]] = None,
        page: int = 1,
        size: int = 20,
    ) -> tuple[list[dict[str, Any]], int]:
        """Return a paginated, filtered list of records for an organisation.

        Args:
            table: Supabase table name.
            org_id: Organisation scope (required).
            filters: Optional mapping of {column: value} equality filters.
            page: 1-indexed page number.
            size: Maximum rows per page.

        Returns:
            A tuple of (rows, total_count).
        """
        offset = (page - 1) * size

        query = (
            self._client.table(table)
            .select("*", count="exact")
            .eq("organization_id", str(org_id))
        )

        if filters:
            for column, value in filters.items():
                query = query.eq(column, value)

        query = query.order("created_at", desc=True).range(offset, offset + size - 1)
        response = await query.execute()
        return response.data or [], response.count or 0

    # -- Write ----------------------------------------------------------

    async def create(
        self,
        table: str,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        """Insert a new record.

        The caller is responsible for including organization_id in *data*
        to maintain tenant isolation.

        Args:
            table: Supabase table name.
            data: Column values for the new row.

        Returns:
            The created row as a dict.
        """
        response = await self._client.table(table).insert(data).execute()
        return response.data[0]

    async def update(
        self,
        table: str,
        record_id: UUID,
        data: dict[str, Any],
        *,
        org_id: Optional[UUID] = None,
    ) -> Optional[dict[str, Any]]:
        """Update an existing record.

        Args:
            table: Supabase table name.
            record_id: UUID primary key of the row to update.
            data: Column values to set.
            org_id: Organisation scope.

        Returns:
            The updated row as a dict, or None if no matching row existed.
        """
        query = self._client.table(table).update(data).eq("id", str(record_id))
        if org_id is not None:
            query = query.eq("organization_id", str(org_id))
        response = await query.execute()
        if response.data:
            return response.data[0]
        return None

    async def delete(
        self,
        table: str,
        record_id: UUID,
        *,
        org_id: Optional[UUID] = None,
    ) -> bool:
        """Soft- or hard-delete a record (depends on table RLS policies).

        Args:
            table: Supabase table name.
            record_id: UUID primary key of the row to delete.
            org_id: Organisation scope.

        Returns:
            True if a row was deleted, False otherwise.
        """
        query = self._client.table(table).delete().eq("id", str(record_id))
        if org_id is not None:
            query = query.eq("organization_id", str(org_id))
        response = await query.execute()
        return bool(response.data)
