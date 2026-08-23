from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.model.enums import VerificationDecision


class VerificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    animal_id: UUID
    muzzle_template_id: UUID
    media_asset_id: UUID
    verified_by_user_id: UUID | None
    similarity_score: float
    decision: VerificationDecision
    model_version: str
    quality_flags: dict | None
    created_at: datetime


class TransferRead(BaseModel):
    verification: VerificationRead
    transferred: bool
    transferred_at: datetime | None
