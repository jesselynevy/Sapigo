from typing import List
from uuid import UUID

from app.model.animal import Animal
from app.model.enums import AnimalStatus
from app.repository.base_repo import BaseRepository


class AnimalRepository(BaseRepository[Animal]):
    model = Animal

    def get_by_status(
        self, status: AnimalStatus, skip: int = 0, limit: int = 100
    ) -> List[Animal]:
        return (
            self.db.query(self.model)
            .filter(self.model.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_owner(
        self, owner_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[Animal]:
        return (
            self.db.query(self.model)
            .filter(self.model.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
