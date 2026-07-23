import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bookmark, Plus, Loader2, Check } from 'lucide-react'
import { fetchStudyLists, createStudyList, addProblemToList } from '../../services/studyLists'

export default function AddToStudyListModal({ isOpen, onClose, problemId, problemTitle }) {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(null)
  const [addedTo, setAddedTo] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const loadLists = async () => {
    setLoading(true)
    try {
      const res = await fetchStudyLists()
      setLists(res.data.studyLists || [])
    } catch (err) {
      console.error('Failed to load study lists:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadLists()
      setAddedTo(null)
      setShowCreate(false)
      setNewName('')
      setNewDesc('')
      setError('')
    }
  }, [isOpen])

  const handleAdd = async (listId) => {
    setAdding(listId)
    setError('')
    try {
      await addProblemToList(listId, problemId)
      setAddedTo(listId)
      setTimeout(() => onClose(), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add problem')
    } finally {
      setAdding(null)
    }
  }

  const handleCreateAndAdd = async (e) => {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    setCreating(true)
    setError('')
    try {
      const res = await createStudyList({ name: trimmed, description: newDesc.trim() })
      const list = res.data.studyList
      await addProblemToList(list._id, problemId)
      setAddedTo(list._id)
      setTimeout(() => onClose(), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create list')
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-md mx-4 rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Add to Study List</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {problemTitle && (
          <p className="text-sm text-slate-400 mb-4 truncate">
            Adding: <span className="text-white font-medium">{problemTitle}</span>
          </p>
        )}

        {error && (
          <p className="text-sm text-rose-300 bg-rose-500/10 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        {addedTo && (
          <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/10 rounded-xl px-4 py-3 mb-4">
            <Check size={18} />
            <span className="text-sm font-medium">Added successfully!</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-cyan-300" />
          </div>
        ) : lists.length === 0 && !showCreate ? (
          <div className="text-center py-6">
            <Bookmark size={32} className="mx-auto text-slate-500 mb-2" />
            <p className="text-slate-400 text-sm mb-4">No study lists yet</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-medium hover:scale-105 transition-all"
            >
              Create your first list
            </button>
          </div>
        ) : (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {lists.map(list => {
              const isAdded = addedTo === list._id
              const isAdding = adding === list._id
              return (
                <button
                  key={list._id}
                  onClick={() => !isAdded && handleAdd(list._id)}
                  disabled={isAdded}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isAdded
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${list.color || '#22d3ee'}20`, color: list.color || '#22d3ee' }}
                  >
                    <Bookmark size={14} />
                  </div>
                  <span className="flex-1 truncate text-sm">{list.name}</span>
                  <span className="text-xs text-slate-500">{list.problems?.length || 0}</span>
                  {isAdded && <Check size={16} className="shrink-0" />}
                  {isAdding && <Loader2 size={16} className="animate-spin shrink-0 text-cyan-300" />}
                </button>
              )
            })}
          </div>
        )}

        <AnimatePresence>
          {!showCreate ? (
            <motion.button
              key="create-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(true)}
              className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm"
            >
              <Plus size={14} />
              Create new list
            </motion.button>
          ) : (
            <motion.form
              key="create-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateAndAdd}
              className="mt-3 space-y-3 pt-3 border-t border-white/5"
            >
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="List name"
                required
                className="w-full rounded-xl p-2.5 bg-[#071122] border border-white/6 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30"
              />
              <input
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full rounded-xl p-2.5 bg-[#071122] border border-white/6 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-2 rounded-xl bg-white/3 hover:bg-white/5 text-slate-300 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-medium hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create & Add'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
