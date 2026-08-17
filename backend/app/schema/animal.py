import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.model.enums import AnimalStatus


class AnimalBase(BaseModel):
    display_name: str = Field(..., max_length=255)
    breed: Optional[str] = Field(None, max_length=100)
    sex: Optional[str] = Field(None, max_length=10)
    status: AnimalStatus = AnimalStatus.ACTIVE
    dataset_source: Optional[str] = Field(None, max_length=50)
    dataset_identity: Optional[str] = Field(None, max_length=50)


class AnimalUpdate(BaseModel):
    """All fields optional — only supplied fields are patched."""

    display_name: Optional[str] = Field(None, max_length=255)
    breed: Optional[str] = Field(None, max_length=100)
    sex: Optional[str] = Field(None, max_length=10)
    status: Optional[AnimalStatus] = None
    dataset_source: Optional[str] = Field(None, max_length=50)
    dataset_identity: Optional[str] = Field(None, max_length=50)


class AnimalRead(AnimalBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime