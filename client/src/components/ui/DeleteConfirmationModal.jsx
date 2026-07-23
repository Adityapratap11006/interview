import { motion } from 'framer-motion'
import { X } from 'lucide-react'

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, problemTitle }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md mx-4 rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-rose-500/20">
            <X size={16} className="text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Delete Problem</h3>
        </div>

        <p className="text-slate-300 mb-6">
          Are you sure you want to delete <span className="font-semibold text-white">&quot;{problemTitle}&quot;</span>?
          This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/3 hover:bg-white/5 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium hover:scale-105 transition-all"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default DeleteConfirmationModal