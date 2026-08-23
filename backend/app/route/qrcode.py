from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.db import get_db
from app.schema.animal import VerificationLinkRead
from app.service.animal_service import AnimalNotFoundError, AnimalService
from app.service.qr_service import generate_qr_image

router = APIRouter()

def verification_url(animal_id: UUID, owner_id: UUID) -> str:
    base_url = settings.FRONTEND_BASE_URL.rstrip("/")
    return f"{base_url}/verification/{animal_id}?owner_id={owner_id}"


def get_animal_or_404(animal_id: UUID, db: Session) -> tuple[UUID, UUID]:
    try:
        animal = AnimalService(db).get_animal(animal_id)
    except AnimalNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return animal.id, animal.owner_id


@router.get("/animals/{animal_id}/verification-link", response_model=VerificationLinkRead)
def get_verification_link(animal_id: UUID, db: Session = Depends(get_db)):
    animal_id, owner_id = get_animal_or_404(animal_id, db)
    return VerificationLinkRead(
        animal_id=animal_id,
        owner_id=owner_id,
        url=verification_url(animal_id, owner_id),
    )


@router.get("/animals/{animal_id}/qrcode")
def generate_cow_qr(animal_id: UUID, db: Session = Depends(get_db)):
    animal_id, owner_id = get_animal_or_404(animal_id, db)
    return StreamingResponse(
        generate_qr_image(verification_url(animal_id, owner_id)),
        media_type="image/png",
    )
