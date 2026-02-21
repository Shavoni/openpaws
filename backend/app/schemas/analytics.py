"""Analytics request and response schemas."""

from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class AnalyticsMetrics(BaseModel):
    """Granular engagement metrics for a single post."""

    impressions: int = Field(default=0, ge=0, description="Total impressions")
    reach: int = Field(default=0, ge=0, description="Unique accounts reached")
    likes: int = Field(default=0, ge=0, description="Like / reaction count")
    comments: int = Field(default=0, ge=0, description="Comment count")
    shares: int = Field(default=0, ge=0, description="Share / repost count")
    clicks: int = Field(default=0, ge=0, description="Link click count")


class AnalyticsResponse(BaseModel):
    """Analytics data for a single post."""

    post_id: UUID = Field(..., description="Associated post identifier")
    metrics: AnalyticsMetrics = Field(..., description="Engagement metrics")

    model_config = {"from_attributes": True}


class AnalyticsSummary(BaseModel):
    """Aggregated analytics summary for an organization over a time period."""

    total_posts: int = Field(..., ge=0, description="Total posts in the period")
    total_impressions: int = Field(..., ge=0, description="Sum of impressions across all posts")
    total_engagement: int = Field(
        ...,
        ge=0,
        description="Sum of likes, comments, shares, and clicks",
    )
    avg_engagement_rate: float = Field(
        ...,
        ge=0.0,
        description="Average engagement rate (engagement / impressions)",
    )
    period: str = Field(
        ...,
        description="Human-readable period label, e.g. 'Last 30 days'",
    )
    start_date: Optional[date] = Field(None, description="Period start date")
    end_date: Optional[date] = Field(None, description="Period end date")
