import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base
from app.model.enums import MediaType

if TYPE_CHECKING:
    from app.model.animal import Animal
    from app.model.muzzle_template import MuzzleTemplate
    from app.model.user import User

# Single uploaded photo (1 row = 1 photo)


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    animal_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("animals.id"), nullable=True
    )
    muzzle_template_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("muzzle_templates.template_id"), nullable=True
    )  # set only for enrollment photos that fed a template
    uploaded_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )

    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    media_type: Mapped[MediaType] = mapped_column(
        SAEnum(MediaType, name="media_type"),
        nullable=False,
        default=MediaType.MUZZLE_PHOTO,
    )

    captured_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )

    animal: Mapped[Optional["Animal"]] = relationship(back_populates="media_assets")
    muzzle_template: Mapped[Optional["MuzzleTemplate"]] = relationship(
        back_populates="source_media"
    )
    uploaded_by_user: Mapped[Optional["User"]] = relationship(
        back_populates="media_assets_uploaded"
    )

    def __repr__(self) -> str:
        return f"<MediaAsset id={self.id} animal_id={self.animal_id} type={self.media_type}>"