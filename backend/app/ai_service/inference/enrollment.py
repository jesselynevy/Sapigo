from typing import List
from uuid import UUID

import httpx
from sqlalchemy.orm import Session

from app.ai_service.inference.embedder import average_embeddings, embed_image
from app.ai_service.inference.model_loader import MODEL_VERSION
from app.model.muzzle_template import EMBEDDING_DIM
from app.repository.media_asset_repo import MediaAssetRepository
from app.repository.muzzle_template_repo import MuzzleTemplateRepository

MIN_ENROLLMENT_IMAGES = 1


class EnrollmentService:
    def __init__(self, db: Session):
        self.db = db
        self.template_repo = MuzzleTemplateRepository(db)
        self.media_asset_repo = MediaAssetRepository(db)

    async def _fetch_image_bytes(self, url: str) -> bytes:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            resp.raise_for_status()
            return resp.content

    async def enroll(
        self,
        animal_id: UUID,
        media_asset_ids: List[UUID],
        minimum_images: int = MIN_ENROLLMENT_IMAGES,
    ):
        if len(media_asset_ids) < minimum_images:
            raise ValueError(
                f"Need at least {minimum_images} image(s) to enroll, got {len(media_asset_ids)}"
            )

        assets = [self.media_asset_repo.get(mid) for mid in media_asset_ids]
        missing = [str(mid) for mid, a in zip(media_asset_ids, assets) if a is None]
        if missing:
            raise ValueError(f"Media assets not found: {missing}")

        image_bytes_list = [await self._fetch_image_bytes(a.storage_path) for a in assets]
        embeddings = [embed_image(b) for b in image_bytes_list]
        template_vector = average_embeddings(embeddings)

        existing = self.template_repo.get_by_animal(animal_id)
        if existing:
            return self.template_repo.update(
                existing.template_id,
                embedding=template_vector.tolist(),
                reference_image_count=len(embeddings),
                model_version=MODEL_VERSION,
            )

        return self.template_repo.create(
            animal_id=animal_id,
            embedding=template_vector.tolist(),
            reference_image_count=len(embeddings),
            model_version=MODEL_VERSION,
            embedding_dimension=EMBEDDING_DIM,
        )