from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.route import routers
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
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