import { toast } from 'react-hot-toast'
import { useCallback } from 'react'

export function useProblemAPI() {
  const getToken = useCallback(() => {
    return localStorage.getItem('prepPilotToken') || sessionStorage.getItem('prepPilotToken')
  }, [])

  const apiRequest = useCallback(async (url, method = 'GET', body = null) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'API request failed')
    }

    return response.json()
  }, [])

  const createProblem = useCallback(async (data) => {
    const response = await apiRequest('http://localhost:3000/api/problems', 'POST', data)
    return response
  }, [apiRequest])

  const updateProblem = useCallback(async (id, data) => {
    const response = await apiRequest(`http://localhost:3000/api/problems/${id}`, 'PATCH', data)
    return response
  }, [apiRequest])

  const deleteProblem = useCallback(async (id) => {
    await apiRequest(`http://localhost:3000/api/problems/${id}`, 'DELETE')
  }, [apiRequest])

  const bulkUpdate = useCallback(async (selectedIds, updates) => {
    const response = await apiRequest('http://localhost:3000/api/problems/bulk-update', 'PATCH', {
      ids: selectedIds,
      updates
    })
    return response
  }, [apiRequest])

  const bulkDelete = useCallback(async (selectedIds) => {
    const response = await apiRequest('http://localhost:3000/api/problems/bulk-delete', 'DELETE', {
      ids: selectedIds
    })
    return response
  }, [apiRequest])

  const addToStudyList = useCallback(async (selectedIds, studyListId) => {
    const response = await apiRequest('http://localhost:3000/api/problems/add-to-study-list', 'POST', {
      problemIds: selectedIds,
      studyListId
    })
    return response
  }, [apiRequest])

  return {
    createProblem,
    updateProblem,
    deleteProblem,
    bulkUpdate,
    bulkDelete,
    addToStudyList
  }
}

export default useProblemAPI