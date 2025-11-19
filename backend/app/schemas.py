from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


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


class RiskBase(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    severity: str
    status: str
    linkedControls: Optional[List[str]] = []
    source: Optional[str] = None


class RiskResponse(RiskBase):
    class Config:
        from_attributes = True


class RiskStatusUpdate(BaseModel):
    status: str


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
