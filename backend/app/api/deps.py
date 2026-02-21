"""API Dependencies for OpenPaws backend."""

from typing import Annotated, Callable, List, Optional
from uuid import UUID

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from supabase import Client as SupabaseClient

from app.core.config import settings
from app.core.database import async_session_factory
from app.core.supabase import get_supabase_client

security = HTTPBearer()


async def get_db() -> AsyncSession:
    """Yield an async database session."""
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """Extract Bearer token and verify via Supabase.

    Returns the authenticated user dict from Supabase.
    """
    token = credentials.credentials
    supabase: SupabaseClient = get_supabase_client()

    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {
            "id": str(user_response.user.id),
            "email": user_response.user.email,
            "user_metadata": user_response.user.user_metadata,
            "token": token,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_org_id(
    x_organization_id: Annotated[Optional[str], Header()] = None,
) -> Optional[UUID]:
    """Extract organization ID from X-Organization-ID header."""
    if x_organization_id is None:
        return None
    try:
        return UUID(x_organization_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid X-Organization-ID header: must be a valid UUID",
        )


def require_role(allowed_roles: List[str]) -> Callable:
    """Factory that returns a dependency enforcing role membership.

    Usage::

        @router.get("/admin", dependencies=[Depends(require_role(["admin", "owner"]))])
        async def admin_endpoint(): ...
    """

    async def _check_role(
        current_user: Annotated[dict, Depends(get_current_user)],
        org_id: Annotated[Optional[UUID], Depends(get_org_id)],
        db: Annotated[AsyncSession, Depends(get_db)],
    ) -> dict:
        if org_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="X-Organization-ID header is required for this endpoint",
            )

        from sqlalchemy import select, and_
        from app.models.organization import OrganizationMember

        stmt = select(OrganizationMember).where(
            and_(
                OrganizationMember.user_id == current_user["id"],
                OrganizationMember.organization_id == org_id,
            )
        )
        result = await db.execute(stmt)
        member = result.scalar_one_or_none()

        if member is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not a member of this organization",
            )

        if member.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{member.role}' is not authorized. Required: {allowed_roles}",
            )

        current_user["org_role"] = member.role
        current_user["org_id"] = str(org_id)
        return current_user

    return _check_role


# Convenience type aliases
CurrentUser = Annotated[dict, Depends(get_current_user)]
DbSession = Annotated[AsyncSession, Depends(get_db)]
OrgId = Annotated[Optional[UUID], Depends(get_org_id)]
