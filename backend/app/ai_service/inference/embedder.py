import io

import numpy as np
import torch
import torchvision.transforms as T
from PIL import Image

from app.ai_service.inference.model_loader import get_device, get_model

IMG_SIZE = 224

_eval_transform = T.Compose([
    T.Resize((IMG_SIZE, IMG_SIZE)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def _preprocess(image_bytes: bytes) -> torch.Tensor:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return _eval_transform(img).unsqueeze(0)


@torch.no_grad()
def embed_image(image_bytes: bytes) -> np.ndarray:
    """One image -> one 256-d, L2-normalized embedding."""
    tensor = _preprocess(image_bytes).to(get_device())
    embedding = get_model()(tensor)
    return embedding.squeeze(0).cpu().numpy()


def average_embeddings(embeddings: list[np.ndarray]) -> np.ndarray:
    """Average unit-normalized embeddings and re-normalize -- the mean of
    unit vectors isn't itself unit length, so this step isn't optional."""
    mean_vec = np.stack(embeddings, axis=0).mean(axis=0)
    norm = np.linalg.norm(mean_vec)
    if norm == 0:
        raise ValueError("Zero-norm average -- embeddings may be degenerate")
    return mean_vec / norm