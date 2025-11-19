from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ADESRisk
from app.schemas import RiskStatusUpdate

router = APIRouter()


@router.get("/risks")
def get_risks(db: Session = Depends(get_db)):
    """Récupère tous les risques ADES"""
    risks = db.query(ADESRisk).all()
    
    formatted_risks = []
    for risk in risks:
        formatted_risks.append({
            "id": risk.risk_id,
            "title": risk.title,
            "description": risk.description,
            "severity": risk.severity,
            "status": risk.status,
            "linkedControls": risk.linked_controls.split(",") if risk.linked_controls else [],
            "source": risk.source
        })
    
    return {"risks": formatted_risks}


@router.get("/risks/{risk_id}")
def get_risk(risk_id: str, db: Session = Depends(get_db)):
    """Récupère un risque spécifique"""
    risk = db.query(ADESRisk).filter(ADESRisk.risk_id == risk_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risque non trouvé")
    
    return {
        "id": risk.risk_id,
        "title": risk.title,
        "description": risk.description,
        "severity": risk.severity,
        "status": risk.status,
        "linkedControls": risk.linked_controls.split(",") if risk.linked_controls else [],
        "source": risk.source
    }


@router.put("/risks/{risk_id}/status")
def update_risk_status(risk_id: str, status_update: RiskStatusUpdate, db: Session = Depends(get_db)):
    """Met à jour le statut d'un risque"""
    risk = db.query(ADESRisk).filter(ADESRisk.risk_id == risk_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risque non trouvé")
    
    risk.status = status_update.status
    db.commit()
    db.refresh(risk)
    
    return {
        "id": risk.risk_id,
        "title": risk.title,
        "status": risk.status
    }
