import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { setToastHandler } from '../../utils/toast'

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((t) => {
    setToasts(prev => [...prev, t])
    setTimeout(() => {
      setToasts(prev => prev.filter(item => item.id !== t.id))
    }, 3500)
  }, [])

  useEffect(() => {
    setToastHandler(addToast)
    return () => setToastHandler(null)
  }, [addToast])

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl ${
              t.type === 'success'
                ? 'bg-emerald-900/80 border-emerald-500/30'
                : 'bg-rose-900/80 border-rose-500/30'
            }`}
          >
            {t.type === 'success'
              ? <CheckCircle size={18} className="text-emerald-300 shrink-0 mt-0.5" />
              : <XCircle size={18} className="text-rose-300 shrink-0 mt-0.5" />
            }
            <p className="text-sm text-white flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-white/40 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
