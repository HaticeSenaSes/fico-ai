from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.database import get_db
from app.models.models import Transaction, Category
from app.security import verify_token
from datetime import datetime, timezone, timedelta
from typing import Optional

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])

def get_current_user_id(token: str = Depends(verify_token)) -> str:
    return token

@router.get("/summary")
def get_summary(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    now = datetime.now(timezone.utc)
    month = month or now.month
    year = year or now.year

    txs = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.is_deleted == False,
        extract("month", Transaction.transaction_at) == month,
        extract("year", Transaction.transaction_at) == year,
    ).all()

    total_income = sum(float(t.amount) for t in txs if t.type == "income")
    total_expense = sum(float(t.amount) for t in txs if t.type == "expense")
    net_balance = total_income - total_expense
    pct = (total_expense / total_income * 100) if total_income > 0 else 0

    return {
        "net_balance": net_balance,
        "total_income": total_income,
        "total_expense": total_expense,
        "remaining_budget": net_balance,
        "status_color": "green" if pct < 70 else "yellow" if pct < 90 else "red",
        "budget_pct": round(pct, 1),
    }

@router.get("/chart/weekly")
def get_weekly_chart(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    today = datetime.now(timezone.utc)
    days = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        total = db.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            Transaction.is_deleted == False,
            func.date(Transaction.transaction_at) == day.date(),
        ).scalar() or 0
        days.append({"gun": day.strftime("%a"), "tutar": float(total)})
    return {"days": days}

@router.get("/chart/category")
def get_category_chart(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    now = datetime.now(timezone.utc)
    month = month or now.month
    year = year or now.year

    results = db.query(
        Category.name, Category.color,
        func.sum(Transaction.amount).label("total")
    ).join(Transaction, Transaction.category_id == Category.id).filter(
        Transaction.user_id == user_id,
        Transaction.type == "expense",
        Transaction.is_deleted == False,
        extract("month", Transaction.transaction_at) == month,
        extract("year", Transaction.transaction_at) == year,
    ).group_by(Category.id).order_by(func.sum(Transaction.amount).desc()).all()

    return {"categories": [{"name": r.name, "color": r.color, "value": float(r.total)} for r in results]}

@router.get("/recent")
def get_recent(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    txs = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.is_deleted == False,
    ).order_by(Transaction.transaction_at.desc()).limit(5).all()
    return {"transactions": txs}