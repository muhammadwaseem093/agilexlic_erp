import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    header_name = "X-Correlation-ID"

    async def dispatch(self, request: Request, call_next) -> Response:
        correlation_id = request.headers.get(self.header_name) or str(uuid.uuid4())
        request.state.correlation_id = correlation_id
        start = time.perf_counter()
        response = await call_next(request)
        response.headers[self.header_name] = correlation_id
        response.headers["X-Response-Time-Ms"] = f"{(time.perf_counter() - start) * 1000:.2f}"
        return response
