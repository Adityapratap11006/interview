import { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Search, Grid, List, X, Check, Loader2 } from 'lucide-react'
import PageCard from '../components/ui/PageCard'
import ProblemsTable from '../components/problems/ProblemsTable'
import ProblemForm from '../components/problems/ProblemForm'
import { fetchProblems, createProblem, updateProblem, deleteProblem } from '../services/problems'

const difficultyOptions = ['Easy', 'Medium', 'Hard']
const statusOptions = ['Not Started', 'In Progress', 'Solved']

export default function ProblemsPage() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ difficulty: '', status: '', topic: '' })
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedView, setSelectedView] = useState('list')
  const [showForm, setShowForm] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [problemToDelete, setProblemToDelete] = useState(null)
  const [selectedProblems, setSelectedProblems] = useState([])
  const [stats, setStats] = useState({ total: 0, solved: 0, progress: 0 })

  const loadProblems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (filters.difficulty) params.difficulty = filters.difficulty
      if (filters.status) params.status = filters.status
      if (filters.topic) params.topic = filters.topic

      const response = await fetchProblems(params)
      const problemsData = response.data.problems || []
      setProblems(problemsData)
      
      calculateStats(problemsData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load problems')
      console.error('Load problems error:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const calculateStats = useCallback((problemsData) => {
    const total = problemsData.length
    const solved = problemsData.filter(p => p.status === 'Solved').length
    const progress = total > 0 ? Math.round((solved / total) * 100) : 0
    setStats({ total, solved, progress })
  }, [])

  useEffect(() => {
    loadProblems()
  }, [loadProblems])

  const handleSearch = (event) => {
    const query = event.target.value
    setSearchQuery(query)
    
    const timeoutId = setTimeout(() => {
      loadProblems()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    loadProblems()
  }

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    loadProblems()
  }

  const clearFilters = () => {
    setFilters({ difficulty: '', status: '', topic: '' })
    setSearchQuery('')
    setTimeout(() => loadProblems(), 0)
  }

  const getFilteredAndSortedProblems = useMemo(() => {
    let filtered = problems.filter(problem => 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
    )

    filtered.sort((a, b) => {
      let valueA = a[sortBy]
      let valueB = b[sortBy]

      if (sortBy === 'solvedAt') {
        valueA = valueA ? new Date(valueA).getTime() : 0
        valueB = valueB ? new Date(valueB).getTime() : 0
      } else if (sortBy === 'attemptCount' || sortBy === 'revisionCount' || sortBy === 'timeSpentMinutes') {
        valueA = valueA || 0
        valueB = valueB || 0
      }

      if (typeof valueA === 'string') valueA = valueA.toLowerCase()
      if (typeof valueB === 'string') valueB = valueB.toLowerCase()

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [problems, searchQuery, filters, sortBy, sortOrder])

  const handleCreate = async (data) => {
    try {
      const response = await createProblem(data)
      setProblems(prev => [response.data.problem, ...prev])
      setShowForm(false)
      loadProblems()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create problem'
      setError(message)
      console.error('Create problem error:', err)
    }
  }

  const handleUpdate = async (id, data) => {
    try {
      const response = await updateProblem(id, data)
      setProblems(prev => prev.map(p => p._id === id ? response.data.problem : p))
      setSelectedProblem(null)
      setShowForm(false)
      loadProblems()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update problem'
      setError(message)
      console.error('Update problem error:', err)
    }
  }

  const handleDelete = async () => {
    if (!problemToDelete) return
    
    try {
      await deleteProblem(problemToDelete)
      setProblems(prev => prev.filter(p => p._id !== problemToDelete))
      setShowDeleteConfirm(false)
      setProblemToDelete(null)
      setSelectedProblems(prev => prev.filter(id => id !== problemToDelete))
      loadProblems()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete problem'
      setError(message)
      console.error('Delete problem error:', err)
    }
  }

  const openDeleteConfirm = (id) => {
    setProblemToDelete(id)
    setShowDeleteConfirm(true)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setProblemToDelete(null)
  }

  const handleSelectProblem = (id) => {
    setSelectedProblems(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedProblems.length === getFilteredAndSortedProblems.length) {
      setSelectedProblems([])
    } else {
      setSelectedProblems(getFilteredAndSortedProblems.map(p => p._id))
    }
  }

  const clearSelection = () => {
    setSelectedProblems([])
  }

  const hasActiveFilters = searchQuery || filters.difficulty || filters.status || filters.topic

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Problems</h1>
          <p className="text-slate-400 text-sm">Manage your LeetCode problems and track progress</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedView === 'grid' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-slate-400 text-sm">
              <span>{selectedProblems.length} selected</span>
              {selectedProblems.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="p-1 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
          <button
            onClick={() => {
              setSelectedProblem(null)
              setShowForm(true)
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Add Problem
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-[16px] border border-white/10 bg-white/5 p-4">
            <div className="text-slate-400 text-sm mb-1">Total Problems</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="rounded-[16px] border border-white/10 bg-white/5 p-4">
            <div className="text-slate-400 text-sm mb-1">Solved</div>
            <div className="text-2xl font-bold text-cyan-300">{stats.solved}</div>
          </div>
          <div className="rounded-[16px] border border-white/10 bg-white/5 p-4">
            <div className="text-slate-400 text-sm mb-1">Progress</div>
            <div className="text-2xl font-bold text-violet-300">{stats.progress}%</div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-violet-500 h-2 rounded-full"
                style={{ width: `${stats.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <PageCard title="Problem Library" description="Manage and track your practice problems.">
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative flex-1 w-full lg:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, topic, or difficulty..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full lg:w-80 pl-10 pr-4 py-2 rounded-xl bg-[#071122] border border-white/6 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#071122] border border-white/6 text-white focus:outline-none focus:border-cyan-500/30"
                >
                  <option value="">All difficulties</option>
                  {difficultyOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#071122] border border-white/6 text-white focus:outline-none focus:border-cyan-500/30"
                >
                  <option value="">All status</option>
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#071122] border border-white/6 text-white focus:outline-none focus:border-cyan-500/30 appearance-none pr-8"
                  >
                    <option value="createdAt">Sort by: Newest</option>
                    <option value="title">Sort by: Name (A-Z)</option>
                    <option value="difficulty">Sort by: Difficulty</option>
                    <option value="status">Sort by: Status</option>
                    <option value="attemptCount">Sort by: Attempts</option>
                    <option value="revisionCount">Sort by: Revisions</option>
                    <option value="timeSpentMinutes">Sort by: Time Spent</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-xs">
                      {sortOrder === 'desc' ? '↓' : '↑'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedView('list')}
                    className={`p-2 rounded-lg ${selectedView === 'list' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/3 text-slate-400 hover:bg-white/5'}`}
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedView('grid')}
                    className={`p-2 rounded-lg ${selectedView === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/3 text-slate-400 hover:bg-white/5'}`}
                  >
                    <Grid size={18} />
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-sm text-cyan-300 hover:text-cyan-200"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm">
                <p>{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30"
                >
                  Dismiss
                </button>
              </div>
            )}

            {(loading || error) && (
              <div className="p-8 text-center">
                <Loader2 size={24} className="animate-spin mx-auto text-cyan-300" />
                <p className="text-slate-400 mt-2">Loading problems...</p>
              </div>
            )
            }

            {!loading && !error && getFilteredAndSortedProblems.length === 0 && (
              <div className="p-8 text-center rounded-lg border border-dashed border-white/10">
                <Search size={32} className="mx-auto text-slate-500 mb-3" />
                <h3 className="text-white font-medium mb-2">No problems found</h3>
                <p className="text-slate-400 text-sm mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your search or filters to find what you're looking for"
                    : "Start by adding your first problem to begin tracking your progress"
                  }
                </p>
                <button
                  onClick={() => {
                    setSelectedProblem(null)
                    setShowForm(true)
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium hover:scale-105 transition-all inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Problem
                </button>
              </div>
            )}

            {selectedView === 'list' && !loading && !error && getFilteredAndSortedProblems.length > 0 && (
              <ProblemsTable
                data={getFilteredAndSortedProblems}
                loading={loading}
                onEdit={(p) => {
                  setSelectedProblem(p)
                  setShowForm(true)
                }}
                onDelete={openDeleteConfirm}
                selectedProblems={selectedProblems}
                onSelectProblem={handleSelectProblem}
                onSelectAll={handleSelectAll}
              />
            )}

            {selectedView === 'grid' && !loading && !error && getFilteredAndSortedProblems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredAndSortedProblems.map(problem => (
                  <EnhancedProblemCard
                    key={problem._id}
                    problem={problem}
                    onEdit={(p) => {
                      setSelectedProblem(p)
                      setShowForm(true)
                    }}
                    onDelete={openDeleteConfirm}
                    isSelected={selectedProblems.includes(problem._id)}
                    onSelect={handleSelectProblem}
                  />
                ))}
              </div>
            )}
          </div>
        </PageCard>

        {showForm && (
          <ProblemForm
            initial={selectedProblem}
            onClose={() => {
              setShowForm(false)
              setSelectedProblem(null)
            }}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={cancelDelete}
            onConfirm={handleDelete}
            problemTitle={problems.find(p => p._id === problemToDelete)?.title}
          />
        )}
      </div>
    </div>
  )
}
