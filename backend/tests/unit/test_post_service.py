"""Unit tests for the Post service layer."""
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from tests.factories import make_post


class TestCreatePostDraft:
    """Tests for creating a new post in draft status."""

    @pytest.mark.asyncio
    async def test_create_post_draft(self, mock_supabase: AsyncMock, test_org_id: str, test_user_id: str):
        """Creating a post should default to 'draft' status."""
        from app.services.post_service import PostService

        # Configure the mock to return the created post
        draft_post = make_post(
            organization_id=test_org_id,
            author_id=test_user_id,
            status="draft",
        )
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(
            data=[draft_post]
        )

        service = PostService(supabase=mock_supabase)
        result = await service.create_post(
            organization_id=test_org_id,
            author_id=test_user_id,
            title="My Draft Post",
            body="Some draft content here.",
            platform="twitter",
        )

        assert result["status"] == "draft"
        assert result["organization_id"] == test_org_id
        assert result["author_id"] == test_user_id
        mock_supabase.table.assert_called_with("posts")


class TestApprovePost:
    """Tests for approving a draft post."""

    @pytest.mark.asyncio
    async def test_approve_post_changes_status(self, mock_supabase: AsyncMock):
        """Approving a post should change its status to 'approved'."""
        from app.services.post_service import PostService

        post = make_post(status="pending_review")
        approved_post = {**post, "status": "approved"}

        mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[approved_post]
        )

        service = PostService(supabase=mock_supabase)
        result = await service.approve_post(post_id=post["id"], approved_by="reviewer-id")

        assert result["status"] == "approved"


class TestRejectPost:
    """Tests for rejecting a post with feedback."""

    @pytest.mark.asyncio
    async def test_reject_post_adds_feedback(self, mock_supabase: AsyncMock):
        """Rejecting a post should set status to 'rejected' and store feedback."""
        from app.services.post_service import PostService

        post = make_post(status="pending_review")
        feedback_text = "Needs more detail about the product features."
        rejected_post = {
            **post,
            "status": "rejected",
            "approval_feedback": feedback_text,
        }

        mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[rejected_post]
        )

        service = PostService(supabase=mock_supabase)
        result = await service.reject_post(
            post_id=post["id"],
            rejected_by="reviewer-id",
            feedback=feedback_text,
        )

        assert result["status"] == "rejected"
        assert result["approval_feedback"] == feedback_text


class TestSchedulePost:
    """Tests for scheduling a post for future publication."""

    @pytest.mark.asyncio
    async def test_schedule_post_sets_time(self, mock_supabase: AsyncMock):
        """Scheduling a post should set scheduled_at and change status to 'scheduled'."""
        from app.services.post_service import PostService

        post = make_post(status="approved")
        schedule_time = datetime(2026, 3, 15, 14, 30, 0, tzinfo=timezone.utc)
        scheduled_post = {
            **post,
            "status": "scheduled",
            "scheduled_at": schedule_time.isoformat(),
        }

        mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[scheduled_post]
        )

        service = PostService(supabase=mock_supabase)
        result = await service.schedule_post(
            post_id=post["id"],
            scheduled_at=schedule_time,
        )

        assert result["status"] == "scheduled"
        assert result["scheduled_at"] == schedule_time.isoformat()
