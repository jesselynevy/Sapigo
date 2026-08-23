import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Float, ForeignKey, String, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base
from app.model.enums import AnimalStatus, VerificationDecision

if TYPE_CHECKING:
    from app.model.media_asset import MediaAsset
    from app.model.muzzle_template import MuzzleTemplate
    from app.model.user import User
    from app.model.verification import Verification

# Table for the cow


class Animal(Base):
    __tablename__ = "animals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True
    )

    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    breed: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sex: Mapped[str | None] = mapped_column(String(10), nullable=True)
    weight: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[AnimalStatus] = mapped_column(
        SAEnum(AnimalStatus, name="animal_status"),
        nullable=False,
        default=AnimalStatus.ACTIVE,
    )

    dataset_source: Mapped[str | None] = mapped_column(String(50), nullable=True)
    dataset_identity: Mapped[str | None] = mapped_column(String(50), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    transferred_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    muzzle_templates: Mapped[list["MuzzleTemplate"]] = relationship(
        back_populates="animal"
    )

    verifications: Mapped[list["Verification"]] = relationship(back_populates="animal")
    media_assets: Mapped[list["MediaAsset"]] = relationship(back_populates="animal")
    owner: Mapped["User"] = relationship(back_populates="animals")

    @property
    def latest_verification_decision(self) -> VerificationDecision | None:
        """Return the most recent persisted verification decision for this cow."""
        if not self.verifications:
            return None
        return max(self.verifications, key=lambda verification: verification.created_at).decision

    @property
    def owner_full_name(self) -> str | None:
        return self.owner.full_name if self.owner else None

    def __repr__(self) -> str:
        return f"<Animal id={self.id} name={self.display_name!r} status={self.status}>"
