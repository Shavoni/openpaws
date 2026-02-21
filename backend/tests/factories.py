"""Factory functions for generating test data."""
import uuid
from datetime import datetime, timezone
from typing import Any


def _uuid() -> str:
    """Generate a new UUID4 string."""
    return str(uuid.uuid4())


def _now_iso() -> str:
    """Return current UTC time as ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Organization
# ---------------------------------------------------------------------------

def make_organization(**overrides: Any) -> dict[str, Any]:
    """Create a realistic organization dict.

    >>> org = make_organization(name='Acme Corp')
    >>> assert org['name'] == 'Acme Corp'
    """
    defaults: dict[str, Any] = {
        "id": _uuid(),
        "name": "OpenPaws Test Org",
        "slug": "openpaws-test-org",
        "logo_url": "https://storage.example.com/logos/default.png",
        "plan": "pro",
        "settings": {
            "timezone": "America/New_York",
            "default_approval_required": True,
            "ai_model": "gpt-4o",
        },
        "created_at": _now_iso(),
        "updated_at": _now_iso(),
    }
    defaults.update(overrides)
    return defaults


# ---------------------------------------------------------------------------
# Post
# ---------------------------------------------------------------------------

def make_post(**overrides: Any) -> dict[str, Any]:
    """Create a realistic social-media post dict.

    >>> post = make_post(status='approved')
    >>> assert post['status'] == 'approved'
    """
    org_id = overrides.pop("organization_id", _uuid())
    defaults: dict[str, Any] = {
        "id": _uuid(),
        "organization_id": org_id,
        "author_id": _uuid(),
        "title": "Test Post Title",
        "body": "This is a test post body with enough content to be realistic.",
        "platform": "twitter",
        "status": "draft",
        "media_urls": [],
        "hashtags": ["#openpaws", "#testing"],
        "scheduled_at": None,
        "published_at": None,
        "approval_feedback": None,
        "metadata": {},
        "created_at": _now_iso(),
        "updated_at": _now_iso(),
    }
    defaults.update(overrides)
    return defaults


# ---------------------------------------------------------------------------
# Campaign
# ---------------------------------------------------------------------------

def make_campaign(**overrides: Any) -> dict[str, Any]:
    """Create a realistic campaign dict.

    >>> campaign = make_campaign(name='Holiday Promo')
    >>> assert campaign['name'] == 'Holiday Promo'
    """
    defaults: dict[str, Any] = {
        "id": _uuid(),
        "organization_id": _uuid(),
        "name": "Test Campaign",
        "description": "A campaign created for integration testing.",
        "status": "active",
        "platforms": ["twitter", "instagram", "linkedin"],
        "target_audience": "tech-savvy professionals aged 25-45",
        "tone": "professional",
        "goals": ["engagement", "brand_awareness"],
        "start_date": _now_iso(),
        "end_date": None,
        "post_ids": [],
        "created_at": _now_iso(),
        "updated_at": _now_iso(),
    }
    defaults.update(overrides)
    return defaults


# ---------------------------------------------------------------------------
# Agent Run
# ---------------------------------------------------------------------------

def make_agent_run(**overrides: Any) -> dict[str, Any]:
    """Create a realistic agent-run dict.

    >>> run = make_agent_run(status='completed')
    >>> assert run['status'] == 'completed'
    """
    defaults: dict[str, Any] = {
        "id": _uuid(),
        "organization_id": _uuid(),
        "triggered_by": _uuid(),
        "agent_type": "content_pipeline",
        "status": "running",
        "input_params": {
            "campaign_id": _uuid(),
            "platforms": ["twitter", "instagram"],
            "topic": "Product launch announcement",
        },
        "output": None,
        "error": None,
        "steps": [],
        "requires_approval": True,
        "approved_by": None,
        "approved_at": None,
        "started_at": _now_iso(),
        "completed_at": None,
        "created_at": _now_iso(),
        "updated_at": _now_iso(),
    }
    defaults.update(overrides)
    return defaults
