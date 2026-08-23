import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.route import routers

app = FastAPI()

if settings.AUTH_FRONTEND_ORIGIN:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.AUTH_FRONTEND_ORIGIN],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
        allow_headers=["Content-Type", "X-CSRF-Token"],
    )

for router in routers:
    app.include_router(router, prefix="/api")

@app.get("/")
def intro():
    return {"message": "Welcome to Sapigo backend!"}

@app.get("/health")
def health():
    return {"status": "backend service is running."}


def dev():
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
