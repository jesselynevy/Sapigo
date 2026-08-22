import math
import torch, torch.nn as nn

class ArcFaceHead(nn.Module):
    def __init__(self, embedding_dim, num_classes, s=30.0, m=0.50):
        super().__init__()
        self.s, self.m = s, m
        self.weight = nn.Parameter(torch.FloatTensor(num_classes, embedding_dim))
        nn.init.xavier_uniform_(self.weight)
        self.cos_m, self.sin_m = math.cos(m), math.sin(m)
        self.th = math.cos(math.pi - m)
        self.mm = math.sin(math.pi - m) * m

    def forward(self, embeddings, labels):
        W = nn.functional.normalize(self.weight, p=2, dim=1)
        cosine = nn.functional.linear(embeddings, W)
        sine = torch.sqrt((1.0 - cosine.pow(2)).clamp(0, 1))
        phi = cosine * self.cos_m - sine * self.sin_m
        phi = torch.where(cosine > self.th, phi, cosine - self.mm)
        one_hot = torch.zeros_like(cosine)
        one_hot.scatter_(1, labels.view(-1, 1), 1)
        logits = (one_hot * phi + (1.0 - one_hot) * cosine) * self.s
        return logits