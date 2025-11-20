from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import AuditResult, AuditHistory, User
from app.schemas import AuditResultCreate, AuditResultUpdate, AuditResultResponse, StatisticsResponse
from app.routers.auth import get_current_admin

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
def create_audit_result(audit: AuditResultCreate, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
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
def update_audit_result(control_id: str, audit: AuditResultUpdate, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
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
def delete_audit_result(control_id: str, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
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


@router.get("/statistics", response_model=StatisticsResponse)
def get_statistics(db: Session = Depends(get_db)):
    """Récupère les statistiques globales des contrôles"""
    results = db.query(AuditResult).all()
    
    total = len(results)
    compliant = len([r for r in results if r.status == "compliant"])
    partial = len([r for r in results if r.status == "partial"])
    non_compliant = len([r for r in results if r.status == "non-compliant"])
    not_evaluated = len([r for r in results if r.status == "not-evaluated" or not r.status])
    
    # Calculate compliance score (compliant + partial/2) / total * 100
    compliance_score = 0.0
    if total > 0:
        score = compliant + (partial * 0.5)
        compliance_score = round((score / total) * 100, 1)
    
    # Group by category
    categories = {}
    for result in results:
        cat = result.category
        if cat not in categories:
            categories[cat] = {"total": 0, "compliant": 0, "partial": 0, "nonCompliant": 0, "notEvaluated": 0}
        categories[cat]["total"] += 1
        
        if result.status == "compliant":
            categories[cat]["compliant"] += 1
        elif result.status == "partial":
            categories[cat]["partial"] += 1
        elif result.status == "non-compliant":
            categories[cat]["nonCompliant"] += 1
        else:
            categories[cat]["notEvaluated"] += 1
    
    by_category = []
    for cat_name, cat_stats in categories.items():
        cat_total = cat_stats["total"]
        cat_score = 0.0
        if cat_total > 0:
            cat_score = round((cat_stats["compliant"] + cat_stats["partial"] * 0.5) / cat_total * 100, 1)
        
        by_category.append({
            "category": cat_name,
            "total": cat_total,
            "compliant": cat_stats["compliant"],
            "partial": cat_stats["partial"],
            "nonCompliant": cat_stats["nonCompliant"],
            "notEvaluated": cat_stats["notEvaluated"],
            "complianceScore": cat_score
        })
    
    return {
        "total": total,
        "compliant": compliant,
        "partial": partial,
        "nonCompliant": non_compliant,
        "notEvaluated": not_evaluated,
        "complianceScore": compliance_score,
        "byCategory": by_category
    }
