import threading

import torch

from app.ai_service.model.embedding_net import EmbeddingNet

EMBEDDING_DIM = 256
MODEL_VERSION = "sapigo-embed-v1"
WEIGHTS_PATH = "app/ai_service/inference/weights/embedding_net.pth"

_model_lock = threading.Lock()
_model: EmbeddingNet | None = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def get_model() -> EmbeddingNet:
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:  # double-checked locking
                m = EmbeddingNet(embedding_dim=EMBEDDING_DIM, pretrained=False)
                m.load_state_dict(torch.load(WEIGHTS_PATH, map_location=_device))
                m.eval()
                m.to(_device)
                _model = m
    return _model


def get_device() -> torch.device:
    return _device