#!/usr/bin/env python3
"""
Script pour initialiser la base de données avec les données initiales
"""
import sys
import os
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import User, AuditResult, AuditHistory

def init_db():
    """Créer toutes les tables de la base de données"""
    print("🔄 Initialisation de la base de données...")
    print("-" * 50)
    
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ Tables créées avec succès:")
        print("  - users")
        print("  - audit_results")
        print("  - audit_history")
    except Exception as e:
        print(f"✗ Erreur lors de l'initialisation: {e}")
        sys.exit(1)

def load_audit_results():
    """Charger les résultats d'audit depuis JSON"""
    json_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'audit-results.json')
    
    if not os.path.exists(json_path):
        print(f"⚠️  Fichier non trouvé: {json_path}")
        return
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    db = SessionLocal()
    
    try:
        migrated = 0
        skipped = 0
        
        for item in data:
            control_id = item.get('control')
            
            existing = db.query(AuditResult).filter(
                AuditResult.control_id == control_id
            ).first()
            
            if existing:
                skipped += 1
                continue
            
            category = '.'.join(control_id.split('.')[:2]) if '.' in control_id else control_id
            
            audit_result = AuditResult(
                control_id=control_id,
                control_name=item.get('description', '')[:255],
                category=category,
                status=item.get('status', 'not-evaluated'),
                evaluation_date=item.get('date'),
                evaluated_by=item.get('auditor', 'Unknown'),
                evidence=item.get('evidence', ''),
                notes=item.get('notes', ''),
                linked_risks=None
            )
            
            db.add(audit_result)
            migrated += 1
        
        db.commit()
        print(f"✓ Résultats d'audit: {migrated} ajoutés, {skipped} ignorés")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Erreur: {e}")
    finally:
        db.close()

def load_risks():
    """Charger les risques ADES"""
    db = SessionLocal()
    
    risks_data = [
        {
            "risk_id": "RISK-001",
            "title": "Campagne de phishing ciblée ADES",
            "description": "Emails de phishing usurpant l'identité de l'ADES détectés",
            "severity": "HIGH",
            "status": "open",
            "linked_controls": "A.6.3,A.6.8",
            "source": "ADES"
        },
        {
            "risk_id": "RISK-002",
            "title": "Site WordPress exposé avec vulnérabilités",
            "description": "WordPress avec plugins obsolètes exposé publiquement",
            "severity": "CRITICAL",
            "status": "open",
            "linked_controls": "A.8.8,A.8.9",
            "source": "ADES"
        },
        {
            "risk_id": "RISK-003",
            "title": "Données ADES sur le Dark Web",
            "description": "Surveillance Dark Web requise pour détecter fuites de données",
            "severity": "CRITICAL",
            "status": "open",
            "linked_controls": "A.5.7",
            "source": "ADES"
        },
        {
            "risk_id": "RISK-004",
            "title": "Caméras IoT exposées sur Internet",
            "description": "Dispositifs de surveillance accessibles sans authentification",
            "severity": "CRITICAL",
            "status": "open",
            "linked_controls": "A.7.4,A.8.9",
            "source": "ADES"
        },
        {
            "risk_id": "RISK-005",
            "title": "Configuration M365 non sécurisée",
            "description": "Score de sécurité Microsoft 365 faible",
            "severity": "HIGH",
            "status": "open",
            "linked_controls": "A.5.23,A.8.9",
            "source": "ADES"
        },
        {
            "risk_id": "RISK-006",
            "title": "Absence d'authentification multi-facteurs",
            "description": "MFA non activé sur les comptes critiques",
            "severity": "CRITICAL",
            "status": "open",
            "linked_controls": "A.5.17,A.8.5",
            "source": "ADES"
        }
    ]
    
    try:
        added = 0
        skipped = 0
        
        for risk_data in risks_data:
            existing = db.query(ADESRisk).filter(
                ADESRisk.risk_id == risk_data["risk_id"]
            ).first()
            
            if existing:
                skipped += 1
                continue
            
            risk = ADESRisk(**risk_data)
            db.add(risk)
            added += 1
        
        db.commit()
        print(f"✓ Risques: {added} ajoutés, {skipped} ignorés")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Erreur: {e}")
    finally:
        db.close()

def load_scan_history():
    """Charger l'historique des scans de test"""
    db = SessionLocal()
    
    scan_history_data = [
        {
            "id": "SCAN-001",
            "tool": "Nessus",
            "ip_address": "192.168.1.1",
            "network": "192.168.1.0/24",
            "status": "completed",
            "vulnerabilities_found": 3
        },
        {
            "id": "SCAN-002",
            "tool": "OpenVAS",
            "ip_address": "10.0.0.1",
            "network": "10.0.0.0/24",
            "status": "completed",
            "vulnerabilities_found": 7
        },
        {
            "id": "SCAN-003",
            "tool": "Nmap",
            "ip_address": "172.16.0.1",
            "network": "172.16.0.0/24",
            "status": "failed",
            "vulnerabilities_found": 0
        }
    ]
    
    try:
        added = 0
        skipped = 0
        
        for scan_data in scan_history_data:
            existing = db.query(ScanHistory).filter(
                ScanHistory.id == scan_data["id"]
            ).first()
            
            if existing:
                skipped += 1
                continue
            
            # Set scan date to some time in the past
            from datetime import datetime, timedelta
            import random
            days_ago = random.randint(1, 30)
            scan_date = datetime.now() - timedelta(days=days_ago)
            
            scan = ScanHistory(**scan_data)
            scan.scan_date = scan_date
            db.add(scan)
            added += 1
        
        db.commit()
        print(f"✓ Historique des scans: {added} ajoutés, {skipped} ignorés")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Erreur: {e}")
if __name__ == "__main__":
    init_db()
    load_audit_results()
    print("-" * 50)
    print("✓ Base de données initialisée avec succès\n")
