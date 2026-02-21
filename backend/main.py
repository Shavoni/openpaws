"""OpenPaws API — FastAPI entry point."""

from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.core.logging import setup_logging
from app.core.middleware import RequestLoggingMiddleware
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router

setup_logging()
logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("starting", app="OpenPaws", env=settings.ENV)
    yield
    logger.info("shutdown_complete")


app = FastAPI(
    title="OpenPaws",
    description="AI-powered social media management with autonomous agents",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
)

# Middleware (last added = first executed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware)

# Routes
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")


@app.get("/", include_in_schema=False)
async def root():
    return {"name": "OpenPaws", "version": "0.1.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
