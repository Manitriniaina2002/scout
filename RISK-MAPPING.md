# 🎯 Mapping Risques ADES → Contrôles ISO 27001:2022

## Vue d'ensemble

Ce document établit la correspondance entre les 6 risques critiques identifiés lors de l'audit OSINT de l'ADES et les 93 contrôles de l'ISO 27001:2022.

---

## 🔴 RISK-001: Exposition OSINT - Emails employés

**Sévérité:** HIGH  
**Description:** 5 adresses emails d'employés exposées publiquement  
**Impact:** Phishing ciblé, ingénierie sociale, compromission de comptes

### Contrôles ISO 27001 applicables:

| Contrôle | Nom | Priorité | Objectif |
|----------|-----|----------|----------|
| **A.6.3** | Sensibilisation à la sécurité | 🔴 Critique | Former les employés au phishing |
| **A.6.8** | Rapports d'événements | 🔴 Critique | Mécanisme de signalement des tentatives de phishing |
| **A.7.7** | Bureau propre et écran vide | 🟡 Moyenne | Éviter l'exposition d'informations sensibles |
| **A.8.23** | Filtrage Web | 🟢 Faible | Bloquer les sites de phishing |

### Actions recommandées:
1. ✅ Formation anti-phishing obligatoire pour tous
2. ✅ Campagne de simulation de phishing trimestrielle
3. ✅ Politique "ne pas publier d'emails personnels"
4. ✅ Utilisation d'adresses génériques (contact@, info@)

---

## 🟠 RISK-002: CMS WordPress identifié

**Sévérité:** MEDIUM  
**Description:** Site web utilise WordPress, vulnérable aux exploits connus  
**Impact:** Défacement, injection de code malveillant, backdoors

### Contrôles ISO 27001 applicables:

| Contrôle | Nom | Priorité | Objectif |
|----------|-----|----------|----------|
| **A.8.8** | Gestion des vulnérabilités | 🔴 Critique | Scans réguliers et patching |
| **A.8.9** | Gestion de la configuration | 🔴 Critique | Baseline sécurisée de WordPress |
| **A.8.26** | Exigences de sécurité des applications | 🟡 Moyenne | Durcissement de WordPress |
| **A.8.29** | Tests de sécurité | 🟡 Moyenne | Pentests réguliers du site |

### Actions recommandées:
1. ✅ Mise à jour automatique de WordPress + plugins
2. ✅ Scan WPScan hebdomadaire
3. ✅ WAF (Cloudflare, Sucuri) devant le site
4. ✅ Supprimer les plugins inutilisés
5. ✅ Authentification forte pour l'admin WordPress

---

## 🔴 RISK-003: Structure du site sur Dark Web

**Sévérité:** CRITICAL  
**Description:** Architecture du site accessible sur le Dark Web  
**Impact:** Reconnaissance approfondie, planification d'attaques ciblées

### Contrôles ISO 27001 applicables:

| Contrôle | Nom | Priorité | Objectif |
|----------|-----|----------|----------|
| **A.5.7** | Threat Intelligence | 🔴 Critique | Veille sur menaces Dark Web |
| **A.5.24** | Planification gestion des incidents | 🔴 Critique | Préparer la réponse aux attaques |
| **A.8.16** | Activités de surveillance | 🔴 Critique | Détection d'intrusions |
| **A.8.20** | Sécurité des réseaux | 🔴 Critique | Segmentation réseau |

### Actions recommandées:
1. ✅ S'abonner à un service de Threat Intelligence (AlienVault, ThreatConnect)
2. ✅ Surveillance Dark Web mensuelle (Flashpoint, IntSights)
3. ✅ Déployer un IDS/IPS (Suricata, Snort)
4. ✅ Plan de réponse aux incidents documenté
5. ✅ Exercice de simulation d'incident annuel

---

## 🔴 RISK-004: Ports IoT/Firmware exposés

**Sévérité:** HIGH  
**Description:** Ports HTTP/HTTPS/RTSP ouverts sur dispositifs IoT (caméras)  
**Impact:** Accès non autorisé, surveillance illégale, botnet DDoS

### Contrôles ISO 27001 applicables:

| Contrôle | Nom | Priorité | Objectif |
|----------|-----|----------|----------|
| **A.7.4** | Surveillance sécurité physique | 🔴 Critique | Sécuriser les caméras |
| **A.8.1** | Dispositifs endpoint | 🔴 Critique | Durcissement des IoT |
| **A.8.20** | Sécurité des réseaux | 🔴 Critique | Isoler le réseau IoT |
| **A.8.22** | Ségrégation de réseaux | 🔴 Critique | VLAN dédié aux IoT |

### Actions recommandées:
1. ✅ Changer TOUS les mots de passe par défaut des caméras
2. ✅ Fermer les ports RTSP exposés sur Internet
3. ✅ Créer un VLAN IoT isolé du réseau principal
4. ✅ Authentification forte sur les caméras
5. ✅ Firmware à jour sur tous les dispositifs
6. ✅ VPN pour l'accès distant aux caméras

---

## 🔴 RISK-005: Score de sécurité Microsoft 365 faible

**Sévérité:** CRITICAL  
**Description:** Configuration de sécurité insuffisante sur M365  
**Impact:** Compromission du cloud, accès aux emails et documents

### Contrôles ISO 27001 applicables:

