import enum


class AnimalStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DEMO = "demo"


class VerificationDecision(str, enum.Enum):
    VERIFIED = "verified"
    MANUAL_REVIEW = "manual_review"
    MISMATCH = "mismatch"


class MediaType(str, enum.Enum):
    MUZZLE_PHOTO = "muzzle_photo"
    OTHER = "other"
