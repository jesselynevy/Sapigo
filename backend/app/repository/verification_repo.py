from typing import List
from uuid import UUID

from app.model.verification import Verification
from app.repository.base_repo import BaseRepository


class VerificationRepository(BaseRepository[Verification]):
    model = Verification

    def get_by_animal(self, animal_id: UUID, skip: int = 0, limit: int = 100) -> List[Verification]:
        return (
            self.db.query(self.model)
            .filter(self.model.animal_id == animal_id)
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )