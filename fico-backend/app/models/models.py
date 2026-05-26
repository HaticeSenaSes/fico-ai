from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False)
    email_verified_at = Column(DateTime(timezone=True), nullable=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    university = Column(String(150), nullable=True)
    city = Column(String(100), nullable=True)
    study_year = Column(Integer, nullable=True)
    currency_code = Column(String(3), default="TRY")
    role = Column(String(20), default="user")
    onboarding_completed_at = Column(DateTime(timezone=True), nullable=True)
    kvkk_accepted_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    transactions = relationship("Transaction", back_populates="user")
    goals = relationship("Goal", back_populates="user")
    insights = relationship("AIInsight", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String(100), nullable=False)
    icon = Column(String(50), nullable=False)
    color = Column(String(7), nullable=True)
    is_system = Column(Boolean, default=False)
    is_hidden = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String(10), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    currency_code = Column(String(3), default="TRY")
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    note = Column(String(100), nullable=True)
    receipt_url = Column(String(500), nullable=True)
    transaction_at = Column(DateTime(timezone=True), nullable=False)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user = relationship("User", back_populates="transactions")
    category = relationship("Category")

class Goal(Base):
    __tablename__ = "goals"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    goal_type = Column(String(30), nullable=False)
    target_amount = Column(Numeric(12, 2), nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=True)
    period_type = Column(String(20), nullable=False)
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="goals")

class AIInsight(Base):
    __tablename__ = "ai_insights"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    insight_type = Column(String(30), nullable=False)
    title = Column(String(150), nullable=False)
    body = Column(Text, nullable=False)
    rule_data = Column(Text, nullable=True)
    is_positive_feedback = Column(Boolean, nullable=True)
    shown_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="insights")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String(30), nullable=False)
    title = Column(String(150), nullable=False)
    body = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="notifications")

class IncomeSource(Base):
    __tablename__ = "income_sources"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    source_type = Column(String(30), nullable=False)
    default_amount = Column(Numeric(12, 2), nullable=True)
    frequency = Column(String(20), default="monthly")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())