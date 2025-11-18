# Conception d'un Workflow de Monitoring Intelligent d'Infrastructure (Django)

## 🏗️ Architecture Django All-in-One

```
┌─────────────────────────────────────────────────────────────────┐
│                    DJANGO APPLICATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────┐             │
│  │  COLLECTEURS (monitoring/collectors/)          │             │
│  │  • NetworkCollector    • FirewallCollector     │             │
│  │  • ServerCollector     • BaseCollector         │             │
│  └────────────────┬───────────────────────────────┘             │
│                   │                                              │
│                   ▼                                              │
│  ┌────────────────────────────────────────────────┐             │
│  │  MODELS (Django ORM)                           │             │
│  │  • Metric  • Alert  • TopConsumer              │             │
│  │  Auto ETL: save() methods transform data       │             │
│  └────────────────┬───────────────────────────────┘             │
│                   │                                              │
│                   ▼                                              │
│  ┌────────────────────────────────────────────────┐             │
│  │  AI ANALYSIS (monitoring/ai/)                  │             │
│  │  • AnomalyDetector (sklearn)                   │             │
│  │  • AlertCorrelation                            │             │
│  │  • IntelligentPrioritizer                      │             │
│  └────────────────┬───────────────────────────────┘             │
│                   │                                              │
│                   ▼                                              │
│  ┌────────────────────────────────────────────────┐             │
│  │  VIEWS (Django Templates + Admin)              │             │
│  │  • Dashboard  • Alerts  • Metrics  • Reports   │             │
│  │  + Built-in Admin Panel                        │             │
│  └────────────────────────────────────────────────┘             │
│                                                                  │
│  ┌────────────────────────────────────────────────┐             │
│  │  BACKGROUND TASKS (Celery/Cron)                │             │
│  │  Management Commands: python manage.py collect │             │
│  └────────────────────────────────────────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                   PostgreSQL / SQLite
```

## 📦 Structure du Projet Django

```text
scout/                           # Django Project Root
├── manage.py
├── requirements.txt
├── README.md
│
├── scout/                       # Project Settings
│   ├── __init__.py
│   ├── settings.py              # Django configuration
│   ├── urls.py                  # Root URL config
│   └── wsgi.py
│
├── monitoring/                  # Main Django App
│   ├── __init__.py
│   ├── apps.py
│   ├── admin.py                 # Django Admin configuration
│   ├── urls.py                  # App URLs
│   │
│   ├── models.py                # Database Models (ORM)
│   │   # Metric, Alert, TopConsumer, etc.
│   │
│   ├── views.py                 # Django Views
│   │   # dashboard(), alerts_view(), metrics_view()
│   │
│   ├── collectors/              # Data Collection
│   │   ├── __init__.py
│   │   ├── base.py              # BaseCollector class
│   │   ├── network.py           # NetworkCollector
│   │   ├── firewall.py          # FirewallCollector
│   │   └── server.py            # ServerCollector
│   │
│   ├── ai/                      # AI & ML Components
│   │   ├── __init__.py
│   │   ├── anomaly_detector.py  # IsolationForest
│   │   ├── alert_engine.py      # Intelligent alerting
│   │   └── correlator.py        # Event correlation
│   │
│   ├── management/              # Django Management Commands
│   │   └── commands/
│   │       ├── collect_metrics.py    # Collecte manuelle
│   │       ├── train_ml_model.py     # Entraîner modèle ML
│   │       └── analyze_alerts.py     # Analyse IA
│   │
│   ├── templates/               # Django HTML Templates
│   │   ├── base.html
│   │   ├── dashboard.html
│   │   ├── alerts.html
│   │   ├── metrics.html
│   │   └── reports.html
│   │
│   ├── static/                  # CSS, JS, Images
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── charts.js        # Chart.js for visualizations
│   │
│   ├── tasks.py                 # Celery Tasks (optional)
│   │
│   └── migrations/              # Database Migrations
│       └── 0001_initial.py
│
├── config/                      # Configuration Files
│   └── collectors.yaml
│
└── tests/                       # Tests
    ├── test_collectors.py
    ├── test_models.py
    └── test_views.py
```

## 🔧 Composants Django - Tout intégré!

Voir le fichier complet avec tous les composants Django sur GitHub.

**Résumé de l'approche:**
- Models Django = Base de données + ETL automatique
- Collectors = Scripts Python standard
- Views Django = Dashboard HTML
- Admin Django = Interface de gestion gratuite
- Management Commands = Scheduled tasks (via cron/Celery)
- AI dans monitoring/ai/ = Détection d'anomalies

