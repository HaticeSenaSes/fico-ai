from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, transactions, dashboard, goals, insights, categories, notifications
from app.models import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FiCo AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(dashboard.router)
app.include_router(goals.router)
app.include_router(insights.router)
app.include_router(categories.router)
app.include_router(notifications.router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/v1")
def api_root():
    return {"message": "FiCo AI API v1", "docs": "/docs"}