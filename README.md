# Audit ADES - ISO 27001:2022 & Vulnerability Scanner

Application moderne d'audit de conformité ISO 27001:2022 et de scan de vulnérabilités pour ADES Solaire Madagascar.

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Docker](https://img.shields.io/badge/docker-ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Démarrage Rapide

### Docker Compose (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/Manitriniaina2002/scout.git
cd scout

# Démarrer l'application
docker-compose up -d

# Accéder à l'application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8888
# API Docs: http://localhost:8888/docs
```

### Démarrage Manuel

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/init_db.py
uvicorn main:app --reload --port 8888

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

## 📚 Documentation

- **[Guide Docker Complet](./README.Docker.md)** - Documentation Docker détaillée
- **[Guide de Déploiement](./DEPLOYMENT.md)** - Résumé complet du déploiement
- **[Mapping des Risques](./RISK-MAPPING.md)** - Analyse des risques ADES

## ✨ Fonctionnalités

### 🔍 Scan de Vulnérabilités

- **Outils intégrés** : Nmap, Nikto, WPScan, SSLScan
- **Scans automatisés** en arrière-plan
- **Rapports détaillés** avec sévérité (Critical, High, Medium, Low)
- **Historique des scans** avec traçabilité
- **Support multi-protocoles** : TCP, HTTP, HTTPS, SSL/TLS
- **Analyse de services** : Détection des ports ouverts et vulnérabilités connues

### 🎯 Gestion des Contrôles ISO 27001

- **93 contrôles de l'Annexe A** avec évaluation complète
- **93 contrôles de l'Annexe A** avec évaluation complète
- **CRUD complet** : Créer, Lire, Modifier, Supprimer
- **Édition en ligne** avec formulaires shadcn/ui
- **Opérations en masse** : sélection multiple, suppression en masse
- **Filtrage avancé** : par catégorie, statut, recherche textuelle
- **Import/Export JSON** pour sauvegarde et partage
- **Upload de preuves** avec interface drag & drop
- **Champs détaillés** :
  - Priorité (Faible, Moyenne, Haute, Critique)
  - Responsable de mise en œuvre
  - Coût d'implémentation
- **Timeline de réalisation**
  - Notes et observations
  - Preuves de conformité

### 📜 Historique et Traçabilité

- Traçabilité complète de toutes les modifications
- Timeline des changements
- Attribution des actions aux utilisateurs
- Historique par contrôle ou global

### 🎨 Interface Moderne

- **shadcn/ui** - Composants UI professionnels
- **Tailwind CSS** - Design responsive et moderne
- **Toast Notifications** - Feedback utilisateur élégant (Sonner)
- **Couleurs de marque** : Vert (#4B8B32), Bleu (#2196F3), Teal (#009688)
- **Animations fluides** - Transitions et effets visuels
- **Mode sombre compatible** (prêt pour implémentation)

## 🛠️ Stack Technique

### Frontend

| Technologie | Version | Utilisation |
|------------|---------|-------------|
| **React** | 18.2.0 | Framework UI |
| **Vite** | 5.0.8 | Build tool moderne |
| **React Router** | 6.20.0 | Navigation SPA |
| **shadcn/ui** | Latest | Composants UI |
| **Tailwind CSS** | 3.4.18 | Styling |
| **Sonner** | 2.0.7 | Toast notifications |
| **Lucide React** | 0.554.0 | Icônes |
| **Chart.js** | 4.4.0 | Graphiques |
| **Recharts** | 3.4.1 | Graphiques React |
| **Axios** | 1.6.2 | Client HTTP |

### Backend

| Technologie | Version | Utilisation |
|------------|---------|-------------|
| **FastAPI** | 0.104.1+ | Framework API |
| **SQLAlchemy** | 2.0.23+ | ORM |
| **Pydantic** | 2.5.2+ | Validation |
| **Uvicorn** | 0.24.0+ | Serveur ASGI |
| **SQLite** | 3 | Base de données |

### DevOps

- **Docker** & **Docker Compose** - Containerisation
- **Nginx** - Reverse proxy (production)
- **Git** - Contrôle de version

## 📁 Structure du Projet

```
audit-ades-iso27001/
├── frontend/                    # Application React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Controls.jsx    # Gestion contrôles
│   │   │   └── History.jsx     # Historique
│   │   ├── services/
│   │   │   ├── api.js          # Client API Axios
│   │   │   └── localStorage.js # Fallback local
│   │   └── data/
│   │       └── controls.js     # Référentiel ISO 27001
│   ├── Dockerfile              # Container frontend
│   ├── nginx.conf              # Config Nginx
│   └── package.json
│
├── backend/                     # API FastAPI
│   ├── app/
│   │   ├── routers/
│   │   │   ├── audit.py        # Routes audit
│   │   │   ├── risks.py        # Routes risques
│   │   │   ├── statistics.py  # Routes stats
│   │   │   └── history.py      # Routes historique
│   │   ├── models.py           # Modèles SQLAlchemy
│   │   ├── schemas.py          # Schémas Pydantic
│   │   └── database.py         # Config DB
│   ├── scripts/
│   │   └── init_db.py          # Initialisation DB
│   ├── data/
│   │   └── audit.db            # Base SQLite
│   ├── Dockerfile              # Container backend
│   ├── main.py                 # Point d'entrée
│   └── requirements.txt
│
├── docker-compose.yml           # Dev setup
├── docker-compose.prod.yml      # Prod setup
└── README.md
```

## 🔌 API Endpoints

### Scan de Vulnérabilités

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/vulnerabilities` | Liste toutes les vulnérabilités |
| `GET` | `/api/vulnerabilities/statistics` | Statistiques des vulnérabilités |
| `GET` | `/api/scan-history` | Historique des scans |
| `POST` | `/api/scan-history` | Lancer un nouveau scan |
| `GET` | `/api/scan-history/{scan_id}` | Détails d'un scan |
| `GET` | `/api/tools/availability` | Disponibilité des outils de scan |

### Audit Results

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/audit-results` | Liste tous les résultats |
| `GET` | `/api/audit-results/{control_id}` | Détails d'un résultat |
| `POST` | `/api/audit-results` | Créer un résultat |
| `PUT` | `/api/audit-results/{control_id}` | Mettre à jour |
| `DELETE` | `/api/audit-results/{control_id}` | Supprimer |



### Statistics & History

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/statistics` | Statistiques globales |
| `GET` | `/api/history` | Historique complet |
| `GET` | `/api/history/{control_id}` | Historique d'un contrôle |
| `GET` | `/api/health` | Health check |

**Documentation Interactive** : http://localhost:8888/docs

## 🐳 Docker

### Commandes Essentielles

```bash
# Démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Rebuild
docker-compose build --no-cache

# Reset complet
docker-compose down -v
docker-compose up -d --build
```

### Scripts de Démarrage

**Windows** : `docker-start.bat`  
**Linux/Mac** : `./docker-start.sh`

## 🔧 Configuration

### Variables d'Environnement

**Development** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8888
```

**Production** (`frontend/.env.production`):
```env
VITE_API_URL=/api
```

### Ports

- **Frontend** : 3000 (dev) / 80 (prod)
- **Backend** : 8888
- **API Docs** : 8888/docs

## 📊 Base de Données

### Initialisation

```bash
# Avec Docker
docker-compose exec backend python scripts/init_db.py

# Manuel
cd backend
python scripts/init_db.py
```

### Backup

```bash
# Avec Docker
docker cp audit-ades-backend:/app/data/audit.db ./backup.db

# Manuel
cp backend/data/audit.db ./backup-$(date +%Y%m%d).db
```

### Tables

- `audit_results` - Évaluations des contrôles ISO 27001
- `ades_risks` - Risques spécifiques ADES
- `audit_history` - Historique des modifications

## 🚀 Build de Production

### Avec Docker

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Manuel

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8888

# Frontend
cd frontend
npm run build
# Fichiers dans dist/
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est développé pour ADES Solaire Madagascar.

## 👥 Auteurs

Équipe Audit ADES - MANITRINIAINA Tanjona

## 🔗 Liens Utiles

- [ISO 27001:2022 Standard](https://www.iso.org/standard/27001)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker Documentation](https://docs.docker.com/)

---

**Version** : 2.1.0  
**Dernière mise à jour** : Novembre 2025  
**Statut** : ✅ Production Ready
