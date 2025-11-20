import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, User, Shield, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { getUsers, createUser, updateUser, deleteUser } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import Modal from '../components/ui/modal'
import { useAuth } from '../contexts/AuthContext'
import { COLORS, MESSAGES } from '../lib/constants'
import { useLoadingState } from '../hooks'

function UserManagement() {
  const { user: currentUser } = useAuth()
  const { loading, error, startLoading, stopLoading, setErrorState } = useLoadingState(true)
  const [users, setUsers] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      startLoading()
      const data = await getUsers()
      setUsers(data)
      stopLoading()
    } catch (err) {
      setErrorState('Erreur lors du chargement des utilisateurs')
      console.error(err)
    }
  }

  const handleAddUser = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user'
    })
    setShowAddModal(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Don't pre-fill password for security
      role: user.role
    })
    setShowEditModal(true)
  }

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    try {
      let dataToSend = formData
      
      // For updates, don't send empty password
      if (!showAddModal && !formData.password) {
        dataToSend = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        }
      }
      
      if (showAddModal) {
        await createUser(dataToSend)
        toast.success('Utilisateur créé avec succès')
      } else {
        await updateUser(editingUser.id, dataToSend)
        toast.success('Utilisateur modifié avec succès')
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setEditingUser(null)
      setFormData({ username: '', email: '', password: '', role: 'user' })
      await loadUsers()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de la sauvegarde')
      console.error(err)
    }
  }

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser.id) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte')
      return
    }

    toast('Êtes-vous sûr ?', {
      description: `Cette action supprimera définitivement l'utilisateur ${user.username}.`,
      action: {
        label: 'Supprimer',
        onClick: async () => {
          try {
            await deleteUser(user.id)
            await loadUsers()
            toast.success('Utilisateur supprimé')
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

  const handleCancel = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setEditingUser(null)
    setFormData({ username: '', email: '', password: '', role: 'user' })
  }

  const getRoleIcon = (role) => {
    return role === 'admin' ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />
  }

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] animate-fadeIn">
      <div className="text-center">
        <div className="spinner inline-block h-12 w-12"></div>
        <p className="mt-4 text-sm font-medium" style={{color: COLORS.primary}}>{MESSAGES.loading.users}</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Gestion des Utilisateurs</h2>
          <p className="mt-2 text-sm text-gray-600">Administrer les comptes utilisateurs et leurs permissions</p>
        </div>
        <Button
          onClick={handleAddUser}
          className={`bg-gradient-to-r ${COLORS.primaryGradient} hover:${COLORS.primaryGradientHover} text-white w-full sm:w-auto`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Utilisateur
        </Button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {users.map((user) => (
          <Card key={user.id} className="bg-white border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-102 active:scale-98">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="h-12 w-12 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-base truncate">{user.username}</CardTitle>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>
                <Badge className={`${getRoleColor(user.role)} flex items-center gap-1 self-start sm:self-center flex-shrink-0`}>
                  {getRoleIcon(user.role)}
                  <span className="hidden sm:inline">{user.role === 'admin' ? 'Admin' : 'Utilisateur'}</span>
                  <span className="sm:hidden">{user.role === 'admin' ? 'Admin' : 'User'}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditUser(user)}
                  className="flex-1 h-10 hover:bg-primary hover:text-white hover:border-primary touch-manipulation"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  <span className="font-medium">Modifier</span>
                </Button>
                {user.id !== currentUser.id && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteUser(user)}
                    className="flex-1 h-10 touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="font-medium">Supprimer</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={handleCancel}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nouveau Utilisateur</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="username">Nom d&apos;utilisateur *</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Créer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal open={showEditModal} onClose={handleCancel}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Modifier Utilisateur</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="username">Nom d&apos;utilisateur *</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Nouveau mot de passe (laisser vide pour garder l&apos;actuel)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Modifier
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserManagement