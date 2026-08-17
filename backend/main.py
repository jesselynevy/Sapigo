from fastapi import FastAPI
from app.route import routers
import uvicorn


app = FastAPI()


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