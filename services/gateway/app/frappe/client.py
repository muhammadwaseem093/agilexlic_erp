from typing import Any

import httpx

from app.core.config import Settings


class FrappeClient:
    """Server-side Frappe HTTP client (no browser credentials)."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._base = settings.frappe_base_url.rstrip("/")
        self._site = settings.frappe_site

    def _headers(self) -> dict[str, str]:
        return {
            "Host": self._site,
            "Accept": "application/json",
        }

    async def call_method(self, method: str, **params: Any) -> Any:
        url = f"{self._base}/api/method/{method}"
        async with httpx.AsyncClient(timeout=self._settings.request_timeout_seconds) as client:
            response = await client.get(url, params=params, headers=self._headers())
            response.raise_for_status()
            payload = response.json()
            if payload.get("exc_type"):
                raise RuntimeError(payload.get("exception") or "Frappe error")
            return payload.get("message")

    async def ping(self) -> dict[str, Any]:
        return await self.call_method("agileclix_erp.api.gateway.ping")
