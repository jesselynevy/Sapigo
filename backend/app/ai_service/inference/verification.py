from uuid import UUID

import numpy as np
from sqlalchemy.orm import Session

from app.ai_service.inference.embedder import embed_image
from app.ai_service.inference.model_loader import MODEL_VERSION
from app.model.enums import VerificationDecision
from app.repository.muzzle_template_repo import MuzzleTemplateRepository
from app.repository.verification_repo import VerificationRepository

# From evaluate_openset() on your held-out set, re-derived for centroid-vs-query similarity.
ACCEPT_THRESHOLD = 0.62


class VerificationService:
    def __init__(self, db: Session):
        self.db = db
        self.template_repo = MuzzleTemplateRepository(db)
        self.verification_repo = VerificationRepository(db)

    def verify(
        self,
        animal_id: UUID,
        query_image_bytes: bytes,
        media_asset_id: UUID,
        verified_by_user_id: UUID | None = None,
        quality_flags: dict | None = None,
    ):
        template = self.template_repo.get_by_animal(animal_id)
        if template is None:
            raise ValueError(f"No muzzle template enrolled for animal {animal_id}")

        print("Embedding time!")
        query_embedding = embed_image(query_image_bytes)
        similarity = float(query_embedding @ np.array(template.embedding))

        decision = (
            VerificationDecision.VERIFIED
            if similarity >= ACCEPT_THRESHOLD
            else VerificationDecision.MISMATCH
        )

        return self.verification_repo.create(
            animal_id=animal_id,
            muzzle_template_id=template.template_id,
            media_asset_id=media_asset_id,
            verified_by_user_id=verified_by_user_id,
            similarity_score=similarity,
            decision=decision,
            model_version=MODEL_VERSION,
            quality_flags=quality_flags,
        )