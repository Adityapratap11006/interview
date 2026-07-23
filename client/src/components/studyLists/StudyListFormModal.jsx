import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Bookmark } from 'lucide-react'

const COLOR_PRESETS = [
  { key: 'cyan', color: '#22d3ee' },
  { key: 'emerald', color: '#34d399' },
  { key: 'violet', color: '#a78bfa' },
  { key: 'rose', color: '#fb7185' },
  { key: 'amber', color: '#fbbf24' },
  { key: 'blue', color: '#60a5fa' },
  { key: 'slate', color: '#94a3b8' },
]

export default function StudyListFormModal({ isOpen, onClose, onSave, initial }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('cyan')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      if (initial) {
        setName(initial.name || '')
        setDescription(initial.description || '')
        setColor(initial.color || 'cyan')
      } else {
        setName('')
        setDescription('')
        setColor('cyan')
      }
      setError('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, initial])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({ name: trimmed, description: description.trim(), color })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-lg mx-4 rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Bookmark size={18} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {initial ? 'Edit Study List' : 'Create Study List'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Name *</label>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="e.g. Top 100 LinkedIn Questions"
              maxLength={100}
              className="w-full rounded-xl p-3 bg-[#071122] border border-white/6 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this study list"
              maxLength={500}
              rows={3}
              className="w-full rounded-xl p-3 bg-[#071122] border border-white/6 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Color</label>
            <div className="flex items-center gap-2.5">
              {COLOR_PRESETS.map(({ key, color: hex }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  className={`w-9 h-9 rounded-xl transition-all ${
                    color === key
                      ? 'ring-2 ring-offset-2 ring-offset-slate-950 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: hex,
                    ringColor: hex,
                  }}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-rose-300 bg-rose-500/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/3 hover:bg-white/5 text-slate-300 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : initial ? 'Save Changes' : 'Create List'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
