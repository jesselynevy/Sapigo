from typing import Optional
from uuid import UUID

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.cloudinary import upload_to_cloudinary
from app.core.exceptions import ImageQualityRejected
from app.model.enums import MediaType
from app.model.media_asset import MediaAsset
from app.repository.media_asset_repo import MediaAssetRepository
from app.utils.image_quality import assess_quality


class MediaAssetService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = MediaAssetRepository(db)

    async def upload_photo(
        self,
        file: UploadFile,
        uploaded_by_user_id: UUID,
        animal_id: Optional[UUID] = None,
        muzzle_template_id: Optional[UUID] = None,
        media_type: MediaType = MediaType.MUZZLE_PHOTO,
    ) -> MediaAsset:
        raw_bytes = await file.read()

        result = assess_quality(raw_bytes)
        if not result.accepted:
            raise ImageQualityRejected(reasons=result.reasons, scores=result.scores)

        # rewind so upload_to_cloudinary can read the file stream again
        await file.seek(0)
        upload_result = await upload_to_cloudinary(file)

        return self.repo.create(
            storage_path=upload_result.secure_url,
            media_type=media_type,
            animal_id=animal_id,
            muzzle_template_id=muzzle_template_id,
            uploaded_by_user_id=uploaded_by_user_id,
        )

    def get(self, id: UUID) -> Optional[MediaAsset]:
        return self.repo.get(id)

    def get_by_animal(self, animal_id: UUID):
        return self.repo.get_by_animal(animal_id)

    def delete(self, id: UUID) -> bool:
        return self.repo.delete(id)