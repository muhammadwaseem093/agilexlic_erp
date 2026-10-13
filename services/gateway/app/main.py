from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, health
from app.core.config import get_settings
from app.core.middleware import CorrelationIdMiddleware

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    docs_url="/docs" if settings.debug else "/docs",
    redoc_url=None,
)

app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router, prefix="/api/v1")


@app.get("/")
async def root() -> dict[str, str]:
    return {"service": "agileclix-gateway", "docs": "/docs"}
