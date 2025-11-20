from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import AuditHistory, User
from app.schemas import HistoryResponse
from app.routers.auth import get_current_admin

router = APIRouter()


@router.get("/history", response_model=dict)
def get_history(limit: int = 50, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Récupère l'historique des modifications récentes"""
    history = db.query(AuditHistory).order_by(AuditHistory.timestamp.desc()).limit(limit).all()
    
    formatted_history = []
    for entry in history:
        formatted_history.append({
            "controlId": entry.control_id,
            "action": entry.action,
            "oldStatus": entry.old_status,
            "newStatus": entry.new_status,
            "user": entry.user,
            "notes": entry.notes,
            "timestamp": entry.timestamp
        })
    
    return {"history": formatted_history}


@router.get("/history/{control_id}", response_model=dict)
def get_control_history(control_id: str, db: Session = Depends(get_db)):
    """Récupère l'historique d'un contrôle spécifique"""
    history = db.query(AuditHistory).filter(
        AuditHistory.control_id == control_id
    ).order_by(AuditHistory.timestamp.desc()).all()
    
    formatted_history = []
    for entry in history:
        formatted_history.append({
            "controlId": entry.control_id,
            "action": entry.action,
            "oldStatus": entry.old_status,
            "newStatus": entry.new_status,
            "user": entry.user,
            "notes": entry.notes,
            "timestamp": entry.timestamp
        })
    
    return {"history": formatted_history}
