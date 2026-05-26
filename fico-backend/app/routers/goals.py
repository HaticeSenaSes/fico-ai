from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.database import get_db
from app.models.models import Goal, Transaction
from app.security import verify_token
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid

router = APIRouter(prefix="/api/v1/goals", tags=["goals"])

def get_current_user_id(token: str = Depends(verify_token)) -> str:
    return token

class GoalCreate(BaseModel):
    name: str
    goal_type: str
    target_amount: float
    category_id: Optional[str] = None
    period_type: str
    period_start: datetime
    period_end: datetime

class GoalResponse(BaseModel):
    id: str
    name: str
    goal_type: str
    target_amount: float
    category_id: Optional[str] = None
    period_type: str
    period_start: datetime
    period_end: datetime
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("")
def list_goals(
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    query = db.query(Goal).filter(Goal.user_id == user_id)
    if is_active is not None:
        query = query.filter(Goal.is_active == is_active)
    return {"goals": query.all()}

@router.post("", response_model=GoalResponse, status_code=201)
def create_goal(
    payload: GoalCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    goal = Goal(
        id=str(uuid.uuid4()),
        user_id=user_id,
        **payload.model_dump()
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal

@router.get("/{goal_id}")
def get_goal(
    goal_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Hedef bulunamadı.")

    spent = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.type == "expense",
        Transaction.is_deleted == False,
        Transaction.transaction_at >= goal.period_start,
        Transaction.transaction_at <= goal.period_end,
    )
    if goal.category_id:
        spent = spent.filter(Transaction.category_id == goal.category_id)
    current = float(spent.scalar() or 0)
    target = float(goal.target_amount)

    return {
        "goal": goal,
        "progress": {
            "current_amount": current,
            "percentage": round((current / target) * 100, 1) if target > 0 else 0,
            "remaining_amount": max(target - current, 0),
        }
    }

@router.delete("/{goal_id}")
def delete_goal(
    goal_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Hedef bulunamadı.")
    db.delete(goal)
    db.commit()
    return {"success": True}