from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routers import auth, transactions, dashboard, goals, insights, categories, notifications
from app.models import models
import uuid

Base.metadata.create_all(bind=engine)

# Sistem kategorilerini seed et (eğer yoksa)
def seed_categories():
    db = SessionLocal()
    try:
        existing = db.query(models.Category).filter(models.Category.is_system == True).count()
        if existing == 0:
            defaults = [
                ('Yiyecek', '🍔', '#FEF3C7'),
                ('Ulaşım', '🚌', '#E0F7F8'),
                ('Market', '🛒', '#E0F7F8'),
                ('Eğlence', '🎮', '#FCE7F3'),
                ('Sağlık', '💊', '#D1FAE5'),
                ('Giyim', '👕', '#FEE2E2'),
                ('Kira', '🏠', '#EDE9FE'),
                ('Eğitim', '📚', '#DBEAFE'),
                ('Abonelik', '📱', '#EDE9FE'),
                ('Diğer', '📦', '#F3F4F6'),
            ]
            for i, (name, icon, color) in enumerate(defaults):
                db.add(models.Category(
                    id=str(uuid.uuid4()), name=name, icon=icon,
                    color=color, is_system=True, sort_order=i,
                ))
            db.commit()
    finally:
        db.close()

seed_categories()

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
