import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class OtpRequest(BaseModel):
    whatsapp_number: str = Field(pattern=r"^\+[1-9]\d{7,14}$")


class OtpVerifyRequest(OtpRequest):
    code: str = Field(pattern=r"^\d{4,10}$")


class ProfileUpdateRequest(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)

    @field_validator("full_name")
    @classmethod
    def strip_full_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("full_name must not be blank")
        return value


class OtpRequestAccepted(BaseModel):
    message: str


class AuthenticatedUserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    whatsapp_number: str
    full_name: str | None
    verified_at: datetime | None
    last_login: datetime | None

