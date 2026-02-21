"""Unit tests for the role-based permission system."""
from unittest.mock import MagicMock, patch

import pytest


# ---------------------------------------------------------------------------
# Expected role definitions (TDD: these drive the implementation)
# ---------------------------------------------------------------------------
# The permission module should expose:
#   ROLE_HIERARCHY: dict mapping role name -> numeric level
#   require_role(minimum_role): dependency that checks the user's role
#   Roles enum or constants: owner, admin, editor, viewer

class TestRoleHierarchy:
    """Tests for the role hierarchy ordering."""

    def test_role_hierarchy_ordering(self):
        """Roles must be ordered: viewer < editor < admin < owner."""
        from app.core.permissions import ROLE_HIERARCHY

        assert ROLE_HIERARCHY["viewer"] < ROLE_HIERARCHY["editor"]
        assert ROLE_HIERARCHY["editor"] < ROLE_HIERARCHY["admin"]
        assert ROLE_HIERARCHY["admin"] < ROLE_HIERARCHY["owner"]

    def test_owner_has_all_permissions(self):
        """The owner role level must be >= every other role level."""
        from app.core.permissions import ROLE_HIERARCHY

        owner_level = ROLE_HIERARCHY["owner"]
        for role, level in ROLE_HIERARCHY.items():
            assert owner_level >= level, f"Owner should outrank {role}"


class TestRequireRole:
    """Tests for the require_role dependency guard."""

    def test_require_role_allows_higher(self):
        """A user with a higher role than required should be allowed."""
        from app.core.permissions import ROLE_HIERARCHY, require_role

        # Create a mock user with 'admin' role
        mock_user = MagicMock()
        mock_user.role = "admin"

        # require_role('editor') should allow admin through
        checker = require_role("editor")

        # The checker is a dependency callable; when invoked with a user
        # whose role >= minimum, it should NOT raise.
        try:
            # In the real implementation this is a FastAPI Depends;
            # we call the inner check logic directly.
            result = checker(current_user=mock_user)
            # Should return the user or None (no exception)
        except Exception as exc:
            pytest.fail(f"Admin should pass editor check, but got: {exc}")

    def test_require_role_blocks_lower(self):
        """A user with a lower role than required should be rejected."""
        from fastapi import HTTPException

        from app.core.permissions import require_role

        mock_user = MagicMock()
        mock_user.role = "viewer"

        checker = require_role("admin")

        with pytest.raises(HTTPException) as exc_info:
            checker(current_user=mock_user)

        assert exc_info.value.status_code == 403
