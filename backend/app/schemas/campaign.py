"""Campaign request and response schemas."""

from datetime import date, datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CampaignCreate(BaseModel):
    """Schema for creating a new marketing campaign."""

    name: str = Field(..., min_length=1, max_length=255, description="Campaign name")
    description: Optional[str] = Field(None, max_length=2000, description="Campaign description")
    start_date: date = Field(..., description="Campaign start date")
    end_date: Optional[date] = Field(None, description="Campaign end date")
    goals: Optional[dict[str, Any]] = Field(None, description="Campaign goals and KPIs")
    target_platforms: list[str] = Field(
        default_factory=list,
        description="Platforms to target: twitter, instagram, linkedin, facebook, tiktok",
    )


class CampaignUpdate(BaseModel):
    """Schema for updating an existing campaign."""

    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Campaign name")
    description: Optional[str] = Field(None, max_length=2000, description="Campaign description")
    status: Optional[str] = Field(
        None,
        pattern=r"^(draft|active|paused|completed|archived)$",
        description="Campaign status",
    )
    goals: Optional[dict[str, Any]] = Field(None, description="Campaign goals and KPIs")
    target_platforms: Optional[list[str]] = Field(None, description="Platforms to target")


class CampaignResponse(BaseModel):
    """Schema for campaign data returned to clients."""

    id: UUID = Field(..., description="Unique campaign identifier")
    organization_id: UUID = Field(..., description="Owning organization identifier")
    name: str = Field(..., description="Campaign name")
    description: Optional[str] = Field(None, description="Campaign description")
    status: str = Field(..., description="Current campaign status")
    start_date: date = Field(..., description="Campaign start date")
    end_date: Optional[date] = Field(None, description="Campaign end date")
    goals: Optional[dict[str, Any]] = Field(None, description="Campaign goals and KPIs")
    target_platforms: list[str] = Field(default_factory=list, description="Target platforms")
    created_at: datetime = Field(..., description="Record creation timestamp")
    updated_at: datetime = Field(..., description="Record last-update timestamp")

    model_config = {"from_attributes": True}
