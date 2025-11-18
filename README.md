# Scout

IoT Security and Anomaly Detection Platform

## Project Structure

- `backend/` - FastAPI backend with ML-powered anomaly detection
- `frontend/` - React frontend with modern UI

## Getting Started

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy
- scikit-learn (IsolationForest)
- PostgreSQL/SQLite

**Frontend:**
- React
- Vite
- Tailwind CSS
- Recharts
