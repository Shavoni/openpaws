"""Async SQLAlchemy session factory for Supabase Postgres."""

import os

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./openpaws_dev.db",
).replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=(os.getenv("ENV") == "development"))
async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
