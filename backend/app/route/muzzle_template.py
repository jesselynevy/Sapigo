from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.ai_service.inference.enrollment import EnrollmentService
from app.core.db import get_db
from app.schema.muzzle_template import EnrollRequest, MuzzleTemplateRead

router = APIRouter(prefix="/animals", tags=["enrollment"])


@router.post(
    "/{animal_id}/enroll",
    response_model=MuzzleTemplateRead,
    status_code=status.HTTP_201_CREATED,
)
async def enroll_animal(animal_id: UUID, body: EnrollRequest, db: Session = Depends(get_db)):
    service = EnrollmentService(db)
    try:
        return await service.enroll(animal_id=animal_id, media_asset_ids=body.media_asset_ids)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))