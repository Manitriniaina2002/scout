import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { getHistory } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Badge } from '../components/ui/badge'

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
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Clock className="w-8 h-8 text-primary flex-shrink-0" />
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Historique des modifications</h2>
          <p className="mt-2 text-sm text-gray-600">Traçabilité complète des actions et modifications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique détaillé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Contrôle</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {formatDate(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.controlId}</Badge>
                    </TableCell>
                    <TableCell>{entry.action}</TableCell>
                    <TableCell>
                      {entry.oldStatus && entry.newStatus ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            {entry.oldStatus}
                          </Badge>
                          <span className="text-gray-400">→</span>
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            {entry.newStatus}
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="secondary">N/A</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {entry.user}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {entry.notes ? (
                        <p className="text-sm text-gray-600 truncate" title={entry.notes}>
                          {entry.notes}
                        </p>
                      ) : (
                        <span className="text-gray-400 text-sm">Aucune note</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {history.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                Aucun historique disponible
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default History
