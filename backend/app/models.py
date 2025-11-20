from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum


class StatusEnum(str, enum.Enum):
    compliant = "compliant"
    partial = "partial"
    non_compliant = "non-compliant"
    not_evaluated = "not-evaluated"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="user")  # admin, user
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AuditResult(Base):
    __tablename__ = "audit_results"

    id = Column(Integer, primary_key=True, index=True)
    control_id = Column(String, unique=True, index=True, nullable=False)
    control_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, nullable=False, default="not-evaluated")
    evaluation_date = Column(String)
    evaluated_by = Column(String)
    evidence = Column(Text)
    notes = Column(Text)
    linked_risks = Column(String)  # Comma-separated list
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AuditHistory(Base):
    __tablename__ = "audit_history"

    id = Column(Integer, primary_key=True, index=True)
    control_id = Column(String, index=True, nullable=False)
    action = Column(String, nullable=False)  # created, updated, deleted, status_changed
    old_status = Column(String)
    new_status = Column(String)
    user = Column(String, nullable=False)
    notes = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
