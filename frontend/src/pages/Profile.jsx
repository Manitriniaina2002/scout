import { useState, useEffect } from 'react'
import { User, Mail, Lock, Save } from 'lucide-react'
import { toast } from 'sonner'
import { getProfile, updateProfile, changePassword } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useAuth } from '../contexts/AuthContext'
import { COLORS, MESSAGES, VALIDATION } from '../lib/constants'
import { useLoadingState } from '../hooks'

function Profile() {
  const { user, setUser } = useAuth()
  const { loading, error, startLoading, stopLoading, setErrorState } = useLoadingState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      startLoading()
      const data = await getProfile()
      setProfileData({
        username: data.username,
        email: data.email
      })
      stopLoading()
    } catch (err) {
      setErrorState('Erreur lors du chargement du profil')
      console.error(err)
    }
  }

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const updatedUser = await updateProfile(profileData)
      setUser(updatedUser)
      toast.success('Profil mis à jour avec succès')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de la mise à jour du profil')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordData.newPassword.length < VALIDATION.password.minLength) {
      toast.error(`Le nouveau mot de passe doit contenir au moins ${VALIDATION.password.minLength} caractères`)
      return
    }

    try {
      setSaving(true)
      await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      toast.success('Mot de passe changé avec succès')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors du changement de mot de passe')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] animate-fadeIn">
      <div className="text-center">
        <div className="spinner inline-block h-12 w-12"></div>
        <p className="mt-4 text-sm font-medium" style={{color: COLORS.primary}}>{MESSAGES.loading.profile}</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="rounded-lg bg-red-50 border-2 border-red-500 p-4 animate-shake">
      <p className="text-sm font-medium text-red-800">{error}</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
      {/* Page Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Mon Profil</h2>
        <p className="mt-2 text-sm text-gray-600">Gérer vos informations personnelles et votre mot de passe</p>
      </div>

      {/* Profile Information Card */}
      <Card className="bg-white border-2 border-gray-200 hover:border-primary transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-5 w-5 sm:h-6 sm:w-6" />
            Informations Personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium">Nom d&apos;utilisateur *</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={profileData.username}
                onChange={handleProfileChange}
                required
                className="h-11 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className={`bg-gradient-to-r ${COLORS.primaryGradient} hover:${COLORS.primaryGradientHover} text-white`}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="bg-white border-2 border-gray-200 hover:border-primary transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Changer le Mot de Passe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="currentPassword">Mot de passe actuel *</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Nouveau mot de passe *</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={VALIDATION.password.minLength}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={VALIDATION.password.minLength}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              disabled={saving}
              className={`bg-gradient-to-r ${COLORS.primaryGradient} hover:${COLORS.primaryGradientHover} text-white`}
            >
              <Lock className="h-4 w-4 mr-2" />
              {saving ? 'Changement...' : 'Changer le Mot de Passe'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information Card */}
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informations du Compte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Rôle:</span>
              <span className="ml-2 text-gray-600">{user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date de création:</span>
              <span className="ml-2 text-gray-600">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile