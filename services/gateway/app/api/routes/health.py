from fastapi import APIRouter, Request

from app.core.config import get_settings
from app.core.responses import success_envelope
from app.frappe.client import FrappeClient

router = APIRouter(tags=["health"])


@router.get("/health")
async def health(request: Request) -> dict:
    return success_envelope(
        {"status": "ok", "service": "agileclix-gateway"},
        getattr(request.state, "correlation_id", None),
    )


@router.get("/ready")
async def ready(request: Request) -> dict:
    settings = get_settings()
    frappe_status = "skipped"
    try:
        client = FrappeClient(settings)
        ping = await client.ping()
        frappe_status = "ok" if ping.get("ok") else "degraded"
    except Exception as exc:  # noqa: BLE001 — readiness probe
        frappe_status = f"unavailable: {exc.__class__.__name__}"

    return success_envelope(
        {
            "status": "ready" if frappe_status == "ok" else "degraded",
            "frappe": frappe_status,
            "site": settings.frappe_site,
        },
        getattr(request.state, "correlation_id", None),
    )
