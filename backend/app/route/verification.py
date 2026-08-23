from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.ai_service.inference.verification import VerificationService
from app.core.db import get_db
from app.core.exceptions import ImageQualityRejected
from app.model.enums import MediaType
from app.schema.verification import VerificationRead
from app.service.animal_service import AnimalNotFoundError, AnimalService
from app.service.media_asset_service import MediaAssetService

router = APIRouter(prefix="/animals", tags=["verification"])


@router.post(
    "/{animal_id}/verify",
    response_model=VerificationRead,
    status_code=status.HTTP_201_CREATED,
)
async def verify_animal(
    animal_id: UUID,
    file: UploadFile = File(...),
    owner_id: UUID = Form(...),
    verified_by_user_id: UUID | None = Form(None),  # TODO: replace with get_current_user later
    db: Session = Depends(get_db),
):
    try:
        AnimalService(db).get_owned_animal(animal_id, owner_id)
    except AnimalNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    media_service = MediaAssetService(db)
    verification_service = VerificationService(db)

    raw_bytes = await file.read()
    await file.seek(0)

    try:
        media_asset = await media_service.upload_photo(
            file=file,
            uploaded_by_user_id=verified_by_user_id,
            animal_id=animal_id,
            media_type=MediaType.OTHER,
        )
    except ImageQualityRejected as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "image_rejected", "reasons": e.reasons, "scores": e.scores},
        )

    try:
        return verification_service.verify(
            animal_id=animal_id,
            query_image_bytes=raw_bytes,
            media_asset_id=media_asset.id,
            verified_by_user_id=verified_by_user_id,
            quality_flags=None,  # see note below
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
