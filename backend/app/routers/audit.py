from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import AuditResult, AuditHistory
from app.schemas import AuditResultCreate, AuditResultUpdate, AuditResultResponse

router = APIRouter()


@router.get("/audit-results", response_model=dict)
def get_audit_results(db: Session = Depends(get_db)):
    """Récupère tous les résultats d'audit"""
    results = db.query(AuditResult).order_by(AuditResult.control_id).all()
    
    formatted_results = []
    for result in results:
        formatted_results.append({
            "controlId": result.control_id,
            "controlName": result.control_name,
            "category": result.category,
            "status": result.status,
            "evaluationDate": result.evaluation_date,
            "evaluatedBy": result.evaluated_by,
            "evidence": result.evidence,
            "notes": result.notes,
            "linkedRisks": result.linked_risks.split(",") if result.linked_risks else []
        })
    
    return {"results": formatted_results}


@router.get("/audit-results/{control_id}", response_model=AuditResultResponse)
def get_audit_result(control_id: str, db: Session = Depends(get_db)):
    """Récupère un résultat d'audit spécifique"""
    result = db.query(AuditResult).filter(AuditResult.control_id == control_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Résultat non trouvé")
    
    return {
        "controlId": result.control_id,
        "controlName": result.control_name,
        "category": result.category,
        "status": result.status,
        "evaluationDate": result.evaluation_date,
        "evaluatedBy": result.evaluated_by,
        "evidence": result.evidence,
        "notes": result.notes,
        "linkedRisks": result.linked_risks.split(",") if result.linked_risks else []
    }


@router.post("/audit-results", response_model=AuditResultResponse, status_code=201)
def create_audit_result(audit: AuditResultCreate, db: Session = Depends(get_db)):
    """Crée un nouveau résultat d'audit"""
    # Check if already exists
    existing = db.query(AuditResult).filter(AuditResult.control_id == audit.controlId).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce contrôle a déjà été évalué")
    
    db_audit = AuditResult(
        control_id=audit.controlId,
        control_name=audit.controlName,
        category=audit.category,
        status=audit.status,
        evaluation_date=audit.evaluationDate,
        evaluated_by=audit.evaluatedBy,
        evidence=audit.evidence,
        notes=audit.notes,
        linked_risks=",".join(audit.linkedRisks) if audit.linkedRisks else None
    )
    
    db.add(db_audit)
    
    # Add to history
    history_entry = AuditHistory(
        control_id=audit.controlId,
        action="created",
        new_status=audit.status,
        user=audit.evaluatedBy or "Unknown",
        notes="Évaluation initiale"
    )
    db.add(history_entry)
    
    db.commit()
    db.refresh(db_audit)
    
    return audit


@router.put("/audit-results/{control_id}", response_model=AuditResultResponse)
def update_audit_result(control_id: str, audit: AuditResultUpdate, db: Session = Depends(get_db)):
    """Met à jour un résultat d'audit"""
    db_audit = db.query(AuditResult).filter(AuditResult.control_id == control_id).first()
    if not db_audit:
        raise HTTPException(status_code=404, detail="Résultat non trouvé")
    
    old_status = db_audit.status
    
    # Update fields
    db_audit.control_name = audit.controlName
    db_audit.category = audit.category
    db_audit.status = audit.status
    db_audit.evaluation_date = audit.evaluationDate
    db_audit.evaluated_by = audit.evaluatedBy
    db_audit.evidence = audit.evidence
    db_audit.notes = audit.notes
    db_audit.linked_risks = ",".join(audit.linkedRisks) if audit.linkedRisks else None
    
    # Add to history if status changed
    if old_status != audit.status:
        history_entry = AuditHistory(
            control_id=control_id,
            action="status_changed",
            old_status=old_status,
            new_status=audit.status,
            user=audit.evaluatedBy or "Unknown",
            notes=audit.notes
        )
        db.add(history_entry)
    
    db.commit()
    db.refresh(db_audit)
    
    return audit


@router.delete("/audit-results/{control_id}")
def delete_audit_result(control_id: str, db: Session = Depends(get_db)):
    """Supprime un résultat d'audit"""
    db_audit = db.query(AuditResult).filter(AuditResult.control_id == control_id).first()
    if not db_audit:
        raise HTTPException(status_code=404, detail="Résultat non trouvé")
    
    # Add to history
    history_entry = AuditHistory(
        control_id=control_id,
        action="deleted",
        old_status=db_audit.status,
        user="System",
        notes="Résultat supprimé"
    )
    db.add(history_entry)
    
    db.delete(db_audit)
    db.commit()
    
    return {"message": "Résultat supprimé avec succès"}
