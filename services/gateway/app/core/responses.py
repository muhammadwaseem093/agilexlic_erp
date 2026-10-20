from typing import Any

from pydantic import BaseModel, Field


class ErrorBody(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class ApiEnvelope(BaseModel):
    success: bool = True
    correlation_id: str | None = None
    data: Any = None
    error: ErrorBody | None = None


def success_envelope(data: Any, correlation_id: str | None) -> dict[str, Any]:
    return ApiEnvelope(success=True, correlation_id=correlation_id, data=data).model_dump(
        exclude_none=True
    )


def error_envelope(
    code: str,
    message: str,
    correlation_id: str | None,
    details: dict[str, Any] | None = None,
) -> dict[str, Any]:
    return ApiEnvelope(
        success=False,
        correlation_id=correlation_id,
        error=ErrorBody(code=code, message=message, details=details),
    ).model_dump(exclude_none=True)
