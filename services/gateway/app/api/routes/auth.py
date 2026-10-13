from fastapi import APIRouter, Request

from app.core.responses import success_envelope

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/status")
async def auth_status(request: Request) -> dict:
    """Placeholder until Phase 3 session proxy is implemented."""
    return success_envelope(
        {
            "authenticated": False,
            "message": "Use Frappe Desk for admin until headless login ships (Phase 3).",
        },
        getattr(request.state, "correlation_id", None),
    )
