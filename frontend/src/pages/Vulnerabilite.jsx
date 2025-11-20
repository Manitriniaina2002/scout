import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { AlertTriangle, Shield, TrendingUp, Activity, Scan } from "lucide-react";
import Modal from "../components/ui/modal";
import { toast } from "sonner";

const scanTools = [
  "nmap",
  "nikto",
  "wpscan",
  "sslscan"
];

// API base URL
const API_BASE = "http://localhost:8000/api";

const getCriticalityColor = (criticality) => {
  switch (criticality) {
    case "critical": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "base": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCriticalityIcon = (criticality) => {
  switch (criticality) {
    case "critical": return <AlertTriangle className="w-4 h-4" />;
    case "high": return <TrendingUp className="w-4 h-4" />;
    case "medium": return <Activity className="w-4 h-4" />;
    case "base": return <Shield className="w-4 h-4" />;
    default: return <Shield className="w-4 h-4" />;
  }
};

const getCriticalityLabel = (criticality) => {
  switch (criticality) {
    case "critical": return "Critique";
    case "high": return "Élevée";
    case "medium": return "Moyenne";
    case "base": return "Base";
    default: return criticality;
  }
};

const getCvssColor = (cvss) => {
  if (cvss >= 9.0) return "bg-red-100 text-red-800 border-red-200";
  if (cvss >= 7.0) return "bg-orange-100 text-orange-800 border-orange-200";
  if (cvss >= 4.0) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-blue-100 text-blue-800 border-blue-200";
};

function Vulnerabilite() {
  const [form, setForm] = useState({ ip: "", network: "", tool: scanTools[0] });
  const [submitted, setSubmitted] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, medium: 0, base: 0 });
  const [hasRunningScans, setHasRunningScans] = useState(false);

  const loadScanHistory = useCallback(async () => {
    try {
      const historyResponse = await fetch(`${API_BASE}/scan-history`);
      const historyData = await historyResponse.json();
      const formattedHistory = historyData.map(scan => ({
        id: scan.id,
        tool: scan.tool,
        ip: scan.ipAddress,
        network: scan.network,
        date: new Date(scan.scanDate).toLocaleString('fr-FR'),
        status: scan.status,
        vulnerabilitiesFound: scan.vulnerabilitiesFound
      }));
      
      // Check for completed scans that were previously running
      const previousRunningScans = scanHistory.filter(scan => scan.status === 'running');
      const currentCompletedScans = formattedHistory.filter(scan => 
        scan.status === 'completed' || scan.status === 'failed'
      );
      
      // Show toast for newly completed scans
      for (const completedScan of currentCompletedScans) {
        const wasRunning = previousRunningScans.find(scan => scan.id === completedScan.id);
        if (wasRunning) {
          if (completedScan.status === 'completed') {
            toast.success(`Scan ${completedScan.id} terminé`, {
              description: `${completedScan.vulnerabilitiesFound} vulnérabilités trouvées avec ${completedScan.tool}`,
              duration: 5000,
            });
          } else {
            toast.error(`Scan ${completedScan.id} échoué`, {
              description: `Erreur lors du scan avec ${completedScan.tool}`,
              duration: 5000,
            });
          }
        }
      }
      
      setScanHistory(formattedHistory);
      
      // Check if there are any running scans
      const running = formattedHistory.some(scan => scan.status === 'running');
      setHasRunningScans(running);
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  }, [scanHistory]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch vulnerabilities
      const vulnResponse = await fetch(`${API_BASE}/vulnerabilities`);
      const vulnData = await vulnResponse.json();
      setVulnerabilities(vulnData);

      // Fetch statistics
      const statsResponse = await fetch(`${API_BASE}/vulnerabilities/statistics`);
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch scan history
      await loadScanHistory();

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }, [loadScanHistory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Poll for scan updates when there are running scans
  useEffect(() => {
    let interval;
    if (hasRunningScans) {
      interval = setInterval(() => {
        loadScanHistory();
      }, 3000); // Check every 3 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasRunningScans, loadScanHistory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/scan-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: form.tool,
          ipAddress: form.ip,
          network: form.network
        })
      });

      if (response.ok) {
        const newScan = await response.json();
        setScanHistory(prev => [{
          id: newScan.id,
          tool: newScan.tool,
          ip: newScan.ipAddress,
          network: newScan.network,
          date: new Date(newScan.scanDate).toLocaleString('fr-FR'),
          status: newScan.status,
          vulnerabilitiesFound: newScan.vulnerabilitiesFound
        }, ...prev]);
        setSubmitted(true);
        setShowScanModal(false);
        
        // Show toast notification for scan start
        toast.info(`Scan ${newScan.id} lancé`, {
          description: `Analyse en cours avec ${form.tool} sur ${form.ip}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error creating scan:', error);
      toast.error('Erreur lors du lancement du scan', {
        description: 'Vérifiez votre connexion et réessayez',
        duration: 4000,
      });
    }
  };

  // Group vulnerabilities by criticality
  const groupedVulnerabilities = {
    critical: vulnerabilities.filter(v => v.criticality === "critical"),
    high: vulnerabilities.filter(v => v.criticality === "high"),
    medium: vulnerabilities.filter(v => v.criticality === "medium"),
    base: vulnerabilities.filter(v => v.criticality === "base")
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] animate-fadeIn">
          <div className="text-center">
            <div className="spinner inline-block h-12 w-12"></div>
            <p className="mt-4 text-sm font-medium" style={{color: '#4B8B32'}}>Chargement des vulnérabilités...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Vulnérabilités</h2>
              <p className="mt-2 text-sm text-gray-600">Tableau de bord des vulnérabilités et scan de sécurité</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowHistoryModal(true)} 
                variant="outline"
                className="border-[#4B8B32] text-[#4B8B32] hover:bg-[#4B8B32] hover:text-white"
              >
                <Activity className="w-4 h-4 mr-2" />
                Voir l&apos;historique
              </Button>
              <Button onClick={() => setShowScanModal(true)} className="bg-[#4B8B32] text-white hover:bg-green-700">
                <Scan className="w-4 h-4 mr-2" />
                Nouveau Scan
              </Button>
            </div>
          </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Vulnérabilités détectées</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critique</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">Risque élevé</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Élevée</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
              <p className="text-xs text-muted-foreground">Risque modéré</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
              <Activity className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
              <p className="text-xs text-muted-foreground">Risque faible</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Base</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.base}</div>
              <p className="text-xs text-muted-foreground">Risque minimal</p>
            </CardContent>
          </Card>
        </div>

        {/* Vulnerabilities Section */}
        <div className="space-y-6">
          {Object.entries(groupedVulnerabilities).map(([level, vulnerabilities]) => (
            <Card key={level}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getCriticalityIcon(level)}
                  <span className="capitalize">{getCriticalityLabel(level)}</span>
                  <Badge className={getCriticalityColor(level)}>
                    {vulnerabilities.length} vulnérabilité{vulnerabilities.length > 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vulnerabilities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vulnerabilities.map((vuln) => (
                      <div key={vuln.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{vuln.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{vuln.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {vuln.id}
                              </Badge>
                              <Badge className={`${getCriticalityColor(vuln.criticality)} text-xs`}>
                                {getCriticalityLabel(vuln.criticality)}
                              </Badge>
                              <Badge className={`${getCvssColor(parseFloat(vuln.cvssScore))} text-xs`}>
                                CVSS: {vuln.cvssScore}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucune vulnérabilité de niveau {getCriticalityLabel(level)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scan Form Modal */}
        <Modal open={showScanModal} onClose={() => setShowScanModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Formulaire de Scan de Vulnérabilité</h3>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Outil de scan</label>
                <select
                  name="tool"
                  value={form.tool}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                >
                  {scanTools.map((tool) => (
                    <option key={tool} value={tool}>{tool}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">IP à scanner</label>
                <Input
                  name="ip"
                  value={form.ip}
                  onChange={handleChange}
                  placeholder="Ex: 192.168.1.1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Réseau à scanner</label>
                <Input
                  name="network"
                  value={form.network}
                  onChange={handleChange}
                  placeholder="Ex: 192.168.1.0/24"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowScanModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-[#4B8B32] text-white hover:bg-green-700">
                  Lancer le scan
                </Button>
              </div>
            </form>
            {submitted && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
                Scan lancé avec {form.tool} sur IP {form.ip} et réseau {form.network}.
              </div>
            )}
          </div>
        </Modal>

        {/* History Modal */}
        <Modal open={showHistoryModal} onClose={() => setShowHistoryModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Historique des Scans</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white border-b">
                    <tr>
                      <th className="text-left py-2 px-2 font-medium">ID Scan</th>
                      <th className="text-left py-2 px-2 font-medium">Outil</th>
                      <th className="text-left py-2 px-2 font-medium">IP/Réseau</th>
                      <th className="text-left py-2 px-2 font-medium">Date</th>
                      <th className="text-left py-2 px-2 font-medium">Statut</th>
                      <th className="text-left py-2 px-2 font-medium">Vulnérabilités</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanHistory.map((scan) => (
                      <tr key={scan.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <Badge variant="outline" className="text-xs">
                            {scan.id}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 font-medium">{scan.tool}</td>
                        <td className="py-3 px-2 text-gray-600">
                          <div>{scan.ip}</div>
                          <div className="text-xs text-gray-500">{scan.network}</div>
                        </td>
                        <td className="py-3 px-2 text-gray-600">{scan.date}</td>
                        <td className="py-3 px-2">
                          <Badge
                            className={`text-xs ${
                              scan.status === 'completed'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : scan.status === 'running'
                                ? 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse'
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            {scan.status === 'completed' ? 'Terminé' :
                             scan.status === 'running' ? 'En cours...' : 'Échec'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className="text-xs">
                            {scan.vulnerabilitiesFound} trouvée{scan.vulnerabilitiesFound !== 1 ? 's' : ''}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {scanHistory.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Aucun scan effectué pour le moment
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowHistoryModal(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </Modal>
        </>
      )}
    </div>
  );
}

export default Vulnerabilite;
