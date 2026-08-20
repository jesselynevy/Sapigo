from app.route.animal import router as animal_router
from app.route.media_asset import router as media_asset_router

routers = [
    animal_router,
    media_asset_router,
]

__all__ = [
    "animal_router",
    "media_asset_router",
]