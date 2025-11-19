import { useState, useEffect } from 'react'
import { Search, Edit2, Trash2, Save, X, Plus, Download, Upload, FileUp, Filter, Grid3x3, List, CheckCircle, AlertCircle, XCircle, FileText, TrendingUp, Copy, Archive, Eye, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Checkbox } from '../components/ui/checkbox'
import Modal from '../components/ui/modal'

function Vulnerabilite() {
  // Use similar state and logic as Controls page
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({ search: '' })
  const [editingId, setEditingId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({})
  const [showAddNew, setShowAddNew] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setItems([
        { id: 'VULN-001', name: 'Injection SQL', description: 'Failles d’injection dans les formulaires', status: 'not-evaluated', priority: 'high', notes: '' },
        { id: 'VULN-002', name: 'XSS', description: 'Cross-site scripting', status: 'partial', priority: 'medium', notes: '' },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      id: item.id,
      status: item.status,
      priority: item.priority,
      notes: item.notes || '',
    })
    setShowEditModal(true)
  }

  const handleAddNew = () => {
    setShowAddNew(true)
    setEditingId(null)
    setFormData({ id: '', name: '', description: '', status: 'not-evaluated', priority: 'medium', notes: '' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setShowEditModal(false)
    setShowAddNew(false)
    setFormData({})
  }

  const handleSave = () => {
    if (showAddNew) {
      setItems(prev => [...prev, formData])
      toast.success('Vulnérabilité ajoutée')
    } else {
      setItems(prev => prev.map(i => i.id === editingId ? { ...i, ...formData } : i))
      toast.success('Vulnérabilité modifiée')
    }
    setShowAddNew(false)
    setEditingId(null)
    setShowEditModal(false)
    setFormData({})
  }

  const handleDelete = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Vulnérabilité supprimée')
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] animate-fadeIn">
      <div className="text-center">
        <div className="spinner inline-block h-12 w-12"></div>
        <p className="mt-4 text-sm font-medium" style={{color: '#4B8B32'}}>Chargement des vulnérabilités...</p>
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Vulnérabilités</h2>
          <p className="mt-2 text-sm text-gray-600">Gestion des vulnérabilités ADES</p>
        </div>
        <div className="flex gap-2 animate-fadeIn">
          <Button onClick={handleAddNew} className="bg-gradient-to-r from-[#4B8B32] to-green-600 hover:from-green-700 hover:to-green-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Vulnérabilité
          </Button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map(item => (
          <Card key={item.id} className="bg-white border-2 border-gray-200 hover:border-[#4B8B32] hover:shadow-xl transition-all duration-300 animate-fadeIn">
            <CardHeader className="bg-gradient-to-r from-green-50/50 to-white py-2">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xs font-semibold text-[#4B8B32]">{item.id}</CardTitle>
                  <h5 className="font-medium text-xs text-gray-900">{item.name}</h5>
                  <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-1">{item.description}</p>
                </div>
                <div className="flex gap-0.5">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="h-7 w-7 p-0 hover:bg-[#4B8B32] hover:text-white hover:border-[#4B8B32]" title="Éditer">
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="h-7 w-7 p-0" title="Supprimer">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {/* Edit Modal */}
            {editingId === item.id && (
              <Modal open={showEditModal} onClose={handleCancelEdit}>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Statut *</label>
                      <Select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]">
                        <option value="not-evaluated">Non évalué</option>
                        <option value="compliant">Conforme</option>
                        <option value="partial">Partiellement conforme</option>
                        <option value="non-compliant">Non conforme</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Priorité</label>
                      <Select name="priority" value={formData.priority} onChange={handleFormChange} className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]">
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                        <option value="critical">Critique</option>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows="2" className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32] resize-none" placeholder="Commentaires ou observations..." />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button onClick={handleCancelEdit} className="py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      <X className="h-3 w-3 inline mr-1" />
                      Annuler
                    </button>
                    <button onClick={handleSave} className="py-1.5 px-3 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-[#4B8B32] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B8B32]">
                      <Save className="h-3 w-3 inline mr-1" />
                      Enregistrer
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </Card>
        ))}
      </div>
      {/* Add New Modal */}
      {showAddNew && (
        <Modal open={showAddNew} onClose={handleCancelEdit}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ID *</label>
                <Input name="id" value={formData.id} onChange={handleFormChange} placeholder="Ex: VULN-003" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                <Input name="name" value={formData.name} onChange={handleFormChange} placeholder="Nom de la vulnérabilité" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <Input name="description" value={formData.description} onChange={handleFormChange} placeholder="Description" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Statut *</label>
                <Select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]">
                  <option value="not-evaluated">Non évalué</option>
                  <option value="compliant">Conforme</option>
                  <option value="partial">Partiellement conforme</option>
                  <option value="non-compliant">Non conforme</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priorité</label>
                <Select name="priority" value={formData.priority} onChange={handleFormChange} className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32]">
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                  <option value="critical">Critique</option>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows="2" className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B8B32] focus:border-[#4B8B32] resize-none" placeholder="Commentaires ou observations..." />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={handleCancelEdit} className="py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <X className="h-3 w-3 inline mr-1" />
                Annuler
              </button>
              <button onClick={handleSave} className="py-1.5 px-3 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-[#4B8B32] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B8B32]">
                <Save className="h-3 w-3 inline mr-1" />
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Vulnerabilite;
