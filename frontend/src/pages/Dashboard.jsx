import { useState, useEffect } from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { TrendingUp, CheckCircle, AlertCircle, XCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { getStatistics } from '../services/api'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const data = await getStatistics()
      setStats(data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des statistiques')
      console.error(err)
    } finally {
      setLoading(false)
    }
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
  
  if (!stats) return (
    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
      <p className="text-sm text-yellow-800">Aucune donnée disponible</p>
    </div>
  )

  const statusData = {
    labels: ['Conforme', 'Partiel', 'Non conforme', 'Non évalué'],
    datasets: [{
      data: [
        stats.compliant || 0,
        stats.partial || 0,
        stats.nonCompliant || 0,
        stats.notEvaluated || 0
      ],
      backgroundColor: ['#4B8B32', '#2196F3', '#d32f2f', '#9CA3AF'],
      borderWidth: 0,
    }]
  }

  const categoryData = {
    labels: stats.byCategory?.map(c => c.category) || [],
    datasets: [
      {
        label: 'Conforme',
        data: stats.byCategory?.map(c => c.compliant) || [],
        backgroundColor: '#4B8B32',
      },
      {
        label: 'Partiel',
        data: stats.byCategory?.map(c => c.partial) || [],
        backgroundColor: '#2196F3',
      },
      {
        label: 'Non conforme',
        data: stats.byCategory?.map(c => c.nonCompliant) || [],
        backgroundColor: '#d32f2f',
      }
    ]
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total || 0,
      icon: FileText,
      color: "neutral",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600"
    },
    {
      title: "Conforme",
      value: stats.compliant || 0,
      icon: CheckCircle,
      color: "success",
      bgColor: "bg-primary-50",
      iconColor: "text-primary-600"
    },
    {
      title: "Partiel",
      value: stats.partial || 0,
      icon: AlertCircle,
      color: "warning",
      bgColor: "bg-secondary-50",
      iconColor: "text-secondary-600"
    },
    {
      title: "Non-conforme",
      value: stats.nonCompliant || 0,
      icon: XCircle,
      color: "danger",
      bgColor: "bg-accent-50",
      iconColor: "text-accent-600"
    },
    {
      title: "Score Global",
      value: `${stats.complianceScore || 0}%`,
      icon: TrendingUp,
      color: "primary",
      bgColor: "bg-primary-50",
      iconColor: "text-primary-600"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Vue d&apos;ensemble</h2>
        <p className="mt-2 text-sm text-gray-600">Tableau de bord de conformité ISO 27001:2022</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className="border-t-4" style={{ borderTopColor: card.color === 'primary' ? '#4B8B32' : card.color === 'warning' ? '#2196F3' : card.color === 'danger' ? '#d32f2f' : '#9CA3AF' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

    </div>
  )
}

export default Dashboard
