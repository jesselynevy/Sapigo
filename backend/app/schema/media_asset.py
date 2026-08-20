from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.model.enums import MediaType


class MediaAssetBase(BaseModel):
    animal_id: Optional[UUID] = None
    muzzle_template_id: Optional[UUID] = None
    media_type: MediaType = MediaType.MUZZLE_PHOTO


class MediaAssetCreate(MediaAssetBase):
    """Used internally by the service when persisting after a Cloudinary upload."""

    storage_path: str
    uploaded_by_user_id: Optional[UUID] = None


class MediaAssetRead(MediaAssetBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    storage_path: str
    uploaded_by_user_id: Optional[UUID] = None
    captured_at: datetime
    created_at: datetime