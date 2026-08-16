import uuid
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import DateTime, Float, Integer, String, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from app.core.db import Base

if TYPE_CHECKING:
    from app.model.animal import Animal
    from app.model.media_asset import MediaAsset
    from app.model.verification import Verification

# Must match the deployed embedding model's output size.
EMBEDDING_DIM = 256

# Includes the averaged vector embedded, 1 per animal

class MuzzleTemplate(Base):
    __tablename__ = "muzzle_templates"

    template_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    animal_id: Mapped[str] = mapped_column(String(20), ForeignKey("animals.animal_id"), nullable=False)

    embedding: Mapped[list] = mapped_column(Vector(EMBEDDING_DIM), nullable=False)

    reference_image_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. "sapigo-embed-v1"
    embedding_dimension: Mapped[int] = mapped_column(Integer, nullable=False, default=EMBEDDING_DIM)
    enrollment_quality: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )

    animal: Mapped["Animal"] = relationship(back_populates="muzzle_templates")
    source_media: Mapped[List["MediaAsset"]] = relationship(back_populates="muzzle_template")
    verifications: Mapped[List["Verification"]] = relationship(back_populates="muzzle_template")

    def __repr__(self) -> str:
        return f"<MuzzleTemplate id={self.template_id} animal_id={self.animal_id} model={self.model_version}>"