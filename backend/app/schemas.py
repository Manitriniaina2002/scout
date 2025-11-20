from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: str
    role: str = "user"


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: str
    email: str
    password: Optional[str] = None
    role: str = "user"


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class AuditResultBase(BaseModel):
    controlId: str
    controlName: str
    category: str
    status: str
    evaluationDate: Optional[str] = None
    evaluatedBy: Optional[str] = None
    evidence: Optional[str] = None
    notes: Optional[str] = None
    linkedRisks: Optional[List[str]] = []


class AuditResultCreate(AuditResultBase):
    pass


class AuditResultUpdate(AuditResultBase):
    pass


class AuditResultResponse(AuditResultBase):
    class Config:
        from_attributes = True


class HistoryResponse(BaseModel):
    controlId: str
    action: str
    oldStatus: Optional[str] = None
    newStatus: Optional[str] = None
    user: str
    notes: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True


class StatisticsResponse(BaseModel):
    total: int
    compliant: int
    partial: int
    nonCompliant: int
    notEvaluated: int
    complianceScore: float
    byCategory: List[dict]
