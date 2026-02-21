"""ASGI middleware for cross-cutting concerns.

Includes organization context extraction and structured request logging.
"""

from __future__ import annotations

import time
from typing import Any

import structlog
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

logger = structlog.get_logger(__name__)


class OrganizationMiddleware(BaseHTTPMiddleware):
    """Extract ``X-Organization-ID`` from incoming requests.

    When present, the value is stored in ``request.state.organization_id``
    so downstream handlers and dependencies can access it without
    re-parsing headers.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Process the request and attach organization context."""
        org_id = request.headers.get("X-Organization-ID")
        request.state.organization_id = org_id

        if org_id:
            structlog.contextvars.bind_contextvars(org_id=org_id)

        response = await call_next(request)

        structlog.contextvars.unbind_contextvars("org_id")
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log every HTTP request/response with timing information.

    Uses *structlog* to emit structured JSON entries containing the
    HTTP method, path, status code, and wall-clock duration.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Log the request and measure response time."""
        start = time.perf_counter()

        # Bind per-request context
        structlog.contextvars.bind_contextvars(
            method=request.method,
            path=request.url.path,
            client_ip=request.client.host if request.client else "unknown",
        )

        logger.info("request_started")

        try:
            response = await call_next(request)
        except Exception:
            duration_ms = round((time.perf_counter() - start) * 1000, 2)
            logger.exception("request_failed", duration_ms=duration_ms)
            raise

        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        logger.info(
            "request_completed",
            status_code=response.status_code,
            duration_ms=duration_ms,
        )

        structlog.contextvars.unbind_contextvars("method", "path", "client_ip")
        return response
