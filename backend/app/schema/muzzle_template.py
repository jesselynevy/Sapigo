from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EnrollRequest(BaseModel):
    media_asset_ids: list[UUID] = Field(..., min_length=1)


class MuzzleTemplateRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    template_id: UUID
    animal_id: UUID
    reference_image_count: int
    model_version: str
    embedding_dimension: int
    enrollment_quality: float | None
    created_at: datetime