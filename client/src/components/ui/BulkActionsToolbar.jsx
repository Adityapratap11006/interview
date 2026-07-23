import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, FileText, RotateCw, X, CheckSquare, Square } from 'lucide-react'

function BulkActionsToolbar({ selectedCount, onClear, onBulkDelete, onBulkUpdate, onAddToStudyList }) {
  if (selectedCount === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/20 rounded-lg">
            <CheckSquare size={16} className="text-cyan-300" />
            <span className="text-sm font-medium text-cyan-300">
              {selectedCount} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
              title="Clear selection"
            >
              <X size={16} />
            </button>
            <div className="w-px h-6 bg-white/10" />
            <button
              onClick={onBulkDelete}
              className="p-2 rounded-lg hover:bg-rose-500/20 transition-colors text-slate-400 hover:text-rose-300"
              title="Delete selected"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => onBulkUpdate('status', 'Solved')}
              className="p-2 rounded-lg hover:bg-green-500/20 transition-colors text-slate-400 hover:text-green-300"
              title="Mark as solved"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => onBulkUpdate('status', 'In Progress')}
              className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors text-slate-400 hover:text-blue-300"
              title="Mark as in progress"
            >
              <FileText size={16} />
            </button>
            <button
              onClick={() => onBulkUpdate('revisionCount', (c) => c + 1)}
              className="p-2 rounded-lg hover:bg-violet-500/20 transition-colors text-slate-400 hover:text-violet-300"
              title="Add revision"
            >
              <RotateCw size={16} />
            </button>
          </div>

          {onAddToStudyList && (
            <>
              <div className="w-px h-6 bg-white/10" />
              <button
                onClick={onAddToStudyList}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-medium hover:scale-105 transition-all"
              >
                Add to Study List
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default BulkActionsToolbar