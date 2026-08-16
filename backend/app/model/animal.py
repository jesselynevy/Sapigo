import uuid
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
from app.model.enums import AnimalStatus

if TYPE_CHECKING:
    from app.model.muzzle_template import MuzzleTemplate
    from app.model.verification import Verification
    from app.model.media_asset import MediaAsset

# Table for the cow

class Animal(Base):
    __tablename__ = "animals"

    animal_id: Mapped[str] = mapped_column(String(20), primary_key=True)
    public_token: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)  # embedded in the QR URL

    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    breed: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    sex: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    status: Mapped[AnimalStatus] = mapped_column(
        SAEnum(AnimalStatus, name="animal_status"), nullable=False, default=AnimalStatus.ACTIVE
    )

    dataset_source: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    dataset_identity: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )

    muzzle_templates: Mapped[List["MuzzleTemplate"]] = relationship(back_populates="animal")

    verifications: Mapped[List["Verification"]] = relationship(back_populates="animal")
    media_assets: Mapped[List["MediaAsset"]] = relationship(back_populates="animal")

    def __repr__(self) -> str:
        return f"<Animal id={self.animal_id} name={self.display_name!r} status={self.status}>"