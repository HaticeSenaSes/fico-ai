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

from fastapi import HTTPException
from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str
    icon: str = '📦'
    color: str = '#F3F4F6'

@router.post('')
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    import uuid
    cat = Category(
        id=str(uuid.uuid4()),
        name=payload.name.strip(),
        icon=payload.icon,
        color=payload.color,
        is_system=False,
        user_id=user_id,
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {'id': cat.id, 'name': cat.name, 'icon': cat.icon, 'color': cat.color}
