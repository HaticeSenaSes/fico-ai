from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import AIInsight
from app.security import verify_token
from app.services.insight_engine import generate_insight
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1/insights", tags=["insights"])

def get_current_user_id(token: str = Depends(verify_token)) -> str:
    return token

@router.get("")
def list_insights(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    insights = db.query(AIInsight).filter(
        AIInsight.user_id == user_id
    ).order_by(AIInsight.created_at.desc()).limit(10).all()
    return {"insights": insights}

@router.get("/latest")
def get_latest_insight(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    insight = db.query(AIInsight).filter(
        AIInsight.user_id == user_id
    ).order_by(AIInsight.created_at.desc()).first()
    
    if not insight:
        insight = generate_insight(db, user_id)
    
    return insight or {"message": "Henüz yeterli veri yok."}

@router.post("/{insight_id}/feedback")
def feedback(
    insight_id: str,
    is_positive: bool,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    insight = db.query(AIInsight).filter(
        AIInsight.id == insight_id,
        AIInsight.user_id == user_id
    ).first()
    if not insight:
        raise HTTPException(status_code=404, detail="İçgörü bulunamadı.")
    insight.is_positive_feedback = is_positive
    db.commit()
    return {"success": True}