"""Custom exception types and FastAPI exception handlers.

Register all handlers via ``register_exception_handlers(app)`` during
application startup.
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


# ---------------------------------------------------------------------------
# Custom exceptions
# ---------------------------------------------------------------------------

class NotFoundError(Exception):
    """Raised when a requested resource does not exist."""

    def __init__(self, resource: str = "Resource", detail: str | None = None) -> None:
        self.resource = resource
        self.detail = detail or f"{resource} not found"
        super().__init__(self.detail)


class ForbiddenError(Exception):
    """Raised when the user lacks permission for the requested action."""

    def __init__(self, detail: str = "You do not have permission to perform this action") -> None:
        self.detail = detail
        super().__init__(self.detail)


class BadRequestError(Exception):
    """Raised when the client sends an invalid or malformed request."""

    def __init__(self, detail: str = "Bad request") -> None:
        self.detail = detail
        super().__init__(self.detail)


class ConflictError(Exception):
    """Raised when the request conflicts with existing state (e.g. duplicates)."""

    def __init__(self, detail: str = "Resource conflict") -> None:
        self.detail = detail
        super().__init__(self.detail)


# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------

async def _not_found_handler(_request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": exc.detail})


async def _forbidden_handler(_request: Request, exc: ForbiddenError) -> JSONResponse:
    return JSONResponse(status_code=403, content={"detail": exc.detail})


async def _bad_request_handler(_request: Request, exc: BadRequestError) -> JSONResponse:
    return JSONResponse(status_code=400, content={"detail": exc.detail})


async def _conflict_handler(_request: Request, exc: ConflictError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": exc.detail})


def register_exception_handlers(app: FastAPI) -> None:
    """Attach all custom exception handlers to the FastAPI application.

    Args:
        app: The FastAPI application instance.
    """
    app.add_exception_handler(NotFoundError, _not_found_handler)  # type: ignore[arg-type]
    app.add_exception_handler(ForbiddenError, _forbidden_handler)  # type: ignore[arg-type]
    app.add_exception_handler(BadRequestError, _bad_request_handler)  # type: ignore[arg-type]
    app.add_exception_handler(ConflictError, _conflict_handler)  # type: ignore[arg-type]
