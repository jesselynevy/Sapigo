from app.route.animal import router as animal_router
from app.route.qrcode import router as qrcode_router

routers = [animal_router, qrcode_router]

__all__ = [
    "animal_router",
    "qrcode_router",
    "routers",
]