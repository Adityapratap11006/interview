import api from './api'

export const fetchStudyLists = () => api.get('/study-lists')
export const fetchStudyList = (id) => api.get(`/study-lists/${id}`)
export const createStudyList = (data) => api.post('/study-lists', data)
export const updateStudyList = (id, data) => api.patch(`/study-lists/${id}`, data)
export const deleteStudyList = (id) => api.delete(`/study-lists/${id}`)
export const addProblemToList = (listId, problemId) => api.post(`/study-lists/${listId}/problems`, { problemId })
export const removeProblemFromList = (listId, problemId) => api.delete(`/study-lists/${listId}/problems/${problemId}`)