**Commandes principales:**
```bash
python manage.py collect_metrics        # Collecte manuelle
python manage.py runserver              # Démarre le serveur
python manage.py createsuperuser        # Créer admin
```

## 🗄️ Schéma de Base de Données Django

**Django gère tout automatiquement via migrations!**

```python
# Déjà défini dans models.py
# Django créé automatiquement:
# - Tables
# - Index
# - Contraintes
# - Relations (ForeignKey, ManyToMany)

# Commandes:
python manage.py makemigrations  # Créé les fichiers de migration
python manage.py migrate         # Applique les migrations
```

**Tables créées automatiquement:**
- `monitoring_metric` - Toutes les métriques
- `monitoring_alert` - Alertes générées
- `monitoring_topconsumer` - Top utilisateurs
- `auth_user` - Utilisateurs (Django built-in)
- `django_session` - Sessions

**Indexes créés automatiquement** par Django grâce à `db_index=True`

## 🚀 Déploiement Django

**Simple - Un seul serveur:**

```bash
# Development
python manage.py runserver

# Production (avec Gunicorn)
pip install gunicorn
gunicorn scout.wsgi:application --bind 0.0.0.0:8000
```

**Avec Docker:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: scout
      POSTGRES_PASSWORD: securepass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    
  web:
    build: .
    command: gunicorn scout.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      DATABASE_URL: postgresql://postgres:securepass@db:5432/scout
      REDIS_URL: redis://redis:6379

  celery:
    build: .
    command: celery -A scout worker -B -l info
    depends_on:
      - db
      - redis
    environment:
      DATABASE_URL: postgresql://postgres:securepass@db:5432/scout
      REDIS_URL: redis://redis:6379

volumes:
  postgres_data:
```

**Dockerfile:**

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python manage.py collectstatic --noinput
CMD ["gunicorn", "scout.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 🎯 Flux de Données Django (Simplifié)

1. **Collecte** (Cron/Celery) → `python manage.py collect_metrics`
2. **Sauvegarde** → Model.save() fait ETL automatiquement
3. **Détection** → Signals Django déclenchent anomaly detection
4. **Alertes** → Créées automatiquement si anomalie
5. **Dashboard** → Views Django servent HTML templates
6. **Admin** → Django Admin pour CRUD gratuit

**Tout en Python, tout en Django!** 🚀

## 🔐 Avantages Django vs FastAPI+React

| Aspect | Django Only | FastAPI + React |
|--------|-------------|-----------------|
| **Setup** | 1 commande | 2 projets séparés |
| **Langages** | Python seulement | Python + JavaScript |
| **Admin** | ✅ Gratuit (built-in) | ❌ À construire |
| **Auth** | ✅ Gratuit (built-in) | ❌ À implémenter |
| **Database** | ✅ ORM Django | SQLAlchemy |
| **Templates** | ✅ Django templates | React components |
| **Courbe apprentissage** | ⭐⭐⭐ (1 framework) | ⭐⭐⭐⭐⭐ (2 frameworks) |
| **Temps développement** | **1-2 semaines** | 3-4 semaines |
| **Maintenance** | Simple | Complexe (2 codebases) |

**Django = Meilleur choix pour MVP et projets internes!**

---

# Agents IA Gratuits pour l'Analyse de Monitoring

Voici les meilleures options **gratuites** classées par cas d'usage :

## 🎯 Option 1 : **Claude API (Anthropic)** - ⭐ Recommandé

**Pourquoi c'est le meilleur choix :**
- Excellent pour l'analyse contextuelle et la corrélation d'événements
- Très bon en raisonnement logique (parfait pour diagnostics)
- Format de sortie structuré fiable (JSON)

**Offre gratuite :**
- **5$ de crédit gratuit** à l'inscription
- ~120,000 tokens avec Claude Sonnet (suffisant pour tester)
- Après : Claude Haiku très économique (~0.25$ par million de tokens)

**Cas d'usage idéal :**

```python
# Exemple d'utilisation
import anthropic
import json

client = anthropic.Anthropic(api_key="votre_clé")

