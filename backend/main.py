from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import audit, risks, statistics, history

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Audit ADES - ISO 27001 API",
    version="2.0.0",
    description="API REST pour l'application d'audit ISO 27001 - ADES",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(audit.router, prefix="/api", tags=["audit"])
app.include_router(risks.router, prefix="/api", tags=["risks"])
app.include_router(statistics.router, prefix="/api", tags=["statistics"])
app.include_router(history.router, prefix="/api", tags=["history"])


@app.get("/")
def root():
    return {
        "name": "Audit ADES - ISO 27001 API",
        "version": "2.0.0",
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
            "GET /api/health": "État de santé de l'API",
        },
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
