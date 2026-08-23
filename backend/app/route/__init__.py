from app.route.animal import router as animal_router
from app.route.auth import router as auth_router

routers = [
    animal_router,
    auth_router,
]

__all__ = [
    "animal_router",
    "auth_router",
]
