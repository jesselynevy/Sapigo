from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.ai_service.inference.verification import VerificationService
from app.core.db import get_db
from app.core.exceptions import ImageQualityRejected
from app.model.enums import MediaType, VerificationDecision
from app.schema.verification import TransferRead, VerificationRead
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


@router.post("/{animal_id}/transfer", response_model=TransferRead)
async def transfer_animal(
    animal_id: UUID,
    file: UploadFile = File(...),
    owner_id: UUID = Form(...),
    receiver_phone: str = Form(..., min_length=6, max_length=20),
    verified_by_user_id: UUID | None = Form(None),
    db: Session = Depends(get_db),
):
    """Verify a muzzle before recording a cow-out timestamp.

    Receiver contact is validated at the API boundary but deliberately not persisted:
    the agreed transfer record is the animal's ``transferred_at`` timestamp.
    """
    del receiver_phone
    animal_service = AnimalService(db)
    try:
        animal_service.get_owned_animal(animal_id, owner_id)
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
    except ImageQualityRejected as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "image_rejected", "reasons": exc.reasons, "scores": exc.scores},
        ) from exc

    try:
        verification = verification_service.verify(
            animal_id=animal_id,
            query_image_bytes=raw_bytes,
            media_asset_id=media_asset.id,
            verified_by_user_id=verified_by_user_id,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    if verification.decision != VerificationDecision.VERIFIED:
        return TransferRead(
            verification=verification,
            transferred=False,
            transferred_at=None,
        )

    try:
        animal = animal_service.mark_transferred(animal_id, owner_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return TransferRead(
        verification=verification,
        transferred=True,
        transferred_at=animal.transferred_at,
    )
