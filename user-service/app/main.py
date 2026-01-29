from fastapi import FastAPI
from app.api import users

app = FastAPI(title="User Service")

app.include_router(users.router)

@app.get("/health")
def health_check():
    return {"status": "UP"}
