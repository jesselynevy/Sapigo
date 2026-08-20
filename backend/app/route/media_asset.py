from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.model.enums import MediaType
from app.schema.media_asset import MediaAssetRead
from app.service.media_asset_service import MediaAssetService

router = APIRouter(prefix="/media-assets", tags=["media-assets"])


@router.post("/upload", response_model=MediaAssetRead, status_code=status.HTTP_201_CREATED)
async def upload_media_asset(
    file: UploadFile = File(...),
    animal_id: UUID | None = Form(None),
    muzzle_template_id: UUID | None = Form(None),
    uploaded_by_user_id: UUID | None = Form(None),  # TODO: replace with get_current_user later
    media_type: MediaType = Form(MediaType.MUZZLE_PHOTO),
    db: Session = Depends(get_db),
):
    service = MediaAssetService(db)
    return await service.upload_photo(
        file=file,
        uploaded_by_user_id=uploaded_by_user_id,
        animal_id=animal_id,
        muzzle_template_id=muzzle_template_id,
        media_type=media_type,
    )


@router.get("/{id}", response_model=MediaAssetRead)
def get_media_asset(id: UUID, db: Session = Depends(get_db)):
    obj = MediaAssetService(db).get(id)
    if obj is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found")
    return obj


@router.get("/animal/{animal_id}", response_model=List[MediaAssetRead])
def list_media_assets_by_animal(animal_id: UUID, db: Session = Depends(get_db)):
    return MediaAssetService(db).get_by_animal(animal_id)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media_asset(id: UUID, db: Session = Depends(get_db)):
    if not MediaAssetService(db).delete(id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found")