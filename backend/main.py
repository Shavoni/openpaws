"""OpenPaws API — FastAPI entry point."""

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

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered social media management with autonomous agents",
    version="0.1.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Middleware (last added = first executed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
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
    return {"name": settings.APP_NAME, "version": "0.1.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