| Contrôle | Nom | Priorité | Objectif |
|----------|-----|----------|----------|
| **A.5.19** | Sécurité relations fournisseurs | 🟡 Moyenne | Évaluation de Microsoft |
| **A.5.23** | Sécurité services cloud | 🔴 Critique | Configuration M365 sécurisée |
| **A.8.2** | Droits d'accès privilégiés | 🔴 Critique | Admin M365 avec MFA |
| **A.8.5** | Authentification sécurisée | 🔴 Critique | MFA pour tous |
| **A.8.24** | Utilisation de la cryptographie | 🟡 Moyenne | Chiffrement des données sensibles |

### Actions recommandées:
1. ✅ **Activer MFA pour 100% des utilisateurs** (priorité absolue)
2. ✅ Augmenter le Secure Score à minimum 70%
3. ✅ Activer les politiques de sécurité recommandées:
   - Conditional Access
   - Data Loss Prevention (DLP)
   - Azure Information Protection
   - Advanced Threat Protection (ATP)
4. ✅ Audits réguliers des permissions
5. ✅ Sauvegarde externe des données M365

---

## 🔴 RISK-006: Absence de MFA

**Sévérité:** CRITICAL  
**Description:** Pas d'authentification à deux facteurs détectée  
**Impact:** Compromission de comptes par brute force, credential stuffing

### Contrôles ISO 27001 applicables:

| Contrôle | Nom | Priorité | Objectif |
|----------|-----|----------|----------|
| **A.5.17** | Informations d'authentification | 🔴 Critique | Gestion sécurisée des credentials |
| **A.8.5** | Authentification sécurisée | 🔴 Critique | Déployer MFA partout |

### Actions recommandées:
1. ✅ **Déployer MFA en urgence sur:**
   - Microsoft 365 (priorité 1)
   - WordPress admin (priorité 1)
   - VPN d'accès distant (priorité 1)
   - Tous les comptes admin (priorité 1)
   - Tous les utilisateurs (priorité 2)
2. ✅ Solutions MFA recommandées:
   - Microsoft Authenticator (gratuit avec M365)
   - Google Authenticator
   - YubiKey (matériel) pour les admins
3. ✅ Politique de mots de passe renforcée:
   - Minimum 12 caractères
   - Complexité obligatoire
   - Rotation tous les 90 jours
   - Pas de réutilisation des 5 derniers
4. ✅ Gestionnaire de mots de passe d'entreprise (Bitwarden, 1Password)

---

## 📊 Matrice de priorités

### Contrôles à implémenter en URGENCE (0-30 jours)

| Priorité | Contrôle | Risque lié | Effort | Impact |
|----------|----------|------------|--------|--------|
| 1 | **A.8.5** - MFA | RISK-005, RISK-006 | 🟢 Faible | 🔴 Critique |
| 2 | **A.5.23** - Cloud Security | RISK-005 | 🟡 Moyen | 🔴 Critique |
| 3 | **A.7.4** - IoT Security | RISK-004 | 🟡 Moyen | 🔴 Critique |
| 4 | **A.8.8** - Vulnérabilités WordPress | RISK-002 | 🟢 Faible | 🟡 Moyen |
| 5 | **A.6.3** - Formation phishing | RISK-001 | 🟢 Faible | 🟡 Moyen |

### Contrôles à implémenter à COURT TERME (1-3 mois)

| Priorité | Contrôle | Risque lié | Effort | Impact |
|----------|----------|------------|--------|--------|
| 6 | **A.5.7** - Threat Intelligence | RISK-003 | 🔴 Élevé | 🟡 Moyen |
| 7 | **A.8.16** - Surveillance | RISK-003 | 🔴 Élevé | 🟡 Moyen |
| 8 | **A.8.20** - Sécurité réseau | RISK-003, RISK-004 | 🟡 Moyen | 🟡 Moyen |
| 9 | **A.5.24** - Gestion incidents | RISK-003 | 🟢 Faible | 🟡 Moyen |
| 10 | **A.6.8** - Reporting incidents | RISK-001 | 🟢 Faible | 🟢 Faible |

---

## 📈 Indicateurs de succès (KPI)

### Métriques de conformité

- **Score Secure M365** : 45% → **70%** (cible 3 mois)
- **Taux adoption MFA** : 0% → **100%** (cible 1 mois)
- **Vulnérabilités WordPress** : Non géré → **Scan hebdomadaire**
- **Ports IoT exposés** : 5+ ports → **0 port public** (cible 1 mois)
- **Formation phishing** : 0% → **100% du personnel** (cible 2 mois)

### Métriques opérationnelles

- **Temps de patching WordPress** : > 30 jours → **< 7 jours**
- **Temps de détection d'incident** : > 90 jours → **< 24 heures**
- **Taux de réussite simulation phishing** : Non mesuré → **< 10% de clics**

---

## 🗓️ Roadmap de mise en conformité

### Phase 1 - URGENCE (Semaines 1-4)
- ✅ Activer MFA sur tous les comptes
- ✅ Fermer les ports IoT exposés
- ✅ Mise à jour WordPress + plugins
- ✅ Configuration baseline M365

### Phase 2 - CONSOLIDATION (Mois 2-3)
- ✅ Déployer WAF devant WordPress
- ✅ Mettre en place la surveillance (SIEM/IDS)
- ✅ Former le personnel au phishing
- ✅ Créer le plan de réponse aux incidents

### Phase 3 - AMÉLIORATION CONTINUE (Mois 4-6)
- ✅ Threat Intelligence opérationnelle
- ✅ Pentests réguliers
- ✅ Exercices de simulation
- ✅ Audit de conformité ISO 27001

---

**Responsable:** Équipe Sécurité ADES  
**Date de création:** 19 novembre 2025  
**Prochaine revue:** Janvier 2026
