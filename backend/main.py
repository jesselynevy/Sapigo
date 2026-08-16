from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"Project": "Sapigo"}

@app.get("/health")
def health():
    return {"status": "backend service is running."}