class ImageQualityRejected(Exception):
    def __init__(self, reasons: list[str], scores: dict):
        self.reasons = reasons
        self.scores = scores
        super().__init__(f"Image rejected: {', '.join(reasons)}")