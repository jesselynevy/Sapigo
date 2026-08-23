import io
from dataclasses import dataclass, field

import cv2
import numpy as np
from PIL import Image

# TODO: IMPORTANT RECALIBRATE THIS ON PRODUCTION
BLUR_THRESHOLD = 30.70
DARK_MEAN_THRESHOLD = 40.0
BRIGHT_MEAN_THRESHOLD = 215.0
CLIPPED_FRACTION_THRESHOLD = 0.05


@dataclass
class QualityResult:
    accepted: bool
    reasons: list[str] = field(default_factory=list)
    scores: dict = field(default_factory=dict)


def _load_grayscale(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("L")
    return np.array(img)


def _blur_score(gray: np.ndarray) -> float:
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def _exposure_stats(gray: np.ndarray) -> dict:
    total = gray.size
    return {
        "mean_brightness": float(gray.mean()),
        "clipped_low_fraction": float((gray <= 2).sum()) / total,
        "clipped_high_fraction": float((gray >= 253).sum()) / total,
    }


def assess_quality(image_bytes: bytes) -> QualityResult:
    gray = _load_grayscale(image_bytes)
    blur = _blur_score(gray)
    exposure = _exposure_stats(gray)

    reasons = []
    if blur < BLUR_THRESHOLD:
        reasons.append("blurry")
    if exposure["mean_brightness"] < DARK_MEAN_THRESHOLD:
        reasons.append("underexposed")
    if exposure["mean_brightness"] > BRIGHT_MEAN_THRESHOLD:
        reasons.append("overexposed")
    if exposure["clipped_low_fraction"] > CLIPPED_FRACTION_THRESHOLD:
        reasons.append("shadow_clipping")
    if exposure["clipped_high_fraction"] > CLIPPED_FRACTION_THRESHOLD:
        reasons.append("highlight_clipping")

    return QualityResult(
        accepted=len(reasons) == 0,
        reasons=reasons,
        scores={"blur_variance": blur, **exposure},
    )