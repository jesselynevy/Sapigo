from app.route.animal import router as animal_router
from app.route.media_asset import router as media_asset_router
from app.route.muzzle_template import router as muzzle_template_router
from app.route.verification import router as verification_router

routers = [
    animal_router,
    media_asset_router,
    muzzle_template_router,
    verification_router,
]

__all__ = [
    "animal_router",
    "media_asset_router",
    "muzzle_template_router",
    "verification_router",
]