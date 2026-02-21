"""Pydantic models mirroring the Supabase database schema.

Each model corresponds to a database table and is used for
request/response serialisation, validation, and internal data
transfer.  ``*Base`` variants hold shared writable fields while
the full model adds server-managed columns (``id``, timestamps).
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class OrgRole(str, Enum):
    """Roles a user can hold within an organization."""

    OWNER = "owner"
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"


class SocialPlatform(str, Enum):
    """Supported social media platforms."""

    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"


class PostStatus(str, Enum):
    """Lifecycle status of a social media post."""

    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHING = "publishing"
    PUBLISHED = "published"
    FAILED = "failed"


class CampaignStatus(str, Enum):
    """Lifecycle status of a marketing campaign."""

    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class AgentRunStatus(str, Enum):
    """Execution status of an AI agent run."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ApprovalStatus(str, Enum):
    """Status of an item in the approval queue."""

    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVISION_REQUESTED = "revision_requested"


# ---------------------------------------------------------------------------
# Organization
# ---------------------------------------------------------------------------

class OrganizationBase(BaseModel):
    """Writable fields for an organization."""

    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100)
    logo_url: str | None = None
    website: str | None = None


class Organization(OrganizationBase):
    """Full organization record including server-managed fields."""

    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------

class ProfileBase(BaseModel):
    """Writable fields for a user profile."""

    full_name: str | None = None
    avatar_url: str | None = None
    bio: str | None = None


class Profile(ProfileBase):
    """Full user profile record."""

    id: UUID
    email: str
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# OrganizationMember
# ---------------------------------------------------------------------------

class OrganizationMemberBase(BaseModel):
    """Writable fields for an organization membership."""

    role: OrgRole = OrgRole.VIEWER


class OrganizationMember(OrganizationMemberBase):
    """Full organization-member join record."""

    id: UUID
    org_id: UUID
    user_id: UUID
    invited_by: UUID | None = None
    joined_at: datetime
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# SocialAccount
# ---------------------------------------------------------------------------

class SocialAccountBase(BaseModel):
    """Writable fields for a connected social media account."""

    platform: SocialPlatform
    platform_account_id: str
    account_name: str
    account_avatar_url: str | None = None
    access_token: str
    refresh_token: str | None = None
    token_expires_at: datetime | None = None
    scopes: list[str] = Field(default_factory=list)


class SocialAccount(SocialAccountBase):
    """Full social account record."""

    id: UUID
    org_id: UUID
    connected_by: UUID
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Campaign
# ---------------------------------------------------------------------------

class CampaignBase(BaseModel):
    """Writable fields for a marketing campaign."""

    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    status: CampaignStatus = CampaignStatus.DRAFT
    start_date: datetime | None = None
    end_date: datetime | None = None
    tags: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class Campaign(CampaignBase):
    """Full campaign record."""

    id: UUID
    org_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Post
# ---------------------------------------------------------------------------

class PostBase(BaseModel):
    """Writable fields for a social media post."""

    content: str
    platform: SocialPlatform
    status: PostStatus = PostStatus.DRAFT
    scheduled_at: datetime | None = None
    media_urls: list[str] = Field(default_factory=list)
    platform_post_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class Post(PostBase):
    """Full post record."""

    id: UUID
    org_id: UUID
    campaign_id: UUID | None = None
    social_account_id: UUID
    created_by: UUID
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# PostAnalytics
# ---------------------------------------------------------------------------

class PostAnalyticsBase(BaseModel):
    """Writable fields for post-level analytics."""

    impressions: int = 0
    reach: int = 0
    likes: int = 0
    comments: int = 0
    shares: int = 0
    clicks: int = 0
    engagement_rate: float = 0.0
    metadata: dict[str, Any] = Field(default_factory=dict)


class PostAnalytics(PostAnalyticsBase):
    """Full post analytics record."""

    id: UUID
    post_id: UUID
    collected_at: datetime
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# AgentRun
# ---------------------------------------------------------------------------

class AgentRunBase(BaseModel):
    """Writable fields for an AI agent execution run."""

    agent_type: str = Field(..., min_length=1, max_length=100)
    status: AgentRunStatus = AgentRunStatus.PENDING
    input_data: dict[str, Any] = Field(default_factory=dict)
    output_data: dict[str, Any] = Field(default_factory=dict)
    error_message: str | None = None


class AgentRun(AgentRunBase):
    """Full agent run record."""

    id: UUID
    org_id: UUID
    triggered_by: UUID
    started_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# AgentRunStep
# ---------------------------------------------------------------------------

class AgentRunStepBase(BaseModel):
    """Writable fields for an individual step within an agent run."""

    step_name: str = Field(..., min_length=1, max_length=255)
    step_order: int = Field(..., ge=0)
    status: AgentRunStatus = AgentRunStatus.PENDING
    input_data: dict[str, Any] = Field(default_factory=dict)
    output_data: dict[str, Any] = Field(default_factory=dict)
    error_message: str | None = None
    duration_ms: int | None = None


class AgentRunStep(AgentRunStepBase):
    """Full agent run step record."""

    id: UUID
    agent_run_id: UUID
    started_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# ContentCalendarEntry
# ---------------------------------------------------------------------------

class ContentCalendarEntryBase(BaseModel):
    """Writable fields for a content calendar slot."""

    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    scheduled_date: datetime
    platform: SocialPlatform | None = None
    content_type: str | None = None
    tags: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ContentCalendarEntry(ContentCalendarEntryBase):
    """Full content calendar entry record."""

    id: UUID
    org_id: UUID
    campaign_id: UUID | None = None
    post_id: UUID | None = None
    created_by: UUID
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# BrandProfile
# ---------------------------------------------------------------------------

class BrandProfileBase(BaseModel):
    """Writable fields for an organization brand profile."""

    brand_name: str = Field(..., min_length=1, max_length=255)
    voice_tone: str | None = None
    target_audience: str | None = None
    brand_colors: list[str] = Field(default_factory=list)
    brand_keywords: list[str] = Field(default_factory=list)
    style_guidelines: str | None = None
    logo_url: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class BrandProfile(BrandProfileBase):
    """Full brand profile record."""

    id: UUID
    org_id: UUID
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# ApprovalQueueItem
# ---------------------------------------------------------------------------

class ApprovalQueueItemBase(BaseModel):
    """Writable fields for an item in the approval queue."""

    content_type: str = Field(..., min_length=1, max_length=50)
    content_id: UUID
    status: ApprovalStatus = ApprovalStatus.PENDING
    reviewer_notes: str | None = None


class ApprovalQueueItem(ApprovalQueueItemBase):
    """Full approval queue item record."""

    id: UUID
    org_id: UUID
    submitted_by: UUID
    reviewed_by: UUID | None = None
    submitted_at: datetime
    reviewed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
