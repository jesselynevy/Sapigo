import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.model.enums import AnimalStatus


class AnimalBase(BaseModel):
    owner_id: uuid.UUID
    display_name: str = Field(..., max_length=255)
    breed: str | None = Field(None, max_length=100)
    sex: str | None = Field(None, max_length=10)
    weight: float | None = Field(None, ge=0, description="Animal weight in kilograms")
    status: AnimalStatus = AnimalStatus.ACTIVE
    dataset_source: str | None = Field(None, max_length=50)
    dataset_identity: str | None = Field(None, max_length=50)


class AnimalUpdate(BaseModel):
    """All fields optional — only supplied fields are patched."""

    display_name: str | None = Field(None, max_length=255)
    breed: str | None = Field(None, max_length=100)
    sex: str | None = Field(None, max_length=10)
    weight: float | None = Field(None, ge=0, description="Animal weight in kilograms")
    status: AnimalStatus | None = None
    dataset_source: str | None = Field(None, max_length=50)
    dataset_identity: str | None = Field(None, max_length=50)


class AnimalRead(AnimalBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    owner_id: uuid.UUID | None
    created_at: datetime
    transferred_at: datetime | None
