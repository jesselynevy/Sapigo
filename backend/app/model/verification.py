import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, Float, ForeignKey, String, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base
from app.model.enums import VerificationDecision

if TYPE_CHECKING:
    from app.model.animal import Animal
    from app.model.media_asset import MediaAsset
    from app.model.muzzle_template import MuzzleTemplate
    from app.model.user import User

# Verification logs


class Verification(Base):
    __tablename__ = "verifications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    animal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("animals.id"), nullable=False
    )
    muzzle_template_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("muzzle_templates.template_id"), nullable=False
    )

    # the live photo taken for this check
    media_asset_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("media_assets.id"), nullable=False
    )
    verified_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )

    similarity_score: Mapped[float] = mapped_column(
        Float, nullable=False
    )  # cosine similarity vs. template
    decision: Mapped[VerificationDecision] = mapped_column(
        SAEnum(VerificationDecision, name="verification_decision"), nullable=False
    )
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    quality_flags: Mapped[dict | None] = mapped_column(
        JSONB, nullable=True
    )  # e.g. {"blur": false}

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )

    animal: Mapped["Animal"] = relationship(back_populates="verifications")
    muzzle_template: Mapped["MuzzleTemplate"] = relationship(
        back_populates="verifications"
    )

    media_asset: Mapped["MediaAsset"] = relationship()
    verified_by_user: Mapped[Optional["User"]] = relationship(
        back_populates="verifications_performed"
    )

    def __repr__(self) -> str:
        return f"<Verification id={self.id} animal_id={self.animal_id} decision={self.decision}>"