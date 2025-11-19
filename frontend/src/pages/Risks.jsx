import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { getRisks } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

function Risks() {
  const [risks, setRisks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadRisks()
  }, [])

  const loadRisks = async () => {
    try {
      setLoading(true)
      const data = await getRisks()
      setRisks(data.risks || [])
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des risques')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      'CRITICAL': '#c0392b',
      'HIGH': '#FF5722',
      'MEDIUM': '#FFC107',
      'LOW': '#4B8B32'
    }
    return colors[severity] || '#9CA3AF'
  }

  const getSeverityBadgeVariant = (severity) => {
    const variants = {
      'CRITICAL': 'danger',
      'HIGH': 'danger',
      'MEDIUM': 'warning',
      'LOW': 'success'
    }
    return variants[severity] || 'outline'
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-2 text-sm text-gray-600">Chargement...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
      <p className="text-sm text-red-800">{error}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-8 h-8 text-accent" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Risques identifiés - ADES</h2>
          <p className="mt-2 text-sm text-gray-600">Analyse et suivi des risques de sécurité</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {risks.map(risk => (
          <Card 
            key={risk.id} 
            className="border-l-4 hover:shadow-md transition-shadow"
            style={{ borderLeftColor: getSeverityColor(risk.severity) }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-semibold text-primary">
                  {risk.id}
                </CardTitle>
                <Badge variant={risk.status === 'open' ? 'danger' : 'success'}>
                  {risk.status === 'open' ? 'Ouvert' : 'Résolu'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <h4 className="font-semibold text-base text-gray-900">{risk.title}</h4>
              <p className="text-sm text-gray-600">{risk.description}</p>
              <div className="flex items-center justify-between pt-3 border-t">
                <Badge variant={getSeverityBadgeVariant(risk.severity)}>
                  {risk.severity}
                </Badge>
                {risk.linkedControls && risk.linkedControls.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {risk.linkedControls.length} contrôle(s)
                  </span>
                )}
              </div>
              {risk.linkedControls && risk.linkedControls.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-gray-700 mb-1">Contrôles liés:</p>
                  <div className="flex flex-wrap gap-1">
                    {risk.linkedControls.map(controlId => (
                      <span 
                        key={controlId}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700"
                      >
                        {controlId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Risks
