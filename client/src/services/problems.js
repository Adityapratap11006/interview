import api from './api'

export const fetchProblems = (params) => api.get('/problems', { params })
export const fetchProblem = (id) => api.get(`/problems/${id}`)
export const createProblem = (data) => api.post('/problems', data)
export const updateProblem = (id, data) => api.patch(`/problems/${id}`, data)
export const deleteProblem = (id) => api.delete(`/problems/${id}`)

export default {
  fetchProblems,
  fetchProblem,
  createProblem,
  updateProblem,
  deleteProblem,
}
