import { motion } from 'framer-motion'
import { Bookmark, BookOpen, Edit2, Trash2, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const COLORS = {
  cyan: '#22d3ee',
  emerald: '#34d399',
  violet: '#a78bfa',
  rose: '#fb7185',
  amber: '#fbbf24',
  blue: '#60a5fa',
  slate: '#94a3b8',
}

export default function StudyListCard({ list, onEdit, onDelete, index }) {
  const navigate = useNavigate()

  const solved = list.problems.filter(p => p.status === 'Solved').length
  const total = list.problems.length
  const progress = total > 0 ? Math.round((solved / total) * 100) : 0
  const color = COLORS[list.color] || list.color || '#22d3ee'

  const formatDate = (d) => {
    if (!d) return ''
    const date = new Date(d)
    const now = new Date()
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff}d ago`
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`
    return `${Math.floor(diff / 30)}mo ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative rounded-[24px] border border-white/10 bg-gradient-to-br from-white/5 to-white/3 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl hover:shadow-[0_30px_100px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20 cursor-pointer"
      onClick={() => navigate(`/study-lists/${list._id}`)}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Bookmark size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
            {list.name}
          </h3>
          {list.description && (
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{list.description}</p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <BookOpen size={14} />
              {total} {total === 1 ? 'problem' : 'problems'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              <span className="text-cyan-300 font-medium">{solved}</span> solved
            </span>
          </div>
          <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
        </div>

        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Updated {formatDate(list.updatedAt)}</span>
          <span>Created {formatDate(list.createdAt)}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(list) }}
          className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-all"
          title="Edit list"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(list) }}
          className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-all"
          title="Delete list"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}
