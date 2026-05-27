from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Category
from app.security import verify_token

router = APIRouter(prefix="/api/v1/categories", tags=["categories"])

def get_current_user_id(token: str = Depends(verify_token)) -> str:
    return token

@router.get("")
def list_categories(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    cats = db.query(Category).filter(
        (Category.user_id == user_id) | (Category.is_system == True)
    ).order_by(Category.sort_order).all()
    return [{"id": c.id, "name": c.name, "icon": c.icon, "color": c.color} for c in cats]
