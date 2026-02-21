"""Organization request and response schemas."""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class OrganizationCreate(BaseModel):
    """Schema for creating a new organization."""

    name: str = Field(..., min_length=1, max_length=255, description="Organization display name")
    slug: str = Field(
        ...,
        min_length=1,
        max_length=63,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="URL-friendly unique identifier",
    )


class OrganizationUpdate(BaseModel):
    """Schema for updating an existing organization."""

    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Organization display name")
    logo_url: Optional[str] = Field(None, description="URL to organization logo")
    settings: Optional[dict[str, Any]] = Field(None, description="Organization-level settings")


class OrganizationResponse(BaseModel):
    """Schema for organization data returned to clients."""

    id: UUID = Field(..., description="Unique organization identifier")
    name: str = Field(..., description="Organization display name")
    slug: str = Field(..., description="URL-friendly unique identifier")
    logo_url: Optional[str] = Field(None, description="URL to organization logo")
    plan: str = Field(..., description="Current subscription plan")
    created_at: datetime = Field(..., description="Organization creation timestamp")

    model_config = {"from_attributes": True}


class InviteMemberRequest(BaseModel):
    """Schema for inviting a member to an organization."""

    email: str = Field(..., description="Email address of the person to invite")
    role: str = Field(
        default="member",
        pattern=r"^(owner|admin|member|viewer)$",
        description="Role to assign: owner, admin, member, or viewer",
    )
