"""Role-based permission utilities.

Defines a simple numeric hierarchy for organization roles and
provides a FastAPI dependency factory for enforcing minimum role
requirements on endpoints.
"""

from __future__ import annotations

from typing import Any, Callable

import structlog
from fastapi import Depends, HTTPException, status

from app.core.security import get_current_org

logger = structlog.get_logger(__name__)

# Higher number = more privilege
ROLE_HIERARCHY: dict[str, int] = {
    "owner": 4,
    "admin": 3,
    "editor": 2,
    "viewer": 1,
}


def check_permission(user_role: str, required_role: str) -> bool:
    """Check whether *user_role* meets or exceeds *required_role*.

    Args:
        user_role: The role the user currently holds (e.g. ``"editor"``).
        required_role: The minimum role required (e.g. ``"admin"``).

    Returns:
        ``True`` if the user has sufficient privilege, ``False`` otherwise.
    """
    user_level = ROLE_HIERARCHY.get(user_role, 0)
    required_level = ROLE_HIERARCHY.get(required_role, 0)
    return user_level >= required_level


def require_role(min_role: str) -> Callable[..., Any]:
    """Create a FastAPI dependency that enforces a minimum organization role.

    Usage::

        @router.post("/campaigns")
        async def create_campaign(
            org_ctx: dict = Depends(require_role("editor")),
        ):
            ...

    Args:
        min_role: The minimum role string (one of ``owner``, ``admin``,
            ``editor``, ``viewer``).

    Returns:
        A FastAPI-compatible dependency callable.
    """

    async def _check(
        org_ctx: dict[str, Any] = Depends(get_current_org),
    ) -> dict[str, Any]:
        if not check_permission(org_ctx["role"], min_role):
            logger.warning(
                "insufficient_permissions",
                user_id=org_ctx["user_id"],
                org_id=org_ctx["org_id"],
                user_role=org_ctx["role"],
                required_role=min_role,
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{min_role}' or higher is required",
            )
        return org_ctx

    return _check
