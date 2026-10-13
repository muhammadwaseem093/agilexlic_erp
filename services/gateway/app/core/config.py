from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "AgileClix Gateway"
    environment: str = "development"
    debug: bool = False

    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    frappe_base_url: str = "http://backend:8000"
    frappe_site: str = "erp.agileclix.com"

    request_timeout_seconds: float = 30.0

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
