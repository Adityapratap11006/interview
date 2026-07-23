import { useState, useEffect, useCallback } from 'react'
import { Plus, Bookmark, Search } from 'lucide-react'
import StudyListCard from '../components/studyLists/StudyListCard'
import StudyListFormModal from '../components/studyLists/StudyListFormModal'
import DeleteConfirmationModal from '../components/ui/DeleteConfirmationModal'
import { fetchStudyLists, createStudyList, updateStudyList, deleteStudyList } from '../services/studyLists'
import { toast } from '../utils/toast'

export default function StudyListsPage() {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingList, setEditingList] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadLists = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchStudyLists()
      setLists(res.data.studyLists || [])
    } catch (err) {
      console.error('Failed to load study lists:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadLists() }, [loadLists])

  const handleSave = async (data) => {
    if (editingList) {
      await updateStudyList(editingList._id, data)
      toast('Study list updated')
    } else {
      await createStudyList(data)
      toast('Study list created')
    }
    setShowForm(false)
    setEditingList(null)
    loadLists()
  }

  const handleEdit = (list) => {
    setEditingList(list)
    setShowForm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteStudyList(deleteTarget._id)
      setLists(prev => prev.filter(l => l._id !== deleteTarget._id))
      toast('Study list deleted')
    } catch (err) {
      console.error('Delete failed:', err)
    }
    setDeleteTarget(null)
  }

  const filtered = lists.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.description && l.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Study Lists</h1>
          <p className="text-slate-400 text-sm">Organize problems into custom study lists</p>
        </div>
        <button
          onClick={() => { setEditingList(null); setShowForm(true) }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> New List
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search study lists..."
          className="w-full lg:w-80 pl-9 pr-4 py-2 rounded-xl bg-[#071122] border border-white/6 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30 transition-colors"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-[24px] border border-white/10 bg-white/5 p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-700/50" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-36 bg-slate-700/50 rounded-lg" />
                  <div className="h-4 w-56 bg-slate-700/50 rounded-lg" />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="h-4 w-28 bg-slate-700/50 rounded" />
                <div className="h-1.5 bg-slate-700/50 rounded-full" />
                <div className="h-3 w-32 bg-slate-700/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-[28px] border border-dashed border-white/10 bg-white/3">
          <Bookmark size={48} className="mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {search ? 'No lists found' : 'No study lists yet'}
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            {search
              ? 'Try a different search term'
              : 'Create your first study list to organize problems by topic, company, or difficulty'}
          </p>
          {!search && (
            <button
              onClick={() => { setEditingList(null); setShowForm(true) }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Plus size={16} /> Create Study List
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((list, i) => (
            <StudyListCard key={list._id} list={list} index={i} onEdit={handleEdit} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <StudyListFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingList(null) }}
        onSave={handleSave}
        initial={editingList}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        problemTitle={deleteTarget?.name || 'this study list'}
      />
    </div>
  )
}
