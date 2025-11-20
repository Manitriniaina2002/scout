import { useState } from 'react'

// Custom hook for managing loading states
export const useLoadingState = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState(null)

  const startLoading = () => {
    setLoading(true)
    setError(null)
  }

  const stopLoading = () => {
    setLoading(false)
  }

  const setErrorState = (errorMessage) => {
    setError(errorMessage)
    setLoading(false)
  }

  const reset = () => {
    setLoading(initialLoading)
    setError(null)
  }

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    reset
  }
}