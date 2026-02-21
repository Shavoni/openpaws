"""Integration tests for agent management API routes."""
import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from tests.factories import make_agent_run


class TestTriggerAgentRun:
    """Tests for the POST /api/v1/agents/runs endpoint."""

    @pytest.mark.asyncio
    async def test_trigger_agent_run(
        self,
        async_client,
        mock_supabase: AsyncMock,
        auth_headers: dict[str, str],
        test_org_id: str,
        test_user_id: str,
    ):
        """Triggering an agent run should create a run record and return 202."""
        agent_run = make_agent_run(
            organization_id=test_org_id,
            triggered_by=test_user_id,
            status="running",
        )

        mock_supabase.auth.get_user.return_value = MagicMock(
            user=MagicMock(id=test_user_id, email="test@example.com"),
        )

        # Mock insert of agent run record
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(
            data=[agent_run]
        )

        response = await async_client.post(
            "/api/v1/agents/runs",
            json={
                "organization_id": test_org_id,
                "agent_type": "content_pipeline",
                "input_params": {
                    "platforms": ["twitter", "instagram"],
                    "topic": "Product launch announcement",
                },
            },
            headers=auth_headers,
        )

        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "running"
        assert data["agent_type"] == "content_pipeline"
        assert data["organization_id"] == test_org_id


class TestListAgentRuns:
    """Tests for the GET /api/v1/agents/runs endpoint."""

    @pytest.mark.asyncio
    async def test_list_agent_runs(
        self,
        async_client,
        mock_supabase: AsyncMock,
        auth_headers: dict[str, str],
        test_org_id: str,
        test_user_id: str,
    ):
        """Listing agent runs should return paginated results."""
        runs = [make_agent_run(organization_id=test_org_id) for _ in range(2)]

        mock_supabase.auth.get_user.return_value = MagicMock(
            user=MagicMock(id=test_user_id, email="test@example.com"),
        )

        mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value.range.return_value.execute.return_value = MagicMock(
            data=runs, count=2
        )

        response = await async_client.get(
            "/api/v1/agents/runs",
            params={"organization_id": test_org_id},
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert len(data["items"]) == 2


class TestApproveAgentRun:
    """Tests for the POST /api/v1/agents/runs/{run_id}/approve endpoint."""

    @pytest.mark.asyncio
    async def test_approve_agent_run(
        self,
        async_client,
        mock_supabase: AsyncMock,
        auth_headers: dict[str, str],
        test_user_id: str,
    ):
        """Approving an agent run should update status and record the approver."""
        agent_run = make_agent_run(
            status="awaiting_approval",
            requires_approval=True,
        )
        approved_run = {
            **agent_run,
            "status": "approved",
            "approved_by": test_user_id,
        }

        mock_supabase.auth.get_user.return_value = MagicMock(
            user=MagicMock(id=test_user_id, email="test@example.com"),
        )

        # Mock fetching the run
        mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
            data=agent_run
        )

        # Mock updating the run
        mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[approved_run]
        )

        response = await async_client.post(
            f"/api/v1/agents/runs/{agent_run['id']}/approve",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "approved"
        assert data["approved_by"] == test_user_id
