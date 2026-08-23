import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from app.model.animal import Animal
from app.model.enums import AnimalStatus
from app.repository.animal_repo import AnimalRepository
from app.schema.animal import AnimalBase, AnimalUpdate


class AnimalNotFoundError(Exception):
    """Raised when a lookup by id finds nothing."""

# Just basic CRUD For now
class AnimalService:

    def __init__(self, db: Session):
        self.db = db
        self.repo = AnimalRepository(db)

    def create_animal(self, data: AnimalBase) -> Animal:
        return self.repo.create(**data.model_dump())

    def get_animal(self, animal_id: uuid.UUID) -> Animal:
        animal = self.repo.get(animal_id)
        if animal is None:
            raise AnimalNotFoundError(f"Animal '{animal_id}' not found")
        return animal

    def get_owned_animal(self, animal_id: uuid.UUID, owner_id: uuid.UUID) -> Animal:
        animal = self.get_animal(animal_id)
        if animal.owner_id != owner_id:
            raise AnimalNotFoundError(f"Animal '{animal_id}' not found for this owner")
        return animal

    def list_animals(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[AnimalStatus] = None,
        owner_id: Optional[uuid.UUID] = None,
        include_transferred: bool = False,
    ) -> List[Animal]:
        if owner_id is not None:
            return self.repo.get_by_owner(
                owner_id,
                skip=skip,
                limit=limit,
                include_transferred=include_transferred,
            )
        if status is not None:
            return self.repo.get_by_status(status, skip=skip, limit=limit)
        return self.repo.get_all(skip=skip, limit=limit)

    def mark_transferred(self, animal_id: uuid.UUID, owner_id: uuid.UUID) -> Animal:
        animal = self.get_owned_animal(animal_id, owner_id)
        if animal.transferred_at is not None:
            raise ValueError(f"Animal '{animal_id}' has already been transferred")
        animal.transferred_at = datetime.now()
        self.db.commit()
        self.db.refresh(animal)
        return animal

    def update_animal(self, animal_id: uuid.UUID, data: AnimalUpdate) -> Animal:
        if self.repo.get(animal_id) is None:
            raise AnimalNotFoundError(f"Animal '{animal_id}' not found")

        payload = data.model_dump(exclude_unset=True)
        updated = self.repo.update(animal_id, **payload)
        assert updated is not None  # existence just checked above
        return updated

    def delete_animal(self, animal_id: uuid.UUID) -> None:
        deleted = self.repo.delete(animal_id)
        if not deleted:
            raise AnimalNotFoundError(f"Animal '{animal_id}' not found")
