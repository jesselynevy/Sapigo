from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DB_USER: str = ""
    DB_PASSWORD: str = ""
    DB_HOST: str = ""
    DB_PORT: str = ""
    DB_NAME: str = ""

    DATABASE_SOURCE: str = "local"
    DATABASE_URL: str = ""

    APP_ENV: str = "production"

    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_VERIFY_SERVICE_SID: str = ""

    AUTH_JWT_SECRET: str = ""
    AUTH_JWT_ALGORITHM: str = "HS256"
    AUTH_ACCESS_TOKEN_MINUTES: int = 1440
    AUTH_COOKIE_SECURE: bool = True
    AUTH_FRONTEND_ORIGIN: str = ""
    AUTH_OTP_PROVIDER: str = "twilio"
    AUTH_STUB_WHATSAPP_NUMBER: str = ""
    AUTH_STUB_OTP_CODE: str = ""

    @model_validator(mode="after")
    def build_database_url(self):
        if not self.DATABASE_URL:
            self.DATABASE_URL = (
                f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASSWORD}"
                f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            )
        return self


settings = Settings()
