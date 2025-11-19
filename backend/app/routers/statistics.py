from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditResult

router = APIRouter()


@router.get("/statistics")
def get_statistics(db: Session = Depends(get_db)):
    """Récupère les statistiques globales de l'audit"""
    results = db.query(AuditResult).all()
    
    total = len(results)
    compliant = len([r for r in results if r.status == "compliant"])
    partial = len([r for r in results if r.status == "partial"])
    non_compliant = len([r for r in results if r.status == "non-compliant"])
    not_evaluated = len([r for r in results if r.status == "not-evaluated"])
    
    # Calculate compliance score
    if total > 0:
        compliance_score = round(((compliant + (partial * 0.5)) / total) * 100, 1)
    else:
        compliance_score = 0.0
    
    # Statistics by category
    categories = {}
    for result in results:
        cat = result.category
        if cat not in categories:
            categories[cat] = {"compliant": 0, "partial": 0, "nonCompliant": 0, "notEvaluated": 0}
        
        if result.status == "compliant":
            categories[cat]["compliant"] += 1
        elif result.status == "partial":
            categories[cat]["partial"] += 1
        elif result.status == "non-compliant":
            categories[cat]["nonCompliant"] += 1
        else:
            categories[cat]["notEvaluated"] += 1
    
    by_category = [
        {"category": cat, **stats}
        for cat, stats in categories.items()
    ]
    
    return {
        "total": total,
        "compliant": compliant,
        "partial": partial,
        "nonCompliant": non_compliant,
        "notEvaluated": not_evaluated,
        "complianceScore": compliance_score,
        "byCategory": by_category
    }
