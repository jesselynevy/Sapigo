import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base

if TYPE_CHECKING:
    from app.model.media_asset import MediaAsset
    from app.model.verification import Verification

# Basic User table


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    whatsapp_number: Mapped[str] = mapped_column(
        String(20), nullable=False, unique=True
    )
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    last_login: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    verifications_performed: Mapped[list["Verification"]] = relationship(
        back_populates="verified_by_user"
    )
    media_assets_uploaded: Mapped[list["MediaAsset"]] = relationship(
        back_populates="uploaded_by_user"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} whatsapp={self.whatsapp_number!r}>"
