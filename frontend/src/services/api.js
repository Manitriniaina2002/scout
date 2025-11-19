import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Audit Results
export const getAuditResults = async () => {
  const response = await api.get('/api/audit-results')
  return response.data
}

export const getAuditResult = async (controlId) => {
  const response = await api.get(`/api/audit-results/${controlId}`)
  return response.data
}

export const createAuditResult = async (data) => {
  const response = await api.post('/api/audit-results', data)
  return response.data
}

export const updateAuditResult = async (controlId, data) => {
  const response = await api.put(`/api/audit-results/${controlId}`, data)
  return response.data
}

export const deleteAuditResult = async (controlId) => {
  const response = await api.delete(`/api/audit-results/${controlId}`)
  return response.data
}

// Statistics
export const getStatistics = async () => {
  const response = await api.get('/api/statistics')
  return response.data
}

// Risks
export const getRisks = async () => {
  const response = await api.get('/api/risks')
  return response.data
}

export const getRisk = async (riskId) => {
  const response = await api.get(`/api/risks/${riskId}`)
  return response.data
}

export const updateRiskStatus = async (riskId, status) => {
  const response = await api.put(`/api/risks/${riskId}/status`, { status })
  return response.data
}

// History
export const getHistory = async (controlId = null) => {
  const url = controlId ? `/api/history/${controlId}` : '/api/history'
  const response = await api.get(url)
  return response.data
}

// Health check
export const checkHealth = async () => {
  const response = await api.get('/api/health')
  return response.data
}

export default api
