from typing import List, Optional
from uuid import UUID

from sqlalchemy import select

from app.model.media_asset import MediaAsset
from app.repository.base_repo import BaseRepository


class MediaAssetRepository(BaseRepository[MediaAsset]):
    model = MediaAsset

    def get_by_animal(self, animal_id: UUID) -> List[MediaAsset]:
        return (
            self.db.query(self.model)
            .filter(self.model.animal_id == animal_id)
            .order_by(self.model.captured_at.desc())
            .all()
        )

    def get_by_muzzle_template(self, template_id: UUID) -> List[MediaAsset]:
        return (
            self.db.query(self.model)
            .filter(self.model.muzzle_template_id == template_id)
            .all()
        )

    def get_by_uploader(self, user_id: UUID, skip: int = 0, limit: int = 100) -> List[MediaAsset]:
        return (
            self.db.query(self.model)
            .filter(self.model.uploaded_by_user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def attach_to_animal(self, id: UUID, animal_id: UUID) -> Optional[MediaAsset]:
        return self.update(id, animal_id=animal_id)

    def attach_to_template(self, id: UUID, template_id: UUID) -> Optional[MediaAsset]:
        return self.update(id, muzzle_template_id=template_id)