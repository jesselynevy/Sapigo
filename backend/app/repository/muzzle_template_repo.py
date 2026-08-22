from typing import Optional
from uuid import UUID

from app.model.muzzle_template import MuzzleTemplate
from app.repository.base_repo import BaseRepository


class MuzzleTemplateRepository(BaseRepository[MuzzleTemplate]):
    model = MuzzleTemplate

    def get_by_animal(self, animal_id: UUID) -> Optional[MuzzleTemplate]:
        return (
            self.db.query(self.model)
            .filter(self.model.animal_id == animal_id)
            .one_or_none()
        )