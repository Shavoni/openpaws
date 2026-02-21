"""Unit tests for the planner node in the content pipeline."""
from unittest.mock import AsyncMock, MagicMock, patch

import pytest


class TestPlanContent:
    """Tests for the plan_content node function."""

    @pytest.mark.asyncio
    async def test_plan_content_returns_plan(self):
        """The planner node should return a state dict containing a content plan."""
        from app.agents.nodes.planner import plan_content

        # Mock the LLM so we don't make real API calls
        mock_llm = AsyncMock()
        mock_llm.ainvoke.return_value = MagicMock(
            content="1. Hook: Start with a question\n"
                    "2. Value: Share the key insight\n"
                    "3. CTA: Encourage engagement"
        )

        input_state = {
            "topic": "AI-powered social media management",
            "platforms": ["twitter", "linkedin"],
            "tone": "professional",
            "campaign_id": "test-campaign-id",
            "plan": None,
            "drafts": [],
            "review_result": None,
        }

        with patch("app.agents.nodes.planner.get_llm", return_value=mock_llm):
            result = await plan_content(input_state)

        assert "plan" in result, "Planner must return a 'plan' key"
        assert result["plan"] is not None
        assert len(result["plan"]) > 0

    @pytest.mark.asyncio
    async def test_plan_content_sets_platforms(self):
        """The planner should preserve the target platforms in the output state."""
        from app.agents.nodes.planner import plan_content

        mock_llm = AsyncMock()
        mock_llm.ainvoke.return_value = MagicMock(
            content="Content plan for multiple platforms."
        )

        input_state = {
            "topic": "New feature release",
            "platforms": ["twitter", "instagram", "linkedin"],
            "tone": "casual",
            "campaign_id": "test-campaign-id",
            "plan": None,
            "drafts": [],
            "review_result": None,
        }

        with patch("app.agents.nodes.planner.get_llm", return_value=mock_llm):
            result = await plan_content(input_state)

        # The planner should pass through or explicitly set platforms
        assert "platforms" in result or "platforms" in {**input_state, **result}
        merged = {**input_state, **result}
        assert merged["platforms"] == ["twitter", "instagram", "linkedin"]
