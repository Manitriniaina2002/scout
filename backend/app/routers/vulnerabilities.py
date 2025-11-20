"""
Enhanced vulnerability scanner with real tool integrations
This replaces/enhances the existing backend/app/routers/vulnerabilities.py
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from app.database import get_db, SessionLocal
from app.models import Vulnerability, ScanHistory
from app.schemas import (
    VulnerabilityResponse, 
    ScanHistoryResponse, 
    ScanHistoryCreate, 
    VulnerabilityStatistics
)
from datetime import datetime
import subprocess
import json
import re
import socket
import ssl
import requests
from pathlib import Path
import tempfile
import os

router = APIRouter()


class VulnerabilityScanner:
    """Enhanced vulnerability scanner with multiple tool integrations"""
    
    @staticmethod
    def check_tool_availability(tool_name: str) -> bool:
        """Check if a security tool is installed"""
        try:
            subprocess.run([tool_name, '--version'], 
                         capture_output=True, 
                         timeout=5)
            return True
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False
    
    @staticmethod
    def run_nmap_scan(target: str, ports: str = "1-1000") -> Dict:
        """
        Run Nmap port scan
        Install: apt-get install nmap (Linux) or brew install nmap (Mac)
        """
        results = {
            "tool": "Nmap",
            "vulnerabilities": [],
            "summary": "",
            "raw_output": ""
        }
        
        try:
            # Check if nmap is available
            if not VulnerabilityScanner.check_tool_availability('nmap'):
                results["summary"] = "Nmap not installed. Install with: apt-get install nmap"
                return results
            
            # Run nmap scan
            cmd = [
                'nmap',
                '-p', ports,
                '--open',
                '-sV',  # Service version detection
                '--script', 'vuln',  # Vulnerability scripts
                '-T4',  # Timing template (aggressive)
                target
            ]
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                timeout=300  # 5 minute timeout
            )
            
            results["raw_output"] = result.stdout
            
            # Parse output
            open_ports = []
            vulnerabilities = []
            
            for line in result.stdout.split('\n'):
                # Find open ports
                if '/tcp' in line and 'open' in line:
                    port_match = re.search(r'(\d+)/tcp\s+open\s+(\S+)', line)
                    if port_match:
                        port = port_match.group(1)
                        service = port_match.group(2)
                        open_ports.append(f"{port} ({service})")
                        
                        # Check for vulnerable services
                        vuln = VulnerabilityScanner._analyze_service(port, service)
                        if vuln:
                            vulnerabilities.append(vuln)
                
                # Find vulnerability script results
                if '|' in line and ('VULNERABLE' in line or 'CVE' in line):
                    vulnerabilities.append({
                        "type": "Script Detection",
                        "description": line.strip(),
                        "severity": "high"
                    })
            
            results["vulnerabilities"] = vulnerabilities
            results["summary"] = f"Found {len(open_ports)} open ports, {len(vulnerabilities)} potential vulnerabilities"
            
        except subprocess.TimeoutExpired:
            results["summary"] = "Scan timed out"
        except Exception as e:
            results["summary"] = f"Scan failed: {str(e)}"
        
        return results
    
    @staticmethod
    def _analyze_service(port: str, service: str) -> Optional[Dict]:
        """Analyze service for known vulnerabilities"""
        vulnerable_services = {
            '21': {'service': 'FTP', 'issue': 'FTP allows unencrypted data transfer', 'severity': 'medium'},
            '23': {'service': 'Telnet', 'issue': 'Telnet is insecure - use SSH instead', 'severity': 'high'},
            '25': {'service': 'SMTP', 'issue': 'Check for open relay configuration', 'severity': 'medium'},
            '53': {'service': 'DNS', 'issue': 'Check for zone transfer vulnerability', 'severity': 'medium'},
            '445': {'service': 'SMB', 'issue': 'SMB vulnerable to EternalBlue and other exploits', 'severity': 'critical'},
            '3306': {'service': 'MySQL', 'issue': 'Database exposed - should not be publicly accessible', 'severity': 'high'},
            '3389': {'service': 'RDP', 'issue': 'RDP exposed - ensure NLA is enabled', 'severity': 'high'},
            '5432': {'service': 'PostgreSQL', 'issue': 'Database exposed - should not be publicly accessible', 'severity': 'high'},
            '27017': {'service': 'MongoDB', 'issue': 'MongoDB exposed - check authentication', 'severity': 'high'},
        }
        
        if port in vulnerable_services:
            vuln = vulnerable_services[port]
            return {
                "type": f"{vuln['service']} Service",
                "description": vuln['issue'],
                "severity": vuln['severity'],
                "port": port
            }
        return None
    
    @staticmethod
    def run_nikto_scan(target: str) -> Dict:
        """
        Run Nikto web vulnerability scan
        Install: apt-get install nikto (Linux)
        """
        results = {
            "tool": "Nikto",
            "vulnerabilities": [],
            "summary": "",
            "raw_output": ""
        }
        
        try:
            if not VulnerabilityScanner.check_tool_availability('nikto'):
                results["summary"] = "Nikto not installed. Install with: apt-get install nikto"
                return results
            
            # Ensure target has protocol
            if not target.startswith('http'):
                target = f"http://{target}"
            
            cmd = [
                'nikto',
                '-h', target,
                '-Tuning', 'x',  # All tests
                '-Format', 'json',
                '-timeout', '10'
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=180
            )
            
            results["raw_output"] = result.stdout
            
            # Parse JSON output
            try:
                data = json.loads(result.stdout)
                for vuln in data.get('vulnerabilities', []):
                    results["vulnerabilities"].append({
                        "type": "Web Vulnerability",
                        "description": vuln.get('msg', 'Unknown issue'),
                        "severity": VulnerabilityScanner._map_nikto_severity(vuln)
                    })
            except json.JSONDecodeError:
                # Parse text output if JSON fails
                for line in result.stdout.split('\n'):
                    if '+' in line and any(keyword in line.lower() for keyword in 
                                          ['vulnerable', 'outdated', 'exposed', 'error']):
                        results["vulnerabilities"].append({
                            "type": "Web Vulnerability",
                            "description": line.strip(),
                            "severity": "medium"
                        })
            
            results["summary"] = f"Found {len(results['vulnerabilities'])} web vulnerabilities"
            
        except subprocess.TimeoutExpired:
            results["summary"] = "Nikto scan timed out"
        except Exception as e:
            results["summary"] = f"Nikto scan failed: {str(e)}"
        
        return results
    
    @staticmethod
    def _map_nikto_severity(vuln: Dict) -> str:
        """Map Nikto findings to severity levels"""
        osvdb = vuln.get('OSVDB', '')
        if 'critical' in str(vuln).lower():
            return 'critical'
        elif osvdb or 'vulnerability' in str(vuln).lower():
            return 'high'
        return 'medium'
    
    @staticmethod
    def run_sslscan(target: str) -> Dict:
        """
        Run SSL/TLS configuration scan
        Install: apt-get install sslscan
        """
        results = {
            "tool": "SSLScan",
            "vulnerabilities": [],
            "summary": "",
            "raw_output": ""
        }
        
        try:
            if not VulnerabilityScanner.check_tool_availability('sslscan'):
                results["summary"] = "SSLScan not installed. Install with: apt-get install sslscan"
                # Fallback to Python SSL check
                return VulnerabilityScanner._python_ssl_check(target)
            
            # Remove protocol if present
            target = target.replace('https://', '').replace('http://', '')
            
            cmd = ['sslscan', '--no-colour', target]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            results["raw_output"] = result.stdout
            
            # Parse output for vulnerabilities
            weak_ciphers = []
            protocols = []
            
            for line in result.stdout.split('\n'):
                if 'SSLv2' in line or 'SSLv3' in line:
                    results["vulnerabilities"].append({
                        "type": "Weak SSL/TLS Protocol",
                        "description": f"Insecure protocol detected: {line.strip()}",
                        "severity": "high"
                    })
                
                if 'NULL' in line or 'EXPORT' in line or 'DES' in line:
                    weak_ciphers.append(line.strip())
                
                if 'Heartbleed' in line and 'vulnerable' in line.lower():
                    results["vulnerabilities"].append({
                        "type": "Heartbleed Vulnerability",
                        "description": "Server is vulnerable to Heartbleed (CVE-2014-0160)",
                        "severity": "critical"
                    })
            
            if weak_ciphers:
                results["vulnerabilities"].append({
                    "type": "Weak Cipher Suites",
                    "description": f"Found {len(weak_ciphers)} weak cipher suites",
                    "severity": "medium"
                })
            
            results["summary"] = f"SSL/TLS scan completed. Found {len(results['vulnerabilities'])} issues"
            
        except subprocess.TimeoutExpired:
            results["summary"] = "SSL scan timed out"
        except Exception as e:
            results["summary"] = f"SSL scan failed: {str(e)}"
        
        return results
    
    @staticmethod
    def _python_ssl_check(target: str) -> Dict:
        """Fallback SSL check using Python"""
        results = {
            "tool": "Python SSL Check",
            "vulnerabilities": [],
            "summary": ""
        }
        
        try:
            hostname = target.replace('https://', '').replace('http://', '').split(':')[0]
            port = 443
            
            context = ssl.create_default_context()
            with socket.create_connection((hostname, port), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    cipher = ssock.cipher()
                    version = ssock.version()
                    
                    # Check SSL/TLS version
                    if version in ['SSLv2', 'SSLv3', 'TLSv1', 'TLSv1.1']:
                        results["vulnerabilities"].append({
                            "type": "Outdated SSL/TLS Version",
                            "description": f"Server uses {version} which is deprecated",
                            "severity": "high"
                        })
                    
                    # Check cipher strength
                    if cipher and cipher[2] < 128:
                        results["vulnerabilities"].append({
                            "type": "Weak Cipher",
                            "description": f"Cipher strength is only {cipher[2]} bits",
                            "severity": "medium"
                        })
                    
                    # Check certificate expiration
                    if cert:
                        not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                        days_until_expiry = (not_after - datetime.now()).days
                        
                        if days_until_expiry < 0:
                            results["vulnerabilities"].append({
                                "type": "Expired Certificate",
                                "description": "SSL certificate has expired",
                                "severity": "critical"
                            })
                        elif days_until_expiry < 30:
                            results["vulnerabilities"].append({
                                "type": "Expiring Certificate",
                                "description": f"SSL certificate expires in {days_until_expiry} days",
                                "severity": "medium"
                            })
            
            results["summary"] = f"SSL check completed. Found {len(results['vulnerabilities'])} issues"
            
        except Exception as e:
            results["summary"] = f"SSL check failed: {str(e)}"
        
        return results
    
    @staticmethod
    def run_wpscan(target: str) -> Dict:
        """
        Run WPScan for WordPress vulnerabilities
        Install: gem install wpscan
        """
        results = {
            "tool": "WPScan",
            "vulnerabilities": [],
            "summary": "",
            "raw_output": ""
        }
        
        try:
            if not VulnerabilityScanner.check_tool_availability('wpscan'):
                results["summary"] = "WPScan not installed. Install with: gem install wpscan"
                return results
            
            # Ensure target has protocol
            if not target.startswith('http'):
                target = f"http://{target}"
            
            cmd = [
                'wpscan',
                '--url', target,
                '--enumerate', 'vp,vt,u',  # Vulnerable plugins, themes, users
                '--format', 'json',
                '--disable-tls-checks'
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            results["raw_output"] = result.stdout
            
            try:
                data = json.loads(result.stdout)
                
                # Parse vulnerabilities
                for plugin, details in data.get('plugins', {}).items():
                    for vuln in details.get('vulnerabilities', []):
                        results["vulnerabilities"].append({
                            "type": "WordPress Plugin",
                            "description": f"{plugin}: {vuln.get('title', 'Unknown vulnerability')}",
                            "severity": "high"
                        })
                
                for theme, details in data.get('themes', {}).items():
                    for vuln in details.get('vulnerabilities', []):
                        results["vulnerabilities"].append({
                            "type": "WordPress Theme",
                            "description": f"{theme}: {vuln.get('title', 'Unknown vulnerability')}",
                            "severity": "high"
                        })
                
                if data.get('users'):
                    results["vulnerabilities"].append({
                        "type": "Information Disclosure",
                        "description": f"WordPress user enumeration possible. Found {len(data['users'])} users",
                        "severity": "medium"
                    })
                
            except json.JSONDecodeError:
                results["summary"] = "Failed to parse WPScan output"
            
            results["summary"] = f"WPScan completed. Found {len(results['vulnerabilities'])} WordPress vulnerabilities"
            
        except subprocess.TimeoutExpired:
            results["summary"] = "WPScan timed out"
        except Exception as e:
            results["summary"] = f"WPScan failed: {str(e)}"
        
        return results
    
    @staticmethod
    def run_testssl(target: str) -> Dict:
        """
        Run testssl.sh for comprehensive SSL/TLS testing
        Install: git clone https://github.com/drwetter/testssl.sh
        """
        results = {
            "tool": "testssl.sh",
            "vulnerabilities": [],
            "summary": "",
            "raw_output": ""
        }
        
        try:
            # Check for testssl.sh
            testssl_path = '/usr/local/bin/testssl.sh'
            if not os.path.exists(testssl_path):
                testssl_path = './testssl.sh/testssl.sh'
            
            if not os.path.exists(testssl_path):
                results["summary"] = "testssl.sh not found. Clone from: github.com/drwetter/testssl.sh"
                return results
            
            cmd = [testssl_path, '--jsonfile-pretty', '/tmp/testssl.json', target]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=180
            )
            
            results["raw_output"] = result.stdout
            
            # Parse JSON output
            if os.path.exists('/tmp/testssl.json'):
                with open('/tmp/testssl.json', 'r') as f:
                    data = json.load(f)
                    
                    for finding in data.get('scanResult', []):
                        severity = finding.get('severity', 'info').lower()
                        if severity in ['critical', 'high', 'medium']:
                            results["vulnerabilities"].append({
                                "type": "SSL/TLS Issue",
                                "description": finding.get('finding', 'Unknown issue'),
                                "severity": severity
                            })
                
                os.remove('/tmp/testssl.json')
            
            results["summary"] = f"testssl.sh completed. Found {len(results['vulnerabilities'])} SSL/TLS issues"
            
        except subprocess.TimeoutExpired:
            results["summary"] = "testssl.sh timed out"
        except Exception as e:
            results["summary"] = f"testssl.sh failed: {str(e)}"
        
        return results


def perform_scan_background(scan_id: str, tool: str, ip_address: str, network: str):
    """Background task to perform actual vulnerability scan"""
    scanner = VulnerabilityScanner()
    db = SessionLocal()
    
    try:
        # Select scan method based on tool
        if 'nmap' in tool.lower():
            scan_results = scanner.run_nmap_scan(ip_address)
        elif 'nikto' in tool.lower():
            scan_results = scanner.run_nikto_scan(ip_address)
        elif 'wpscan' in tool.lower():
            scan_results = scanner.run_wpscan(ip_address)
        elif 'ssl' in tool.lower():
            scan_results = scanner.run_sslscan(ip_address)
        elif 'testssl' in tool.lower():
            scan_results = scanner.run_testssl(ip_address)
        else:
            # Default to Nmap
            scan_results = scanner.run_nmap_scan(ip_address)
        
        # Update scan status
        scan = db.query(ScanHistory).filter(ScanHistory.id == scan_id).first()
        if scan:
            scan.status = "completed"
            scan.vulnerabilities_found = len(scan_results.get('vulnerabilities', []))
            db.commit()
            
            # Optionally save detailed results
            print(f"Scan {scan_id} completed:")
            print(f"Summary: {scan_results['summary']}")
            for vuln in scan_results.get('vulnerabilities', []):
                print(f"  - [{vuln['severity']}] {vuln['description']}")
    
    except Exception as e:
        # Mark scan as failed
        scan = db.query(ScanHistory).filter(ScanHistory.id == scan_id).first()
        if scan:
            scan.status = "failed"
            scan.vulnerabilities_found = 0
            db.commit()
        print(f"Scan {scan_id} failed: {e}")
    
    finally:
        db.close()


# API Endpoints
@router.get("/vulnerabilities", response_model=List[VulnerabilityResponse])
def get_vulnerabilities(db: Session = Depends(get_db)):
    """Get all vulnerabilities"""
    vulnerabilities = db.query(Vulnerability).all()
    return vulnerabilities


@router.get("/vulnerabilities/statistics", response_model=VulnerabilityStatistics)
def get_vulnerability_statistics(db: Session = Depends(get_db)):
    """Get vulnerability statistics"""
    total = db.query(Vulnerability).count()
    critical = db.query(Vulnerability).filter(Vulnerability.criticality == "critical").count()
    high = db.query(Vulnerability).filter(Vulnerability.criticality == "high").count()
    medium = db.query(Vulnerability).filter(Vulnerability.criticality == "medium").count()
    base = db.query(Vulnerability).filter(Vulnerability.criticality == "base").count()
    
    return VulnerabilityStatistics(
        total=total,
        critical=critical,
        high=high,
        medium=medium,
        base=base
    )


@router.get("/scan-history", response_model=List[ScanHistoryResponse])
def get_scan_history(db: Session = Depends(get_db)):
    """Get all scan history"""
    scans = db.query(ScanHistory).order_by(ScanHistory.scan_date.desc()).all()
    return scans


@router.post("/scan-history", response_model=ScanHistoryResponse)
def create_scan(
    scan: ScanHistoryCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new scan and execute it in background"""
    # Generate scan ID
    last_scan = db.query(ScanHistory).order_by(ScanHistory.id.desc()).first()
    if last_scan:
        last_id = int(last_scan.id.split('-')[1])
        new_id = f"SCAN-{str(last_id + 1).zfill(3)}"
    else:
        new_id = "SCAN-001"
    
    # Create scan record
    db_scan = ScanHistory(
        id=new_id,
        tool=scan.tool,
        ip_address=scan.ipAddress,
        network=scan.network,
        status="running",
        vulnerabilities_found=0
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    # Start background scan
    background_tasks.add_task(
        perform_scan_background,
        new_id,
        scan.tool,
        scan.ipAddress,
        scan.network
    )
    
    return db_scan


@router.get("/scan-history/{scan_id}", response_model=ScanHistoryResponse)
def get_scan_details(scan_id: str, db: Session = Depends(get_db)):
    """Get details of a specific scan"""
    scan = db.query(ScanHistory).filter(ScanHistory.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan


@router.get("/tools/availability")
def check_tools_availability():
    """Check which security tools are installed"""
    scanner = VulnerabilityScanner()
    tools = ['nmap', 'nikto', 'wpscan', 'sslscan']
    
    availability = {}
    for tool in tools:
        availability[tool] = scanner.check_tool_availability(tool)
    
    return {
        "tools": availability,
        "message": "Install missing tools to enable full scanning capabilities"
    }