"""Unit tests for the reviewer node in the content pipeline."""
from unittest.mock import AsyncMock, MagicMock, patch

import pytest


class TestReviewContent:
    """Tests for the review_content node function."""

    @pytest.mark.asyncio
    async def test_review_flags_for_human(self):
        """If the LLM review score is below threshold, flag for human review."""
        from app.agents.nodes.reviewer import review_content

        mock_llm = AsyncMock()
        mock_llm.ainvoke.return_value = MagicMock(
            content='{"score": 0.5, "feedback": "Tone is too casual for LinkedIn.", "approved": false}'
        )

        input_state = {
            "topic": "Product launch",
            "platforms": ["linkedin"],
            "tone": "professional",
            "campaign_id": "test-campaign-id",
            "plan": "1. Hook 2. Value 3. CTA",
            "drafts": [
                {
                    "platform": "linkedin",
                    "content": "yo check out our new thing lol",
                }
            ],
            "review_result": None,
        }

        with patch("app.agents.nodes.reviewer.get_llm", return_value=mock_llm):
            result = await review_content(input_state)

        assert "review_result" in result
        review = result["review_result"]
        assert review["approved"] is False
        assert "feedback" in review
        assert len(review["feedback"]) > 0

    @pytest.mark.asyncio
    async def test_review_auto_approves_quality(self):
        """If the LLM review score meets the threshold, auto-approve the content."""
        from app.agents.nodes.reviewer import review_content

        mock_llm = AsyncMock()
        mock_llm.ainvoke.return_value = MagicMock(
            content='{"score": 0.92, "feedback": "Content is well-structured and on-brand.", "approved": true}'
        )

        input_state = {
            "topic": "Product launch",
            "platforms": ["twitter"],
            "tone": "professional",
            "campaign_id": "test-campaign-id",
            "plan": "1. Hook 2. Value 3. CTA",
            "drafts": [
                {
                    "platform": "twitter",
                    "content": "Excited to announce our latest innovation in AI-powered social media management. "
                               "Here's what makes it different: [thread]",
                }
            ],
            "review_result": None,
        }

        with patch("app.agents.nodes.reviewer.get_llm", return_value=mock_llm):
            result = await review_content(input_state)

        assert "review_result" in result
        review = result["review_result"]
        assert review["approved"] is True
        assert review["score"] >= 0.8
