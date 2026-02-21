"""Calendar entry request and response schemas."""

from datetime import date, datetime, time
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CalendarEntryCreate(BaseModel):
    """Schema for creating a new content calendar entry."""

    planned_date: date = Field(..., description="Planned publication date")
    planned_time: Optional[time] = Field(None, description="Planned publication time (UTC)")
    platform: str = Field(
        ...,
        description="Target platform: twitter, instagram, linkedin, facebook, tiktok",
    )
    topic: str = Field(..., min_length=1, max_length=500, description="Content topic or title")
    content_type: str = Field(
        ...,
        max_length=100,
        description="Type of content: text, image, video, carousel, story, reel",
    )
    notes: Optional[str] = Field(None, max_length=2000, description="Additional planning notes")
    campaign_id: Optional[UUID] = Field(None, description="Associated campaign identifier")


class CalendarEntryUpdate(BaseModel):
    """Schema for updating an existing calendar entry."""

    planned_date: Optional[date] = Field(None, description="Planned publication date")
    planned_time: Optional[time] = Field(None, description="Planned publication time (UTC)")
    topic: Optional[str] = Field(None, min_length=1, max_length=500, description="Content topic or title")
    notes: Optional[str] = Field(None, max_length=2000, description="Additional planning notes")
    status: Optional[str] = Field(
        None,
        pattern=r"^(planned|in_progress|ready|published|skipped)$",
        description="Entry status",
    )


class CalendarEntryResponse(BaseModel):
    """Schema for calendar entry data returned to clients."""

    id: UUID = Field(..., description="Unique calendar entry identifier")
    organization_id: UUID = Field(..., description="Owning organization identifier")
    campaign_id: Optional[UUID] = Field(None, description="Associated campaign identifier")
    post_id: Optional[UUID] = Field(None, description="Linked post identifier (once created)")
    planned_date: date = Field(..., description="Planned publication date")
    planned_time: Optional[time] = Field(None, description="Planned publication time")
    platform: str = Field(..., description="Target platform")
    topic: str = Field(..., description="Content topic or title")
    content_type: str = Field(..., description="Type of content")
    notes: Optional[str] = Field(None, description="Additional planning notes")
    status: str = Field(..., description="Current entry status")
    created_at: datetime = Field(..., description="Record creation timestamp")
    updated_at: datetime = Field(..., description="Record last-update timestamp")

    model_config = {"from_attributes": True}
