import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bookmark, Loader2, Trash2, BookOpen } from 'lucide-react'
import EnhancedProblemCard from '../components/problems/EnhancedProblemCard'
import DeleteConfirmationModal from '../components/ui/DeleteConfirmationModal'
import { fetchStudyList, removeProblemFromList } from '../services/studyLists'
import { deleteProblem } from '../services/problems'
import { toast } from '../utils/toast'

export default function StudyListDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removing, setRemoving] = useState(null)
  const [deleteProblemTarget, setDeleteProblemTarget] = useState(null)
  const [selectedProblems, setSelectedProblems] = useState([])

  const loadList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchStudyList(id)
      setList(res.data.studyList)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load study list')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { loadList() }, [loadList])

  const handleRemoveProblem = async (problemId) => {
    setRemoving(problemId)
    try {
      await removeProblemFromList(id, problemId)
      setList(prev => ({
        ...prev,
        problems: prev.problems.filter(p => p._id !== problemId),
      }))
      toast('Problem removed from list')
    } catch (err) {
      console.error('Remove problem error:', err)
    } finally {
      setRemoving(null)
    }
  }

  const handleDeleteProblem = async () => {
    if (!deleteProblemTarget) return
    try {
      await deleteProblem(deleteProblemTarget)
      setList(prev => ({
        ...prev,
        problems: prev.problems.filter(p => p._id !== deleteProblemTarget),
      }))
      toast('Problem deleted')
    } catch (err) {
      console.error('Delete problem error:', err)
    }
    setDeleteProblemTarget(null)
  }

  const handleEditProblem = (problem) => {
    navigate('/problems', { state: { editProblem: problem } })
  }

  const solved = list?.problems?.filter(p => p.status === 'Solved').length || 0
  const total = list?.problems?.length || 0
  const progress = total > 0 ? Math.round((solved / total) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-cyan-300" />
      </div>
    )
  }

  if (error || !list) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-300 mb-4">{error || 'Study list not found'}</p>
        <button onClick={() => navigate('/study-lists')} className="text-cyan-300 hover:underline text-sm">
          Back to study lists
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <button
        onClick={() => navigate('/study-lists')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to Study Lists</span>
      </button>

      <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/5 to-white/3 p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${list.color || '#22d3ee'}20`, color: list.color || '#22d3ee' }}
          >
            <Bookmark size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-white">{list.name}</h1>
            {list.description && (
              <p className="text-slate-400 mt-1">{list.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/3 border border-white/5 p-4">
            <div className="text-slate-400 text-xs mb-1">Total Problems</div>
            <div className="text-xl font-bold text-white">{total}</div>
          </div>
          <div className="rounded-xl bg-white/3 border border-white/5 p-4">
            <div className="text-slate-400 text-xs mb-1">Solved</div>
            <div className="text-xl font-bold text-cyan-300">{solved}</div>
          </div>
          <div className="rounded-xl bg-white/3 border border-white/5 p-4">
            <div className="text-slate-400 text-xs mb-1">Remaining</div>
            <div className="text-xl font-bold text-violet-300">{total - solved}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
            />
          </div>
        </div>
      </div>

      {total === 0 ? (
        <div className="text-center py-16 rounded-[28px] border border-dashed border-white/10 bg-white/3">
          <BookOpen size={40} className="mx-auto text-slate-500 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No problems yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Add problems to this list from the Problems page using the "Add to Study List" option
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.problems.map(problem => (
            <div key={problem._id} className="relative group/card">
              {removing === problem._id && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 rounded-[24px]">
                  <Loader2 size={20} className="animate-spin text-cyan-300" />
                </div>
              )}
              <EnhancedProblemCard
                problem={problem}
                onEdit={handleEditProblem}
                onDelete={setDeleteProblemTarget}
                isSelected={selectedProblems.includes(problem._id)}
                onSelect={(pid) => setSelectedProblems(prev =>
                  prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]
                )}
              />
              <button
                onClick={() => handleRemoveProblem(problem._id)}
                className="absolute -top-2 -right-2 z-10 p-1.5 rounded-full bg-rose-500/80 text-white opacity-0 group-hover/card:opacity-100 hover:bg-rose-500 transition-all shadow-lg"
                title="Remove from list"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deleteProblemTarget}
        onClose={() => setDeleteProblemTarget(null)}
        onConfirm={handleDeleteProblem}
        problemTitle={
          list.problems.find(p => p._id === deleteProblemTarget)?.title || 'this problem'
        }
      />
    </div>
  )
}
