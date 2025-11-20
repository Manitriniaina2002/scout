from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import audit, history, auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SMSI - Audit ADES API",
    version="3.0.0",
    description="API REST pour l'application d'audit SMSI - ADES",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development frontend
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:80",    # Production frontend (nginx)
        "http://127.0.0.1:80",
        "*",  # Allow all origins for development (restrict in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(audit.router, prefix="/api", tags=["audit"])
app.include_router(history.router, prefix="/api", tags=["history"])


@app.get("/")
def root():
    return {
        "name": "SMSI - Audit ADES API",
        "version": "3.0.0",
        "database": "SQLite with SQLAlchemy",
        "framework": "FastAPI",
        "endpoints": {
            "GET /api/audit-results": "Liste tous les résultats d'audit",
            "POST /api/audit-results": "Créer un nouveau résultat",
            "GET /api/audit-results/{control_id}": "Obtenir un résultat spécifique",
            "PUT /api/audit-results/{control_id}": "Mettre à jour un résultat",
            "DELETE /api/audit-results/{control_id}": "Supprimer un résultat",
            "GET /api/statistics": "Statistiques globales",
            "GET /api/risks": "Liste tous les risques ADES",
            "GET /api/risks/{risk_id}": "Obtenir un risque spécifique",
            "PUT /api/risks/{risk_id}/status": "Mettre à jour le statut d'un risque",
            "GET /api/history": "Historique des modifications",
            "GET /api/history/{control_id}": "Historique d'un contrôle",
            "GET /api/vulnerabilities": "Liste toutes les vulnérabilités",
            "GET /api/vulnerabilities/statistics": "Statistiques des vulnérabilités",
            "GET /api/scan-history": "Historique des scans",
            "POST /api/scan-history": "Créer un nouveau scan",
            "PUT /api/scan-history/{scan_id}/status": "Mettre à jour le statut d'un scan",
            "GET /api/health": "État de santé de l'API",
        },
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