async def analyze_infrastructure_state(metrics, alerts):
    message = client.messages.create(
        model="claude-3-5-haiku-20241022",  # Le plus économique
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""
            Analyse ces métriques d'infrastructure et priorise les alertes:
            
            Métriques actuelles:
            - Débit Internet: {metrics['internet_speed']} Mbps
            - Top consommateurs: {metrics['top_users']}
            - Serveur Windows: CPU {metrics['server_cpu']}%, RAM {metrics['server_ram']}%
            - Temps de réponse: {metrics['response_time']}ms
            
            Alertes détectées:
            {alerts}
            
            Réponds en JSON avec:
            {{
                "severity": "critical|warning|info",
                "priority_alerts": [...],
                "root_cause_analysis": "...",
                "recommendations": [...],
                "false_positives": [...]
            }}
            """
        }]
    )
    
    return json.loads(message.content[0].text)
```

**Estimation coût mensuel :**
- ~1000 analyses/mois avec Haiku : **0.25$ - 1$**
- Production moyenne : **5-10$ /mois**

---

## 🆓 Option 2 : **Ollama (Local)** - Totalement Gratuit

**Modèles recommandés :**
- **Llama 3.2 3B** - Léger, rapide, bon pour analyse simple
- **Mistral 7B** - Meilleur raisonnement, nécessite plus de RAM
- **Phi-3 Mini** - Optimisé Microsoft, excellent compromis

**Avantages :**
- ✅ 100% gratuit, pas de limite d'utilisation
- ✅ Données restent en local (confidentialité)
- ✅ Latence faible si serveur local
- ✅ Pas de dépendance externe

**Inconvénients :**
- ❌ Nécessite serveur avec GPU/CPU correct
- ❌ Qualité d'analyse inférieure aux modèles cloud
- ❌ Nécessite fine-tuning pour cas spécifiques

**Installation et utilisation :**

```bash
# Installation Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Télécharger un modèle
ollama pull llama3.2:3b

# Lancer le serveur
ollama serve
```

```python
# Intégration Python
import requests
import json

def analyze_with_ollama(metrics, alerts):
    prompt = f"""
    Tu es un expert en monitoring d'infrastructure réseau.
    Analyse ces données et génère des alertes intelligentes.
    
    Métriques: {metrics}
    Alertes brutes: {alerts}
    
    Réponds UNIQUEMENT en JSON avec cette structure:
    {{"severity": "...", "analysis": "...", "actions": [...]}}
    """
    
    response = requests.post('http://localhost:11434/api/generate', json={
        'model': 'llama3.2:3b',
        'prompt': prompt,
        'stream': False,
        'format': 'json'  # Force sortie JSON
    })
    
    return json.loads(response.json()['response'])
```

**Configuration matérielle :**
- **Minimum** : 8GB RAM, CPU moderne (Llama 3.2 3B)
- **Recommandé** : 16GB RAM, GPU 8GB VRAM (Mistral 7B)
- **Optimal** : 32GB RAM, GPU 16GB+ (Llama 3.1 70B)

---

## 🧠 Option 3 : **OpenAI API (GPT-4o-mini)** - Quasi-gratuit

**Offre gratuite :**
- **5$ de crédit** à l'inscription (expire après 3 mois)
- GPT-4o-mini : **0.15$ par million de tokens input** (très économique)

**Avantages :**
- ✅ Excellente qualité d'analyse
- ✅ Très rapide
- ✅ API stable et bien documentée
- ✅ Mode JSON natif garanti

**Code exemple :**

```python
from openai import OpenAI
import json

client = OpenAI(api_key="votre_clé")

def analyze_with_gpt(metrics, alerts):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},  # Force JSON
        messages=[
            {"role": "system", "content": "Tu es un expert en monitoring IT. Réponds toujours en JSON."},
            {"role": "user", "content": f"Analyse: {metrics}, Alertes: {alerts}"}
        ]
    )
    
    return json.loads(response.choices[0].message.content)
```

**Coût estimé :**
- 1000 analyses/mois : **0.30$ - 1$**
- Production : **3-8$/mois**

---

## 🔬 Option 4 : **Modèles ML Locaux (Scikit-learn)** - Gratuit

**Pour détection d'anomalies sans LLM :**

```python
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import numpy as np

class AnomalyDetector:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = IsolationForest(
            contamination=0.1,  # 10% d'anomalies attendues
            random_state=42
        )
        self.is_trained = False
    
    def train(self, historical_metrics):
        """Entraîner sur 1-2 semaines de données normales"""
        X = self.scaler.fit_transform(historical_metrics)
        self.model.fit(X)
        self.is_trained = True
    
    def predict(self, current_metrics):
        """Retourne True si anomalie détectée"""
        X = self.scaler.transform([current_metrics])
        prediction = self.model.predict(X)
        score = self.model.score_samples(X)[0]
        
        return {
            "is_anomaly": prediction[0] == -1,
            "anomaly_score": abs(score),  # Plus haut = plus anormal
            "severity": self.get_severity(score)
        }
    
    def get_severity(self, score):
        if score < -0.5:
            return "critical"
        elif score < -0.3:
            return "warning"
        return "info"
```

**Avantages :**
- ✅ 100% gratuit
- ✅ Très rapide (millisecondes)
- ✅ Pas de dépendance externe
- ✅ Explicable mathématiquement

**Inconvénients :**
- ❌ Pas d'analyse contextuelle narrative
- ❌ Nécessite données d'entraînement
- ❌ Pas de recommandations textuelles

---

## 🎁 Option 5 : **Google Gemini Flash** - Gratuit généreux

**Offre gratuite :**
- **1500 requêtes/jour** gratuites (Gemini 1.5 Flash)
- Suffisant pour 60 analyses/heure
- Pas de carte bancaire requise

**Avantages :**
- ✅ Quota quotidien très généreux
- ✅ Gratuit à long terme
- ✅ Bonne qualité d'analyse
- ✅ Contexte long (1M tokens)

```python
import google.generativeai as genai
import json

genai.configure(api_key="votre_clé")
model = genai.GenerativeModel('gemini-1.5-flash')

def analyze_with_gemini(metrics, alerts):
    prompt = f"""
    Analyse ces métriques et génère un rapport JSON:
    Métriques: {metrics}
    Alertes: {alerts}
    
    Format JSON attendu:
    {{"severity": "...", "analysis": "...", "actions": []}}
    """
    
    response = model.generate_content(prompt)
    return json.loads(response.text)
```

**Limites :**
- 1500 requêtes/jour (largement suffisant)
- 32,000 tokens par minute

---

## 📊 Comparatif Final

| Solution | Coût mensuel | Qualité analyse | Latence | Confidentialité | Recommandation |
|----------|--------------|-----------------|---------|-----------------|----------------|
| **Claude Haiku** | 5-10$ | ⭐⭐⭐⭐⭐ | ~1-2s | Cloud | **Meilleur pour production** |
| **Ollama Local** | 0$ | ⭐⭐⭐ | <1s | 100% local | **Meilleur si confidentialité critique** |
| **GPT-4o-mini** | 3-8$ | ⭐⭐⭐⭐⭐ | ~0.5s | Cloud | Excellent alternative |
| **Gemini Flash** | 0$ | ⭐⭐⭐⭐ | ~1s | Cloud | **Meilleur gratuit long-terme** |
| **Scikit-learn** | 0$ | ⭐⭐ | <0.1s | Local | **Complément parfait** |

---

## 🎯 Recommandation : **Architecture Hybride**

```python
class HybridIntelligentAgent:
    def __init__(self):
        # Détection rapide locale
        self.anomaly_detector = IsolationForest()
        
        # Analyse contextuelle (choisir un)
        self.llm = "gemini"  # ou "claude", "ollama"
    
    async def analyze(self, metrics, alerts):
        # 1. Détection rapide d'anomalies (local, gratuit, rapide)
        anomalies = self.anomaly_detector.predict(metrics)
        
        # 2. Si anomalie critique, analyse approfondie avec LLM
        if anomalies['severity'] == 'critical':
            contextual_analysis = await self.llm_analyze(metrics, alerts)
            return self.merge_insights(anomalies, contextual_analysis)
        
        # 3. Sinon, retour rapide sans LLM
        return self.format_simple_alert(anomalies)
    
    async def llm_analyze(self, metrics, alerts):
        # Utilise Gemini Flash (gratuit) ou Claude (payant)
        if self.llm == "gemini":
            return await analyze_with_gemini(metrics, alerts)
        elif self.llm == "ollama":
            return analyze_with_ollama(metrics, alerts)
```

**Avantages de cette approche :**
- **99% des cas** : ML local (gratuit, instantané)
- **1% des cas critiques** : LLM cloud (analyse approfondie)
- **Coût** : <2$/mois avec Gemini gratuit ou ~5$/mois avec Claude
- **Performance** : Latence minimale

---

## 🚀 Pour Démarrer - Conseil

### Phase 1 (Test - Gratuit)

1. Utilisez **Gemini Flash gratuit** (1500 req/jour)
2. Ajoutez **Scikit-learn** pour détection rapide
3. Testez pendant 1 mois

### Phase 2 (Production)

- **Si budget limité** : **Ollama local** (gratuit)
- **Si qualité prioritaire** : **Claude Haiku** (5-10$/mois)
- **Compromis** : **Gemini Flash** (reste grat