import { useState, useEffect } from 'react'
import { Search, Edit2, Trash2, Save, X, Plus, Download, Upload, FileUp, Copy, Archive, Eye, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { getAuditResults, deleteAuditResult, createAuditResult, updateAuditResult } from '../services/api'
import { ISO27001_CONTROLS, getStatusColor, getStatusLabel } from '../data/controls'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Checkbox } from '../components/ui/checkbox'

function Controls() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: ''
  })
  const [editingControlId, setEditingControlId] = useState(null)
  const [formData, setFormData] = useState({})
  const [selectedControls, setSelectedControls] = useState([])
  const [showAddNew, setShowAddNew] = useState(false)
  const [evidenceFile, setEvidenceFile] = useState(null)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const data = await getAuditResults()
      setResults(data.results || [])
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des contrôles')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (control, result) => {
    setEditingControlId(control.id)
    setShowAddNew(false)
    setFormData({
      controlId: control.id,
      status: result?.status || 'not-evaluated',
      evaluatedBy: result?.evaluatedBy || '',
      evaluationDate: result?.evaluationDate || new Date().toISOString().split('T')[0],
      notes: result?.notes || '',
      evidence: result?.evidence || '',
      priority: result?.priority || 'medium',
      responsiblePerson: result?.responsiblePerson || '',
      implementationCost: result?.implementationCost || '',
      timeline: result?.timeline || ''
    })
    setEvidenceFile(null)
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
    setSelectedControls(prev => 
      prev.includes(controlId) 
        ? prev.filter(id => id !== controlId)
        : [...prev, controlId]
    )
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Contrôles ISO 27001:2022</h2>
          <p className="mt-2 text-sm text-gray-600">Annexe A - Gestion et évaluation des contrôles de sécurité</p>
        </div>
        <div className="flex gap-2 animate-fadeIn">
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
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

      {/* Add New Control Form */}
      {showAddNew && (
        <Card className="border-2 border-[#4B8B32] shadow-lg animate-slideIn hover-lift">
          <CardHeader>
            <CardTitle>Nouveau Contrôle Personnalisé</CardTitle>
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un contrôle..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="pl-10"
          />
        </div>

        <Select 
          value={filters.category} 
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="all">Toutes les catégories</option>
          {Object.entries(ISO27001_CONTROLS).map(([id, cat]) => (
            <option key={id} value={id}>{id} - {cat.title}</option>
          ))}
        </Select>

        <Select 
          value={filters.status} 
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="all">Tous les statuts</option>
          <option value="compliant">Conforme</option>
          <option value="partial">Partiel</option>
          <option value="non-compliant">Non conforme</option>
          <option value="not-evaluated">Non évalué</option>
        </Select>
      </div>

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
                <h3 className="text-xl font-semibold text-gray-900">
                  {categoryId} - {category.title}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryControls.map((control, index) => {
                  const result = getControlResult(control.id)
                  const status = result?.status || 'not-evaluated'
                  const statusColor = getStatusColor(status)
                  const isEditing = editingControlId === control.id
                  
                  return (
                    <Card 
                      key={control.id}
                      className="border-l-4 hover:shadow-xl transition-all duration-300 hover-lift animate-fadeIn"
                      style={{ 
                        borderLeftColor: statusColor,
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={selectedControls.includes(control.id)}
                            onChange={() => toggleSelectControl(control.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-sm font-semibold" style={{color: '#4B8B32'}}>
                              {control.id}
                            </CardTitle>
                            <h5 className="font-medium text-sm text-gray-900 mt-1">{control.name}</h5>
                            <p className="text-xs text-gray-600 mt-1">{control.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Statut *
                                </label>
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
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Priorité
                                </label>
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
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Évalué par *
                                </label>
                                <input
                                  type="text"
                                  name="evaluatedBy"
                                  value={formData.evaluatedBy}
                                  onChange={handleFormChange}
                                  className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Responsable
                                </label>
                                <input
                                  type="text"
                                  name="responsiblePerson"
                                  value={formData.responsiblePerson}
                                  onChange={handleFormChange}
                                  className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Date *
                                </label>
                                <input
                                  type="date"
                                  name="evaluationDate"
                                  value={formData.evaluationDate}
                                  onChange={handleFormChange}
                                  className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Coût de mise en œuvre
                                </label>
                                <input
                                  type="text"
                                  name="implementationCost"
                                  value={formData.implementationCost}
                                  onChange={handleFormChange}
                                  placeholder="Ex: 5000 EUR"
                                  className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Délai
                                </label>
                                <input
                                  type="text"
                                  name="timeline"
                                  value={formData.timeline}
                                  onChange={handleFormChange}
                                  placeholder="Ex: 3 mois"
                                  className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Notes
                              </label>
                              <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleFormChange}
                                rows="2"
                                className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32] resize-none"
                              ></textarea>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Preuves
                              </label>
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  name="evidence"
                                  value={formData.evidence}
                                  onChange={handleFormChange}
                                  placeholder="Liens, références..."
                                  className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]"
                                />
                                <div className="flex items-center gap-2">
                                  <label className="cursor-pointer flex-1">
                                    <div className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors">
                                      <FileUp className="h-4 w-4 text-gray-400" />
                                      <span className="text-xs text-gray-600">
                                        {evidenceFile ? evidenceFile.name : 'Télécharger un fichier'}
                                      </span>
                                    </div>
                                    <input type="file" onChange={handleFileChange} className="hidden" />
                                  </label>
                                  {evidenceFile && (
                                    <Button variant="ghost" size="sm" onClick={() => setEvidenceFile(null)}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
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
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <Badge variant={getStatusBadgeVariant(status)}>
                                {getStatusLabel(status)}
                              </Badge>
                              {result?.evaluatedBy && (
                                <span className="text-xs text-gray-500">
                                  Par {result.evaluatedBy} le {new Date(result.evaluationDate).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </CardContent>
                      {!isEditing && (
                        <CardFooter className="pt-3 border-t flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(control, result)}
                            className="flex-1 min-w-[100px]"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Éditer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDuplicate(control, result)}
                            className="flex-1 min-w-[100px]"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Dupliquer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(control, result)}
                            className="flex-1 min-w-[100px]"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkComplete(control)}
                            className="flex-1 min-w-[100px] text-green-600 hover:bg-green-50 hover:text-green-700"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Conforme
                          </Button>
                          {result && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(control.id)}
                              className="flex-1 min-w-[100px]"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          )}
                        </CardFooter>
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
