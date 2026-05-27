from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.database import get_db
from app.models.models import Transaction, Category
from app.security import verify_token
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid

router = APIRouter(prefix="/api/v1/transactions", tags=["transactions"])

def get_current_user_id(token: str = Depends(verify_token)) -> str:
    return token

class TransactionCreate(BaseModel):
    type: str
    amount: float
    category_id: str
    note: Optional[str] = None
    transaction_at: datetime

class TransactionResponse(BaseModel):
    id: str
    type: str
    amount: float
    category_id: str
    note: Optional[str] = None
    transaction_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("")
def list_transactions(
    type: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 30,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    query = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.is_deleted == False
    )
    if type:
        query = query.filter(Transaction.type == type)
    if search:
        query = query.filter(Transaction.note.ilike(f"%{search}%"))
    total = query.count()
    items = query.order_by(Transaction.transaction_at.desc()).offset((page-1)*limit).limit(limit).all()
    return {"data": items, "meta": {"total": total, "page": page, "limit": limit}}

@router.post("", status_code=201)
def create_transaction(
    payload: TransactionCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Tutar 0'dan buyuk olmali.")
    tx = Transaction(
        id=str(uuid.uuid4()),
        user_id=user_id,
        type=payload.type,
        amount=payload.amount,
        category_id=payload.category_id,
        note=payload.note,
        transaction_at=payload.transaction_at,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

@router.delete("/{tx_id}")
def delete_transaction(
    tx_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    tx = db.query(Transaction).filter(
        Transaction.id == tx_id,
        Transaction.user_id == user_id,
    ).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Islem bulunamadi.")
    tx.is_deleted = True
    db.commit()
    return {"success": True}