"""Re-export settings so both import paths work."""

from app.config import Settings, settings

__all__ = ["Settings", "settings"]
