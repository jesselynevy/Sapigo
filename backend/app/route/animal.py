import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.model.enums import AnimalStatus
from app.schema.animal import AnimalBase, AnimalRead, AnimalUpdate
from app.service.animal_service import AnimalNotFoundError, AnimalService

router = APIRouter(prefix="/animals", tags=["animals"])


def get_animal_service(db: Session = Depends(get_db)) -> AnimalService:
    return AnimalService(db)


@router.post("", response_model=AnimalRead, status_code=status.HTTP_201_CREATED)
def create_animal(
    payload: AnimalBase,
    service: AnimalService = Depends(get_animal_service),
) -> AnimalRead:
    return service.create_animal(payload)


@router.get("", response_model=List[AnimalRead])
def list_animals(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[AnimalStatus] = Query(None, alias="status"),
    service: AnimalService = Depends(get_animal_service),
) -> List[AnimalRead]:
    return service.list_animals(skip=skip, limit=limit, status=status_filter)


@router.get("/{animal_id}", response_model=AnimalRead)
def get_animal(
    animal_id: uuid.UUID,
    service: AnimalService = Depends(get_animal_service),
) -> AnimalRead:
    try:
        return service.get_animal(animal_id)
    except AnimalNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.patch("/{animal_id}", response_model=AnimalRead)
def update_animal(
    animal_id: uuid.UUID,
    payload: AnimalUpdate,
    service: AnimalService = Depends(get_animal_service),
) -> AnimalRead:
    try:
        return service.update_animal(animal_id, payload)
    except AnimalNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.delete("/{animal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_animal(
    animal_id: uuid.UUID,
    service: AnimalService = Depends(get_animal_service),
) -> None:
    try:
        service.delete_animal(animal_id)
    except AnimalNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))