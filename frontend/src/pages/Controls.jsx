import { useState, useEffect } from 'react'
import { Search, Edit2, Trash2, Save, X, Plus, Download, Upload, FileUp, Filter, Grid3x3, List, CheckCircle, AlertCircle, XCircle, FileText, TrendingUp, Copy, Archive, Eye, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { getAuditResults, deleteAuditResult, createAuditResult, updateAuditResult, getStatistics } from '../services/api'
import { ISO27001_CONTROLS, getStatusColor, getStatusLabel } from '../data/controls'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Checkbox } from '../components/ui/checkbox'
import Modal from '../components/ui/modal'

function Controls() {
  const [results, setResults] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: ''
  })
  const [editingControlId, setEditingControlId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({})
  const [selectedControls, setSelectedControls] = useState([])
  const [showAddNew, setShowAddNew] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [evidenceFile, setEvidenceFile] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [resultsData, statsData] = await Promise.all([
        getAuditResults(),
        getStatistics()
      ])
      setResults(resultsData.results || [])
      setStats(statsData)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des données')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadResults = async () => {
    try {
      const data = await getAuditResults()
      setResults(data.results || [])
      const statsData = await getStatistics()
      setStats(statsData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (control, result) => {
    setEditingControlId(control.id)
    setShowAddNew(false)
    setFormData({
      controlId: control.id,
      status: result?.status || 'not-evaluated',
      notes: result?.notes || '',
      priority: result?.priority || 'medium',
    })
    setShowEditModal(true)
  }

  const handleAddNew = () => {
    setShowAddNew(true)
    setEditingControlId(null)
    setFormData({
      controlId: '',
      controlName: '',
      category: '',
      status: 'not-evaluated',
      evaluatedBy: '',
      evaluationDate: new Date().toISOString().split('T')[0],
      notes: '',
      evidence: '',
      priority: 'medium',
      responsiblePerson: '',
      implementationCost: '',
      timeline: ''
    })
    setEvidenceFile(null)
  }

  const handleCancelEdit = () => {
    setEditingControlId(null)
    setShowEditModal(false)
    setShowAddNew(false)
    setFormData({})
    setEvidenceFile(null)
  }

  const handleSave = async () => {
    try {
      let evidenceData = formData.evidence
      
      if (evidenceFile) {
        evidenceData = `${evidenceData ? evidenceData + ', ' : ''}File: ${evidenceFile.name}`
      }

      const dataToSave = { ...formData, evidence: evidenceData }

      if (showAddNew) {
        await createAuditResult(dataToSave)
      } else {
        const result = getControlResult(editingControlId)
        if (result) {
          await updateAuditResult(editingControlId, dataToSave)
        } else {
          await createAuditResult(dataToSave)
        }
      }
      
      setEditingControlId(null)
      setShowAddNew(false)
      setFormData({})
      setEvidenceFile(null)
      await loadResults()
      toast.success('Contrôle enregistré avec succès')
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde')
      console.error(err)
    }
  }

  const handleDelete = async (controlId) => {
    toast('Êtes-vous sûr ?', {
      description: 'Cette action supprimera définitivement cette évaluation.',
      action: {
        label: 'Supprimer',
        onClick: async () => {
          try {
            await deleteAuditResult(controlId)
            await loadResults()
            toast.success('Évaluation supprimée')
          } catch (err) {
            toast.error('Erreur lors de la suppression')
            console.error(err)
          }
        },
      },
      cancel: {
        label: 'Annuler',
        onClick: () => {},
      },
    })
  }

  const handleDuplicate = async (control, result) => {
    try {
      const duplicateData = {
        ...formData,
        controlId: control.id,
        status: result?.status || 'not-evaluated',
        evaluatedBy: result?.evaluatedBy || '',
        evaluationDate: new Date().toISOString().split('T')[0],
        notes: result?.notes ? `[Copie] ${result.notes}` : '',
        evidence: result?.evidence || '',
        priority: result?.priority || 'medium',
        responsiblePerson: result?.responsiblePerson || '',
        implementationCost: result?.implementationCost || '',
        timeline: result?.timeline || ''
      }
      await createAuditResult(duplicateData)
      await loadResults()
      toast.success('Contrôle dupliqué avec succès')
    } catch (err) {
      toast.error('Erreur lors de la duplication')
      console.error(err)
    }
  }

  const handleView = (control, result) => {
    toast.info('Prévisualisation', {
      description: `${control.id}: ${control.name}\nStatut: ${getStatusLabel(result?.status || 'not-evaluated')}`
    })
  }

  const handleMarkComplete = async (control) => {
    try {
      const result = getControlResult(control.id)
      const updateData = {
        ...formData,
        controlId: control.id,
        status: 'compliant',
        evaluatedBy: result?.evaluatedBy || 'System',
        evaluationDate: new Date().toISOString().split('T')[0],
        notes: result?.notes || '',
        evidence: result?.evidence || ''
      }
      if (result) {
        await updateAuditResult(control.id, updateData)
      } else {
        await createAuditResult(updateData)
      }
      await loadResults()
      toast.success('Contrôle marqué comme conforme')
    } catch (err) {
      toast.error('Erreur lors de la mise à jour')
      console.error(err)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedControls.length === 0) {
      toast.warning('Veuillez sélectionner au moins un contrôle')
      return
    }
    
    toast(`Supprimer ${selectedControls.length} évaluation(s) ?`, {
      description: 'Cette action est irréversible.',
      action: {
        label: 'Supprimer tout',
        onClick: async () => {
          try {
            await Promise.all(selectedControls.map(id => deleteAuditResult(id)))
            setSelectedControls([])
            await loadResults()
            toast.success(`${selectedControls.length} évaluation(s) supprimée(s)`)
          } catch (err) {
            toast.error('Erreur lors de la suppression')
            console.error(err)
          }
        },
      },
      cancel: {
        label: 'Annuler',
        onClick: () => {},
      },
    })
  }

  const handleExport = () => {
    const dataToExport = results.map(r => ({
      controlId: r.controlId,
      status: r.status,
      evaluatedBy: r.evaluatedBy,
      evaluationDate: r.evaluationDate,
      notes: r.notes,
      evidence: r.evidence,
      priority: r.priority,
      responsiblePerson: r.responsiblePerson,
      implementationCost: r.implementationCost,
      timeline: r.timeline
    }))
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `iso27001-controls-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Export réussi ! ${dataToExport.length} contrôle(s) exporté(s)`)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result)
        for (const item of imported) {
          await createAuditResult(item)
        }
        await loadResults()
        toast.success(`Import réussi ! ${imported.length} contrôle(s) importé(s)`)
      } catch (err) {
        toast.error('Erreur lors de l\'import - Vérifiez le format du fichier')
        console.error(err)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEvidenceFile(file)
    }
  }

  const toggleSelectControl = (controlId) => {
    setSelectedControls(prev => (
      prev.includes(controlId)
        ? prev.filter(id => id !== controlId)
        : [...prev, controlId]
    ));
  }

  const toggleSelectAll = () => {
    if (selectedControls.length === results.length) {
      setSelectedControls([])
    } else {
      setSelectedControls(results.map(r => r.controlId))
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getControlResult = (controlId) => {
    return results.find(r => r.controlId === controlId)
  }

  const filteredCategories = Object.entries(ISO27001_CONTROLS).filter(([categoryId]) => {
    if (filters.category === 'all') return true
    return categoryId === filters.category
  })

  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'compliant': return 'success'
      case 'partial': return 'warning'
      case 'non-compliant': return 'danger'
      default: return 'outline'
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] animate-fadeIn">
      <div className="text-center">
        <div className="spinner inline-block h-12 w-12"></div>
        <p className="mt-4 text-sm font-medium" style={{color: '#4B8B32'}}>Chargement des contrôles...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="rounded-lg bg-red-50 border-2 border-red-500 p-4 animate-shake">
      <p className="text-sm font-medium text-red-800">{error}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Contrôles ISO 27001:2022</h2>
          <p className="mt-2 text-sm text-gray-600">Annexe A - Gestion et évaluation des contrôles de sécurité</p>
        </div>
        <div className="flex gap-2 animate-fadeIn">
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-[#4B8B32] to-green-600 hover:from-green-700 hover:to-green-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Contrôle
          </Button>
          <Button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} 
            variant="outline"
            title={viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
          </Button>
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant="outline"
            className={showFilters ? 'bg-green-50 border-[#4B8B32]' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </span>
            </Button>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          {selectedControls.length > 0 && (
            <Button onClick={handleBulkDelete} variant="destructive" className="animate-slideIn">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer ({selectedControls.length})
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-fadeIn">
          {/* Total Controls */}
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total des contrôles</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">ISO 27001:2022 Annexe A</p>
              </div>
            </CardContent>
          </Card>

          {/* Compliant */}
          <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-[#4B8B32] border-opacity-30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Conformes</p>
                  <p className="text-3xl font-bold" style={{color: '#4B8B32'}}>{stats.compliant || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#4B8B32', opacity: 0.1}}>
                  <CheckCircle className="h-6 w-6" style={{color: '#4B8B32'}} />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  {stats.total > 0 ? Math.round(stats.compliant / stats.total * 100) : 0}% du total
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Partial */}
          <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-[#2196F3] border-opacity-30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Partiels</p>
                  <p className="text-3xl font-bold" style={{color: '#2196F3'}}>{stats.partial || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#2196F3', opacity: 0.1}}>
                  <AlertCircle className="h-6 w-6" style={{color: '#2196F3'}} />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  {stats.total > 0 ? Math.round(stats.partial / stats.total * 100) : 0}% du total
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Non-Compliant */}
          <Card className="bg-gradient-to-br from-red-50 to-white border-2 border-[#d32f2f] border-opacity-30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Non conformes</p>
                  <p className="text-3xl font-bold" style={{color: '#d32f2f'}}>{stats.nonCompliant || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#d32f2f', opacity: 0.1}}>
                  <XCircle className="h-6 w-6" style={{color: '#d32f2f'}} />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  {stats.total > 0 ? Math.round(stats.nonCompliant / stats.total * 100) : 0}% du total
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="bg-gradient-to-br from-teal-50 to-white border-2 border-[#009688] border-opacity-30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Taux de conformité</p>
                  <p className="text-3xl font-bold" style={{
                    color: stats.total > 0 
                      ? (stats.compliant / stats.total * 100) >= 90 ? '#4B8B32'
                      : (stats.compliant / stats.total * 100) >= 60 ? '#F59E0B'
                      : '#d32f2f'
                      : '#9CA3AF'
                  }}>
                    {stats.total > 0 ? Math.round(stats.compliant / stats.total * 100) : 0}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{
                  backgroundColor: stats.total > 0 
                    ? (stats.compliant / stats.total * 100) >= 90 ? '#4B8B32'
                    : (stats.compliant / stats.total * 100) >= 60 ? '#F59E0B'
                    : '#d32f2f'
                    : '#9CA3AF',
                  opacity: 0.1
                }}>
                  <TrendingUp className="h-6 w-6" style={{
                    color: stats.total > 0 
                      ? (stats.compliant / stats.total * 100) >= 90 ? '#4B8B32'
                      : (stats.compliant / stats.total * 100) >= 60 ? '#F59E0B'
                      : '#d32f2f'
                      : '#9CA3AF'
                  }} />
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{
                      width: `${stats.total > 0 ? (stats.compliant / stats.total * 100) : 0}%`,
                      backgroundColor: stats.total > 0 
                        ? (stats.compliant / stats.total * 100) >= 90 ? '#4B8B32'
                        : (stats.compliant / stats.total * 100) >= 60 ? '#F59E0B'
                        : '#d32f2f'
                        : '#9CA3AF'
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {stats.total - stats.compliant} restant(s)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add New Control Form */}
      {showAddNew && (
        <Card className="bg-white border-2 border-[#4B8B32] shadow-lg animate-slideIn">
          <CardHeader className="bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="text-[#4B8B32]">Nouveau Contrôle Personnalisé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="controlId">ID du Contrôle *</Label>
                  <Input
                    id="controlId"
                    type="text"
                    name="controlId"
                    value={formData.controlId}
                    onChange={handleFormChange}
                    placeholder="Ex: CUSTOM-001"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nom du Contrôle *</Label>
                  <input
                    type="text"
                    name="controlName"
                    value={formData.controlName}
                    onChange={handleFormChange}
                    placeholder="Nom du contrôle"
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  />
                </div>
                <div>
                  <Label>Catégorie</Label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="Ex: Sécurité physique"
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  />
                </div>
                <div>
                  <Label>Statut *</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  >
                    <option value="not-evaluated">Non évalué</option>
                    <option value="compliant">Conforme</option>
                    <option value="partial">Partiellement conforme</option>
                    <option value="non-compliant">Non conforme</option>
                  </Select>
                </div>
                <div>
                  <Label>Priorité</Label>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="critical">Critique</option>
                  </Select>
                </div>
                <div>
                  <Label>Évalué par</Label>
                  <input
                    type="text"
                    name="evaluatedBy"
                    value={formData.evaluatedBy}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  />
                </div>
                <div>
                  <Label>Responsable</Label>
                  <input
                    type="text"
                    name="responsiblePerson"
                    value={formData.responsiblePerson}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  />
                </div>
                <div>
                  <Label>Date d'évaluation</Label>
                  <input
                    type="date"
                    name="evaluationDate"
                    value={formData.evaluationDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  />
                </div>
                <div>
                  <Label>Coût de mise en œuvre</Label>
                  <input
                    type="text"
                    name="implementationCost"
                    value={formData.implementationCost}
                    onChange={handleFormChange}
                    placeholder="Ex: 5000 EUR"
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  />
                </div>
                <div>
                  <Label>Délai</Label>
                  <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleFormChange}
                    placeholder="Ex: 3 mois"
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  />
                </div>
              </div>
              
              <div>
                <Label>Notes</Label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32] resize-none"
                ></textarea>
              </div>

              <div>
                <Label>Preuves</Label>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="evidence"
                    value={formData.evidence}
                    onChange={handleFormChange}
                    placeholder="Liens, références..."
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex-1">
                      <div className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-[#2196F3] border-opacity-40 rounded-md hover:border-[#2196F3] hover:bg-blue-50 transition-all duration-200 shadow-sm">
                        <FileUp className="h-4 w-4" style={{color: '#2196F3'}} />
                        <span className="text-sm font-medium" style={{color: evidenceFile ? '#4B8B32' : '#666'}}>
                          {evidenceFile ? evidenceFile.name : 'Télécharger un fichier'}
                        </span>
                      </div>
                      <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                    {evidenceFile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEvidenceFile(null)}
                        className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" />
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Selection */}
      {results.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-[#4B8B32] border-opacity-20 animate-slideIn">
          <Checkbox
            checked={selectedControls.length === results.length}
            onChange={toggleSelectAll}
          />
          <span className="text-sm font-medium" style={{color: selectedControls.length > 0 ? '#4B8B32' : '#666'}}>
            {selectedControls.length > 0 
              ? `${selectedControls.length} contrôle(s) sélectionné(s)` 
              : 'Tout sélectionner'}
          </span>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 animate-slideIn">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-2 block">Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="ID, nom, description..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-700 mb-2 block">Catégorie</Label>
                <Select 
                  value={filters.category} 
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full"
                >
                  <option value="all">Toutes les catégories</option>
                  {Object.entries(ISO27001_CONTROLS).map(([id, cat]) => (
                    <option key={id} value={id}>{id} - {cat.title}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-700 mb-2 block">Statut</Label>
                <Select 
                  value={filters.status} 
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="compliant">✓ Conforme</option>
                  <option value="partial">⚠ Partiel</option>
                  <option value="non-compliant">✗ Non conforme</option>
                  <option value="not-evaluated">○ Non évalué</option>
                </Select>
              </div>
            </div>
            
            {(filters.search || filters.category !== 'all' || filters.status !== 'all') && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Filtres actifs: {[
                    filters.search && 'recherche',
                    filters.category !== 'all' && 'catégorie',
                    filters.status !== 'all' && 'statut'
                  ].filter(Boolean).join(', ')}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setFilters({ category: 'all', status: 'all', search: '' })}
                  className="text-[#4B8B32] hover:bg-green-50"
                >
                  <X className="h-3 w-3 mr-1" />
                  Réinitialiser
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Controls List */}
      <div className="space-y-6">

        {filteredCategories.map(([categoryId, category]) => {
          const categoryControls = category.controls.filter(control => {
            const result = getControlResult(control.id)
            const matchesSearch = filters.search === '' || 
              control.id.toLowerCase().includes(filters.search.toLowerCase()) ||
              control.name.toLowerCase().includes(filters.search.toLowerCase())
            const matchesStatus = filters.status === 'all' || 
              (result?.status === filters.status) ||
              (filters.status === 'not-evaluated' && !result)
            return matchesSearch && matchesStatus
          })

          if (categoryControls.length === 0) return null

          return (
            <div key={categoryId} className="space-y-4 animate-fadeIn">
              <div className="border-l-4 pl-4 transition-all duration-300" style={{ borderLeftColor: category.color }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {categoryId} - {category.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {categoryControls.length} contrôle{categoryControls.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
              
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3' 
                : 'space-y-3'
              }>
                {categoryControls.map((control, index) => {
                  const result = getControlResult(control.id)
                  const status = result?.status || 'not-evaluated'
                  const statusColor = getStatusColor(status)
                  const isEditing = editingControlId === control.id
                  
                  return (
                    <Card 
                      key={control.id}
                      className={`bg-white border-2 border-gray-200 hover:border-[#4B8B32] hover:shadow-xl transition-all duration-300 animate-fadeIn ${
                        viewMode === 'list' ? 'hover-lift-subtle' : 'hover-lift'
                      }`}
                      style={{ 
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <CardHeader className={`bg-gradient-to-r from-green-50/50 to-white ${
                        viewMode === 'list' ? 'py-2' : 'py-2'
                      }`}>
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              checked={selectedControls.includes(control.id)}
                              onChange={() => toggleSelectControl(control.id)}
                              className="mt-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <CardTitle className="text-xs font-semibold text-[#4B8B32]">
                                  {control.id}
                                </CardTitle>
                                <Badge 
                                  variant={getStatusBadgeVariant(status)}
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {getStatusLabel(status)}
                                </Badge>
                              </div>
                              <h5 className="font-medium text-xs text-gray-900">{control.name}</h5>
                              <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-1">{control.description}</p>
                            </div>
                          </div>
                          
                          {!isEditing && (
                            <div className="flex gap-0.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(control, result)}
                                className="h-7 w-7 p-0 hover:bg-[#4B8B32] hover:text-white hover:border-[#4B8B32]"
                                title="Éditer"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDuplicate(control, result)}
                                className="h-7 w-7 p-0 hover:bg-[#2196F3] hover:text-white hover:border-[#2196F3]"
                                title="Dupliquer"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(control, result)}
                                className="h-7 w-7 p-0 hover:bg-[#009688] hover:text-white hover:border-[#009688]"
                                title="Voir"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkComplete(control)}
                                className="h-7 w-7 p-0 text-green-600 border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600"
                                title="Marquer comme conforme"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                              {result && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(control.id)}
                                  className="h-7 w-7 p-0"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      {isEditing && (
                        <Modal open={showEditModal} onClose={handleCancelEdit}>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Statut *</label>
                                <Select
                                  name="status"
                                  value={formData.status}
                                  onChange={handleFormChange}
                                  className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                                >
                                  <option value="not-evaluated">Non évalué</option>
                                  <option value="compliant">Conforme</option>
                                  <option value="partial">Partiellement conforme</option>
                                  <option value="non-compliant">Non conforme</option>
                                </Select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Priorité</label>
                                <Select
                                  name="priority"
                                  value={formData.priority}
                                  onChange={handleFormChange}
                                  className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                                >
                                  <option value="low">Basse</option>
                                  <option value="medium">Moyenne</option>
                                  <option value="high">Haute</option>
                                  <option value="critical">Critique</option>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                              <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleFormChange}
                                rows="2"
                                className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32] resize-none"
                                placeholder="Commentaires ou observations..."
                              ></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t">
                              <button
                                onClick={handleCancelEdit}
                                className="py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                              >
                                <X className="h-3 w-3 inline mr-1" />
                                Annuler
                              </button>
                              <button
                                onClick={handleSave}
                                className="py-1.5 px-3 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-[#4B8B32] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B8B32]"
                              >
                                <Save className="h-3 w-3 inline mr-1" />
                                Enregistrer
                              </button>
                            </div>
                          </div>
                        </Modal>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Controls
