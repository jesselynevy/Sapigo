import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base
from app.model.enums import AnimalStatus

if TYPE_CHECKING:
    from app.model.media_asset import MediaAsset
    from app.model.muzzle_template import MuzzleTemplate
    from app.model.verification import Verification

# Table for the cow


class Animal(Base):
    __tablename__ = "animals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    breed: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sex: Mapped[str | None] = mapped_column(String(10), nullable=True)
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

    muzzle_templates: Mapped[list["MuzzleTemplate"]] = relationship(
        back_populates="animal"
    )

    verifications: Mapped[list["Verification"]] = relationship(back_populates="animal")
    media_assets: Mapped[list["MediaAsset"]] = relationship(back_populates="animal")

    def __repr__(self) -> str:
        return f"<Animal id={self.id} name={self.display_name!r} status={self.status}>"