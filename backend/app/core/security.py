"""Authentication and authorization utilities.

Provides FastAPI dependencies for verifying Supabase JWTs,
extracting the current user, and resolving organization context.
"""

from __future__ import annotations

from typing import Any

import httpx
import structlog
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

logger = structlog.get_logger(__name__)

_bearer_scheme = HTTPBearer(auto_error=True)


async def verify_supabase_token(token: str) -> dict[str, Any]:
    """Verify a Supabase JWT and return the decoded user payload.

    Args:
        token: The raw JWT string issued by Supabase Auth.

    Returns:
        A dictionary containing the authenticated user claims
        (including ``sub``, ``email``, ``role``, etc.).

    Raises:
        HTTPException: If the token is invalid or the Supabase
            auth endpoint returns an error.
    """
    url = f"{settings.SUPABASE_URL}/auth/v1/user"
    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": settings.SUPABASE_ANON_KEY,
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    if response.status_code != 200:
        logger.warning("supabase_token_verification_failed", status=response.status_code)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_data: dict[str, Any] = response.json()
    logger.debug("token_verified", user_id=user_data.get("id"))
    return user_data


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> dict[str, Any]:
    """FastAPI dependency that extracts and verifies the Bearer token.

    Returns:
        The verified user payload from Supabase.
    """
    return await verify_supabase_token(credentials.credentials)


async def get_current_org(
    x_organization_id: str = Header(..., alias="X-Organization-ID"),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
    """FastAPI dependency that resolves and validates organization context.

    Reads the ``X-Organization-ID`` header, then verifies that the
    authenticated user is a member of the specified organization via
    Supabase.

    Returns:
        A dictionary with ``org_id``, ``user_id``, and ``role`` keys.

    Raises:
        HTTPException: If the user is not a member of the organization.
    """
    user_id: str = current_user["id"]

    headers = {
        "apikey": settings.SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
    }
    url = (
        f"{settings.SUPABASE_URL}/rest/v1/organization_members"
        f"?org_id=eq.{x_organization_id}&user_id=eq.{user_id}&select=role"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    if response.status_code != 200:
        logger.error("org_membership_lookup_failed", status=response.status_code)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify organization membership",
        )

    rows: list[dict[str, Any]] = response.json()
    if not rows:
        logger.warning("org_access_denied", user_id=user_id, org_id=x_organization_id)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this organization",
        )

    return {
        "org_id": x_organization_id,
        "user_id": user_id,
        "role": rows[0]["role"],
    }
