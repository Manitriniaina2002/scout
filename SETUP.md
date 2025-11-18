# Scout - Monitoring d'Infrastructure IoT

Plateforme de monitoring intelligent avec détection d'anomalies IA et interface moderne Tailwind CSS.

## 🚀 Installation Rapide

### Prérequis
- Python 3.11+
- Node.js 18+ (pour Tailwind CSS)
- PostgreSQL (ou SQLite pour dev)

### Installation

1. **Cloner le projet**
```bash
git clone https://github.com/Manitriniaina2002/scout.git
cd scout
```

2. **Installer les dépendances Python**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

3. **Installer Tailwind CSS**
```bash
npm install
```

4. **Compiler Tailwind CSS**
```bash
# Development (avec watch)
npm run dev

# Production (minifié)
npm run build
```

5. **Configurer Django**
```bash
# Créer la base de données
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Collecter les fichiers statiques
python manage.py collectstatic
```

6. **Lancer le serveur**
```bash
python manage.py runserver
```

Accéder à l'application : http://localhost:8000

## 🎨 Design avec Tailwind CSS

### Composants Modernes

L'interface utilise Tailwind CSS 3.4 pour un design moderne et responsive :

- **Dashboard** : Cartes statistiques avec gradients et animations
- **Alertes** : Système d'alertes colorées avec badges intelligents
- **Métriques** : Graphiques interactifs avec Chart.js
- **Rapports** : Générateur de rapports PDF/CSV

### Personnalisation

Modifier `tailwind.config.js` pour personnaliser :
- Couleurs du thème
- Polices personnalisées
- Composants réutilisables

### Classes Personnalisées

```css
.card - Carte blanche avec ombre
.btn-primary - Bouton principal bleu
.badge-success - Badge vert de succès
.stat-card - Carte de statistique avec gradient
```

## 🏗️ Structure du Projet

```
scout/
├── monitoring/              # Application Django principale
│   ├── templates/          # Templates HTML avec Tailwind
│   │   ├── base.html       # Template de base
│   │   ├── dashboard.html  # Tableau de bord
│   │   ├── alerts.html     # Gestion alertes
│   │   ├── metrics.html    # Métriques
│   │   └── reports.html    # Rapports
│   ├── static/
│   │   ├── css/
│   │   │   ├── input.css   # CSS source Tailwind
│   │   │   └── output.css  # CSS compilé (généré)
│   │   └── js/
│   ├── collectors/         # Collecteurs de données
│   ├── ai/                 # Modules IA/ML
│   └── management/         # Commandes Django
├── package.json            # Dépendances Node.js
├── tailwind.config.js      # Configuration Tailwind
└── requirements.txt        # Dépendances Python
```

## 🤖 Fonctionnalités IA

- **Détection d'anomalies** : IsolationForest (scikit-learn)
- **Analyse contextuelle** : Intégration Claude/Gemini (optionnel)
- **Priorisation intelligente** : Classification automatique des alertes
- **Recommandations** : Suggestions d'actions correctives

## 📊 Collecte de Données

```bash
# Collecte manuelle
python manage.py collect_metrics

# Entraîner le modèle ML
python manage.py train_ml_model

# Analyser les alertes
python manage.py analyze_alerts
```

## 🐳 Déploiement Docker

```bash
# Build et lancer
docker-compose up -d

# Voir les logs
docker-compose logs -f web

# Arrêter
docker-compose down
```

## 🎯 Tech Stack

**Backend:**
- Django 5.0
- scikit-learn (ML)
- Celery (tâches asynchrones)
- PostgreSQL

**Frontend:**
- Tailwind CSS 3.4
- Alpine.js (interactivité)
- Chart.js (graphiques)
- Google Fonts (Inter, JetBrains Mono)

## 📝 Commandes Utiles

```bash
# Développement Tailwind (watch mode)
npm run dev

# Build production Tailwind
npm run build

# Lancer serveur Django
python manage.py runserver

# Migrations
python manage.py makemigrations
python manage.py migrate

# Tests
python manage.py test
```

## 🔐 Configuration

Créer un fichier `.env` :

```env
SECRET_KEY=votre_clé_secrète
DEBUG=True
DATABASE_URL=postgresql://user:pass@localhost:5432/scout
REDIS_URL=redis://localhost:6379
```

## 📄 Licence

MIT License

## 👥 Auteurs

- Manitriniaina2002

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir CONTRIBUTING.md

---

**Made with ❤️ and Tailwind CSS**
