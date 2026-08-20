from torch import nn
import torchvision.models as models

class EmbeddingNet(nn.Module):
    def __init__(self, embedding_dim=256, pretrained=True):
        super().__init__()
        backbone = models.resnet50(weights="IMAGENET1K_V2" if pretrained else None)
        backbone.fc = nn.Identity()
        self.backbone = backbone
        self.fc = nn.Linear(2048, embedding_dim)

    def forward(self, x):
        feats = self.backbone(x)
        emb = self.fc(feats)
        return nn.functional.normalize(emb, p=2, dim=1)