from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum


class StatusEnum(str, enum.Enum):
    compliant = "compliant"
    partial = "partial"
    non_compliant = "non-compliant"
    not_evaluated = "not-evaluated"


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


class ADESRisk(Base):
    __tablename__ = "ades_risks"

    id = Column(Integer, primary_key=True, index=True)
    risk_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    severity = Column(String, nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String, nullable=False, default="open")  # open, resolved
    linked_controls = Column(String)  # Comma-separated list
    source = Column(String)  # ADES, ANSSI, ISO27001, etc.
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


class Vulnerability(Base):
    __tablename__ = "vulnerabilities"

    id = Column(String, primary_key=True, index=True)  # VULN-001, VULN-002, etc.
    name = Column(String, nullable=False)
    description = Column(Text)
    criticality = Column(String, nullable=False)  # critical, high, medium, base
    status = Column(String, nullable=False, default="active")  # active, resolved
    cvss_score = Column(String, nullable=False)  # CVSS score as string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(String, primary_key=True, index=True)  # SCAN-001, SCAN-002, etc.
    tool = Column(String, nullable=False)
    ip_address = Column(String, nullable=False)
    network = Column(String, nullable=False)
    status = Column(String, nullable=False, default="running")  # running, completed, failed
    vulnerabilities_found = Column(Integer, default=0)
    scan_date = Column(DateTime(timezone=True), server_default=func.now())
