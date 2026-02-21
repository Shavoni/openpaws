"""Application configuration using Pydantic Settings.

Loads configuration from environment variables and .env files.
All sensitive values (API keys, secrets) are optional to allow
flexible deployment across environments.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Global application settings.

    Attributes are loaded from environment variables with fallback
    to values defined in a `.env` file at the project root.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # --- Supabase ---
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    SUPABASE_ANON_KEY: str

    # --- LLM API Keys ---
    OPENAI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None

    # --- Redis / Celery ---
    REDIS_URL: str = "redis://localhost:6379/0"

    # --- Social OAuth Credentials ---
    TWITTER_CLIENT_ID: str | None = None
    TWITTER_CLIENT_SECRET: str | None = None
    LINKEDIN_CLIENT_ID: str | None = None
    LINKEDIN_CLIENT_SECRET: str | None = None
    INSTAGRAM_CLIENT_ID: str | None = None
    INSTAGRAM_CLIENT_SECRET: str | None = None
    TIKTOK_CLIENT_ID: str | None = None
    TIKTOK_CLIENT_SECRET: str | None = None

    # --- Application ---
    FRONTEND_URL: str = "http://localhost:3000"
    ENV: str = "development"

    @property
    def is_production(self) -> bool:
        """Return True when running in production."""
        return self.ENV == "production"


settings = Settings()  # type: ignore[call-arg]
