# Audit ADES - ISO 27001:2022 Controls Management System

Application moderne de gestion des contrôles de conformité ISO 27001:2022 pour ADES Solaire Madagascar avec système d'authentification complet.

![Version](https://img.shields.io/badge/version-2.2.0-blue)
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

### 🔐 Système d'Authentification

- **Authentification JWT** avec tokens sécurisés
- **Gestion des utilisateurs** : CRUD complet des comptes utilisateur
- **Rôles et permissions** : Système de rôles pour contrôle d'accès
- **Connexion sécurisée** avec validation côté client et serveur
- **Gestion de profil** : Modification du mot de passe et informations personnelles
- **Interface de connexion animée** avec design responsive moderne

### 🎯 Gestion des Contrôles ISO 27001

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

### 📊 Statistiques et Rapports

- **Tableaux de bord** avec métriques en temps réel
- **Graphiques interactifs** (Chart.js, Recharts)
- **Statistiques par catégorie** et priorité
- **Rapports d'avancement** de conformité
- **Métriques de progression** globale

### 🎨 Interface Moderne

- **shadcn/ui** - Composants UI professionnels
- **Tailwind CSS** - Design responsive et moderne
- **Toast Notifications** - Feedback utilisateur élégant (Sonner)
- **Couleurs de marque** : Vert (#4B8B32), Bleu (#2196F3), Teal (#009688)
- **Animations fluides** - Transitions et effets visuels (Framer Motion)
- **Design responsive** - Optimisé pour mobile et desktop
- **Navigation mobile** avec menu hamburger
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
| **Framer Motion** | 12.23.24 | Animations et transitions |
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

```bash
scout/
├── frontend/                    # Application React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Page de connexion
│   │   │   ├── Controls.jsx    # Gestion contrôles
│   │   │   ├── Profile.jsx     # Profil utilisateur
│   │   │   ├── UserManagement.jsx # Gestion utilisateurs
│   │   │   ├── History.jsx     # Historique
│   │   │   └── Risks.jsx       # Gestion des risques
│   │   ├── services/
│   │   │   └── api.js          # Client API Axios
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx # Contexte d'authentification
│   │   ├── data/
│   │   │   └── controls.js     # Référentiel ISO 27001
│   │   └── lib/
│   │       └── utils.js        # Utilitaires
│   ├── Dockerfile              # Container frontend
│   ├── nginx.conf              # Config Nginx
│   └── package.json
│
├── backend/                     # API FastAPI
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py         # Routes authentification
│   │   │   ├── risks.py        # Routes risques
│   │   │   ├── statistics.py   # Routes statistiques
│   │   │   ├── history.py      # Routes historique
│   │   │   └── audit.py        # Routes audit
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
├── docker-compose.override.yml  # Dev overrides
├── docker-compose.prod.yml      # Prod setup
├── README.md                    # Documentation
└── DEPLOYMENT.md                # Guide déploiement
```

## 🔌 API Endpoints

### 🔐 Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/login` | Connexion utilisateur |
| `POST` | `/api/auth/logout` | Déconnexion utilisateur |
| `GET` | `/api/auth/me` | Informations utilisateur actuel |
| `PUT` | `/api/auth/profile` | Mettre à jour le profil |
| `PUT` | `/api/auth/change-password` | Changer le mot de passe |

### 👥 Gestion des Utilisateurs (Admin)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/users` | Liste tous les utilisateurs |
| `GET` | `/api/users/{user_id}` | Détails d'un utilisateur |
| `POST` | `/api/users` | Créer un nouvel utilisateur |
| `PUT` | `/api/users/{user_id}` | Mettre à jour un utilisateur |
| `DELETE` | `/api/users/{user_id}` | Supprimer un utilisateur |

### 🎯 Contrôles ISO 27001

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/controls` | Liste tous les contrôles |
| `GET` | `/api/controls/{control_id}` | Détails d'un contrôle |
| `POST` | `/api/controls` | Créer un contrôle |
| `PUT` | `/api/controls/{control_id}` | Mettre à jour un contrôle |
| `DELETE` | `/api/controls/{control_id}` | Supprimer un contrôle |
| `POST` | `/api/controls/bulk-delete` | Suppression en masse |

### 📊 Statistiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/statistics` | Statistiques globales |
| `GET` | `/api/statistics/dashboard` | Données du tableau de bord |

### 📜 Historique

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/history` | Historique complet |
| `GET` | `/api/history/{control_id}` | Historique d'un contrôle |

### 🏥 Monitoring

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/health` | Health check |

**Documentation Interactive** : <http://localhost:8888/docs>

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

- `users` - Comptes utilisateurs et authentification
- `controls` - Contrôles ISO 27001 et évaluations
- `history` - Historique des modifications et traçabilité

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

**Version** : 2.2.0  
**Dernière mise à jour** : Novembre 2025  
**Statut** : ✅ Production Ready avec Authentification
