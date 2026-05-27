from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import verify_token
from app.models.models import Transaction, Goal, AIInsight
from datetime import datetime, timezone, timedelta
from sqlalchemy import extract

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])

def get_current_user_id(token: str = Depends(verify_token)) -> str:
    return token

@router.get("")
def get_notifications(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    notifications = []
    now = datetime.now(timezone.utc)
    month = now.month
    year = now.year

    # Bütçe uyarısı
    txs = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.is_deleted == False,
        extract("month", Transaction.transaction_at) == month,
        extract("year", Transaction.transaction_at) == year,
    ).all()
    total_income = sum(float(t.amount) for t in txs if t.type == "income")
    total_expense = sum(float(t.amount) for t in txs if t.type == "expense")
    if total_income > 0:
        pct = (total_expense / total_income) * 100
        if pct >= 90:
            notifications.append({
                "id": "budget_critical",
                "type": "warning",
                "icon": "⚠️",
                "title": "Kritik Bütçe Uyarısı",
                "body": f"Bu ay bütçenin %{round(pct)} kullandın!",
                "time": "Az önce",
                "read": False,
            })
        elif pct >= 70:
            notifications.append({
                "id": "budget_warning",
                "type": "warning",
                "icon": "⚠️",
                "title": "Bütçe Uyarısı",
                "body": f"Bu ay bütçenin %{round(pct)} kullandın.",
                "time": "Az önce",
                "read": False,
            })

    # Hedef uyarıları
    goals = db.query(Goal).filter(
        Goal.user_id == user_id,
        Goal.is_active == True,
    ).all()
    for goal in goals:
        if goal.current_amount and goal.target_amount:
            gpct = (float(goal.current_amount) / float(goal.target_amount)) * 100
            if gpct >= 100:
                notifications.append({
                    "id": f"goal_done_{goal.id}",
                    "type": "success",
                    "icon": "✅",
                    "title": "Hedef Tamamlandı",
                    "body": f"{goal.name} hedefini tamamladın!",
                    "time": "Az önce",
                    "read": False,
                })
            elif gpct >= 80:
                notifications.append({
                    "id": f"goal_warn_{goal.id}",
                    "type": "goal",
                    "icon": "🎯",
                    "title": "Hedef Uyarısı",
                    "body": f"{goal.name} hedefine %{round(gpct)} ulaştın.",
                    "time": "Az önce",
                    "read": True,
                })

    # AI içgörü
    insight = db.query(AIInsight).filter(
        AIInsight.user_id == user_id,
    ).order_by(AIInsight.created_at.desc()).first()
    if insight:
        notifications.append({
            "id": f"insight_{insight.id}",
            "type": "insight",
            "icon": "✨",
            "title": "Yeni AI İçgörü",
            "body": insight.body[:80] + "..." if len(insight.body) > 80 else insight.body,
            "time": "Bugün",
            "read": True,
        })

    # Günlük hatırlatma
    today_txs = [t for t in txs if t.transaction_at.date() == now.date()]
    if len(today_txs) == 0:
        notifications.append({
            "id": "daily_reminder",
            "type": "reminder",
            "icon": "🔔",
            "title": "Günlük Hatırlatma",
            "body": "Bugünkü harcamalarını girmeyi unutma!",
            "time": "Bugün",
            "read": True,
        })

    return {"notifications": notifications, "unread_count": sum(1 for n in notifications if not n["read"])}
