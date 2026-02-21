"""Social account request and response schemas."""

from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class SocialAccountResponse(BaseModel):
    """Schema for social account data returned to clients.

    Sensitive fields (tokens, secrets) are intentionally excluded.
    """

    id: UUID = Field(..., description="Unique social account identifier")
    platform: str = Field(..., description="Platform name: twitter, instagram, linkedin, facebook, tiktok")
    platform_username: str = Field(..., description="Username on the external platform")
    display_name: Optional[str] = Field(None, description="Display name on the external platform")
    avatar_url: Optional[str] = Field(None, description="Avatar image URL from the platform")
    is_active: bool = Field(..., description="Whether the account connection is active")

    model_config = {"from_attributes": True}


class ConnectAccountRequest(BaseModel):
    """Schema for initiating an OAuth account connection."""

    platform: str = Field(
        ...,
        pattern=r"^(twitter|instagram|linkedin|facebook|tiktok)$",
        description="Platform to connect",
    )
    auth_code: str = Field(..., description="OAuth authorization code from the platform")
    redirect_uri: str = Field(..., description="Redirect URI used during the OAuth flow")
