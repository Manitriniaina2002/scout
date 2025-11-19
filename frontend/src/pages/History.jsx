import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { getHistory } from '../services/api'
import { Card, CardContent } from '../components/ui/card'

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await getHistory()
      setHistory(data.history || [])
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement de l\'historique')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <Clock className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Historique des modifications</h2>
          <p className="mt-2 text-sm text-gray-600">Traçabilité complète des actions et modifications</p>
        </div>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={index} className="relative pl-12">
              {/* Timeline dot */}
              <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-primary ring-4 ring-white"></div>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="font-semibold text-primary">{entry.controlId}</h3>
                    <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">
                    <strong className="font-medium">{entry.action}</strong>
                    {entry.oldStatus && entry.newStatus && (
                      <span className="text-gray-600">
                        {' '}: <span className="text-red-600">{entry.oldStatus}</span> → <span className="text-green-600">{entry.newStatus}</span>
                      </span>
                    )}
                  </p>
                  {entry.notes && (
                    <p className="text-sm text-gray-600 italic mt-2 pl-4 border-l-2 border-gray-200">
                      {entry.notes}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Par {entry.user}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default History
