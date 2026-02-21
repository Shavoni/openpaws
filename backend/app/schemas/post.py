"""Post request and response schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class PostCreate(BaseModel):
    """Schema for creating a new social media post."""

    platform: str = Field(
        ...,
        description="Target platform: twitter, instagram, linkedin, facebook, tiktok",
    )
    content: str = Field(..., min_length=1, max_length=5000, description="Post text content")
    media_urls: list[str] = Field(default_factory=list, description="URLs of attached media files")
    hashtags: list[str] = Field(default_factory=list, description="Hashtags to include")
    campaign_id: Optional[UUID] = Field(None, description="Associated campaign identifier")
    social_account_id: UUID = Field(..., description="Social account to publish from")
    scheduled_at: Optional[datetime] = Field(None, description="Scheduled publication time (UTC)")


class PostUpdate(BaseModel):
    """Schema for updating an existing post."""

    content: Optional[str] = Field(None, min_length=1, max_length=5000, description="Post text content")
    media_urls: Optional[list[str]] = Field(None, description="URLs of attached media files")
    hashtags: Optional[list[str]] = Field(None, description="Hashtags to include")
    status: Optional[str] = Field(
        None,
        pattern=r"^(draft|scheduled|publishing|published|failed)$",
        description="Post status",
    )
    scheduled_at: Optional[datetime] = Field(None, description="Scheduled publication time (UTC)")


class PostResponse(BaseModel):
    """Schema for post data returned to clients."""

    id: UUID = Field(..., description="Unique post identifier")
    organization_id: UUID = Field(..., description="Owning organization identifier")
    social_account_id: UUID = Field(..., description="Social account used for publishing")
    campaign_id: Optional[UUID] = Field(None, description="Associated campaign identifier")
    platform: str = Field(..., description="Target platform")
    content: str = Field(..., description="Post text content")
    media_urls: list[str] = Field(default_factory=list, description="Attached media URLs")
    hashtags: list[str] = Field(default_factory=list, description="Hashtags")
    status: str = Field(..., description="Current post status")
    scheduled_at: Optional[datetime] = Field(None, description="Scheduled publication time")
    published_at: Optional[datetime] = Field(None, description="Actual publication time")
    platform_post_id: Optional[str] = Field(None, description="Post ID on the external platform")
    created_at: datetime = Field(..., description="Record creation timestamp")
    updated_at: datetime = Field(..., description="Record last-update timestamp")

    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    """Paginated list of posts."""

    items: list[PostResponse] = Field(..., description="Page of post records")
    total: int = Field(..., ge=0, description="Total matching records across all pages")
    page: int = Field(..., ge=1, description="Current page number (1-indexed)")
    size: int = Field(..., ge=1, description="Maximum items per page")
