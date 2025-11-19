# 🚀 Guide de Démarrage Rapide

## Démarrage en 5 minutes

### 1️⃣ Prérequis
- ✅ Node.js 18+ installé
- ✅ Python 3.9+ installé
- ✅ Terminal PowerShell

### 2️⃣ Installation Backend

```powershell
# Naviguer vers le backend
cd backend

# Créer et activer l'environnement virtuel
python -m venv venv
.\venv\Scripts\Activate.ps1

# Installer les dépendances
pip install -r requirements.txt
```

### 3️⃣ Installation Frontend

Ouvrir un **nouveau terminal** :

```powershell
# Naviguer vers le frontend
cd frontend

# Installer les dépendances
npm install
```

### 4️⃣ Démarrer l'Application

**Terminal 1 - Backend :**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```

**Terminal 2 - Frontend :**
```powershell
cd frontend
npm run dev
```

### 5️⃣ Accéder à l'Application

- 🌐 **Application** : http://localhost:3000
- 📚 **API Docs** : http://localhost:8000/docs
- 🔧 **API** : http://localhost:8000

## 🎯 Première Utilisation

1. Ouvrez http://localhost:3000
2. Naviguez vers "Contrôles ISO 27001"
3. Cliquez sur "Modifier" pour évaluer un contrôle
4. Remplissez le formulaire et enregistrez
5. Consultez le dashboard pour voir les statistiques

## 🛠️ Commandes Utiles

### Backend
```powershell
# Démarrer le serveur de développement
python main.py

# Accéder au shell Python avec l'environnement
python

# Vérifier les dépendances
pip list
```

### Frontend
```powershell
# Démarrer en mode développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint
```

## 📊 Données de Test

L'application se connecte à la base de données SQLite dans `data/audit.db`. 
Les données existantes seront préservées lors de la migration.

## 🐛 Résolution de Problèmes

### Le backend ne démarre pas
- Vérifiez que Python 3.9+ est installé : `python --version`
- Vérifiez que l'environnement virtuel est activé
- Réinstallez les dépendances : `pip install -r requirements.txt`

### Le frontend ne démarre pas
- Vérifiez que Node.js est installé : `node --version`
- Supprimez `node_modules` et réinstallez : `rm -r node_modules; npm install`

### Erreur CORS
- Vérifiez que le backend tourne sur le port 8000
- Vérifiez la configuration CORS dans `backend-fastapi/main.py`

### La base de données est vide
- Le backend crée automatiquement les tables au démarrage
- Utilisez l'interface pour ajouter des évaluations

## 📖 Documentation Complète

Voir [README-NEW.md](./README-NEW.md) pour plus d'informations.

## 🎨 Technologies Utilisées

- **Frontend**: React 18 + Vite + React Router + Chart.js
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Style**: CSS3 avec variables CSS

## 🔄 Migration depuis l'Ancienne Version

Les données de l'ancienne version (JSON/Flask) peuvent être importées :
1. Les résultats d'audit sont dans `data/audit-results.json`
2. Utilisez l'API POST pour importer les données
3. Les risques ADES doivent être ajoutés manuellement via l'API

---

**Besoin d'aide ?** Consultez la documentation complète ou contactez l'équipe de développement.
