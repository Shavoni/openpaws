"""User profile routes."""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

from app.api.deps import CurrentUser, DbSession
from app.core.supabase import get_supabase_client

router = APIRouter(prefix="/users", tags=["users"])


class UserProfile(BaseModel):
    id: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    user_metadata: Optional[dict] = None


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class OrganizationSummary(BaseModel):
    id: str
    name: str
    role: str


@router.get("/me", response_model=UserProfile)
async def get_me(current_user: CurrentUser):
    """Get the current authenticated user profile."""
    metadata = current_user.get("user_metadata", {}) or {}
    return UserProfile(
        id=current_user["id"],
        email=current_user.get("email"),
        full_name=metadata.get("full_name"),
        avatar_url=metadata.get("avatar_url"),
        user_metadata=metadata,
    )


@router.patch("/me", response_model=UserProfile)
async def update_me(payload: UpdateProfileRequest, current_user: CurrentUser):
    """Update the current user profile metadata."""
    supabase = get_supabase_client()
    try:
        update_data = {}
        if payload.full_name is not None:
            update_data["full_name"] = payload.full_name
        if payload.avatar_url is not None:
            update_data["avatar_url"] = payload.avatar_url

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update",
            )

        response = supabase.auth.update_user({"data": update_data})

        metadata = response.user.user_metadata or {}
        return UserProfile(
            id=str(response.user.id),
            email=response.user.email,
            full_name=metadata.get("full_name"),
            avatar_url=metadata.get("avatar_url"),
            user_metadata=metadata,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile update failed: {str(e)}",
        )


@router.get("/me/organizations", response_model=List[OrganizationSummary])
async def get_my_organizations(current_user: CurrentUser, db: DbSession):
    """List all organizations the current user belongs to."""
    from sqlalchemy import select
    from app.models.organization import Organization, OrganizationMember

    stmt = (
        select(Organization, OrganizationMember.role)
        .join(
            OrganizationMember,
            OrganizationMember.organization_id == Organization.id,
        )
        .where(OrganizationMember.user_id == current_user["id"])
    )
    result = await db.execute(stmt)
    rows = result.all()

    return [
        OrganizationSummary(id=str(org.id), name=org.name, role=role)
        for org, role in rows
    ]
