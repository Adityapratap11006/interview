import { motion } from 'framer-motion'
import { Check, Clock, ExternalLink, FileText, RotateCw, Trash2, Edit2, X, ListPlus } from 'lucide-react'
import { useState } from 'react'

export default function EnhancedProblemCard({ problem, onEdit, onDelete, isSelected, onSelect, onAddToStudyList }) {
  const [showNotes, setShowNotes] = useState(false)
  const [optimisticStatus, setOptimisticStatus] = useState(problem.status)
  const [optimisticAttempts, setOptimisticAttempts] = useState(problem.attemptCount)
  const [optimisticRevisions, setOptimisticRevisions] = useState(problem.revisionCount)

  const formatDate = (dateString) => {
    if (!dateString) return 'Not solved'
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'Hard':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved':
        return 'bg-cyan-500/20 text-cyan-300'
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300'
      case 'Not Started':
        return 'bg-slate-500/20 text-slate-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  const handleStatusToggle = async (newStatus) => {
    if (newStatus === problem.status) return
    
    setOptimisticStatus(newStatus)
    
    try {
      const response = await fetch(`/api/problems/${problem._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('prepPilotToken') || sessionStorage.getItem('prepPilotToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) throw new Error('Failed to update status')
    } catch (error) {
      setOptimisticStatus(problem.status)
      console.error('Status update failed:', error)
    }
  }

  const handleMarkSolved = () => {
    handleStatusToggle('Solved')
  }

  const handleMarkInProgress = () => {
    handleStatusToggle('In Progress')
  }

  const handleMarkRevision = async () => {
    const newRevisionCount = optimisticRevisions + 1
    setOptimisticRevisions(newRevisionCount)
    
    try {
      const response = await fetch(`/api/problems/${problem._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('prepPilotToken') || sessionStorage.getItem('prepPilotToken')}`
        },
        body: JSON.stringify({ revisionCount: newRevisionCount })
      })
      
      if (!response.ok) throw new Error('Failed to update revision count')
    } catch (error) {
      setOptimisticRevisions(problem.revisionCount)
      console.error('Revision update failed:', error)
    }
  }

  const handleEdit = () => {
    onEdit(problem)
  }

  const handleDelete = () => {
    onDelete(problem._id)
  }

  const handleNotesToggle = () => {
    setShowNotes(!showNotes)
  }

  const handleLeetCodeOpen = () => {
    if (problem.leetcodeLink) {
      window.open(problem.leetcodeLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative rounded-[24px] border border-white/10 bg-gradient-to-br from-white/5 to-white/3 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl hover:shadow-[0_30px_100px_rgba(34,211,238,0.15)] transition-all duration-300 hover:border-cyan-500/20"
    >
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(problem._id)}
          className="w-5 h-5 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400 focus:ring-2"
        />
      </div>

      <div className="space-y-5 pl-8">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
              {problem.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>#{problem.attemptCount}</span>
              <span>•</span>
              <span>{problem.topic}</span>
              <span>•</span>
              <span>Last solved: {formatDate(problem.solvedAt)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}
            >
              {problem.difficulty}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(optimisticStatus)}`}
            >
              {optimisticStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
          <div className="text-center">
            <div className="text-slate-400 text-xs mb-1">Time Spent</div>
            <div className="text-white font-semibold text-sm">
              {problem.timeSpentMinutes || 0}m
              {problem.timeSpentMinutes > 60 && (
                <span className="text-slate-500 text-xs ml-1">
                  ({Math.floor((problem.timeSpentMinutes || 0) / 60)}h)
                </span>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-400 text-xs mb-1">Attempts</div>
            <div className="text-white font-semibold text-sm">
              {optimisticAttempts} {optimisticAttempts > 1 ? 'tries' : 'try'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-400 text-xs mb-1">Revisions</div>
            <div className="text-white font-semibold text-sm">
              {optimisticRevisions} {optimisticRevisions !== 1 ? 'revisions' : 'revision'}
            </div>
          </div>
        </div>

        {problem.notes && (
          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
            <div className="text-slate-400 text-xs mb-2 flex items-center gap-2">
              <FileText size={12} />
              <span>Notes</span>
            </div>
            <p className="text-slate-300 text-xs line-clamp-3">
              {problem.notes}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs">Status:</span>
            <button
              onClick={handleMarkSolved}
              disabled={optimisticStatus === 'Solved'}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${optimisticStatus === 'Solved'
                  ? 'bg-green-500/20 text-green-300 cursor-default'
                  : 'hover:bg-green-500/20 hover:text-green-300 text-slate-400'}
              `}
            >
              <Check size={12} className="inline mr-1" />
              Solved
            </button>
            <button
              onClick={handleMarkInProgress}
              disabled={optimisticStatus === 'In Progress'}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${optimisticStatus === 'In Progress'
                  ? 'bg-blue-500/20 text-blue-300 cursor-default'
                  : 'hover:bg-blue-500/20 hover:text-blue-300 text-slate-400'}
              `}
            >
              <Clock size={12} className="inline mr-1" />
              In Progress
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkRevision}
              className="p-2 hover:bg-violet-500/20 rounded-lg transition-colors text-slate-400 hover:text-violet-300"
              title="Mark revision"
            >
              <RotateCw size={14} />
            </button>
            <button
              onClick={handleNotesToggle}
              className={`p-2 rounded-lg transition-colors ${showNotes
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'hover:bg-white/5 text-slate-400 hover:text-white'}
              `}
              title="View notes"
            >
              <FileText size={14} />
            </button>
            {onAddToStudyList && (
              <button
                onClick={() => onAddToStudyList(problem)}
                className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors text-slate-400 hover:text-cyan-300"
                title="Add to study list"
              >
                <ListPlus size={14} />
              </button>
            )}
            <button
              onClick={handleLeetCodeOpen}
              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-slate-400 hover:text-blue-300"
              title="Open LeetCode"
            >
              <ExternalLink size={14} />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors text-slate-400 hover:text-cyan-300"
              title="Edit problem"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-rose-500/20 rounded-lg transition-colors text-slate-400 hover:text-rose-300"
              title="Delete problem"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {showNotes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl mx-4 rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Notes - {problem.title}</h3>
                <button
                  onClick={() => setShowNotes(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <textarea
                value={problem.notes}
                readOnly
                className="w-full h-64 p-4 rounded-xl bg-[#071122] border border-white/6 text-white resize-none focus:outline-none focus:border-cyan-500/30"
                placeholder="No notes available"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowNotes(false)}
                  className="px-4 py-2 rounded-lg bg-white/3 hover:bg-white/5 text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
