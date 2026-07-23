import { useEffect, useState } from 'react'
import { DSA_TOPICS } from '../../utils/constants'
import SearchableSelect from '../ui/SearchableSelect'

export default function ProblemForm({ initial, onClose, onCreate, onUpdate }){
  const [form, setForm] = useState({ title:'', leetcodeLink:'', difficulty:'Medium', topic:'', status:'Not Started', notes:'', attemptCount:1 })

  useEffect(()=>{ if(initial) setForm({...initial}) }, [initial])

  const set = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }))

  const submit = async (e) =>{
    e.preventDefault()
    if(initial) await onUpdate(initial._id, form)
    else await onCreate(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <form onSubmit={submit} className="relative z-10 w-full max-w-2xl card p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-white">{initial ? 'Edit Problem' : 'Add Problem'}</h3>
          <button type="button" onClick={onClose} className="text-sm text-slate-400 hover:text-white transition-colors">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="Title" className="rounded-md p-2 bg-[#071122] border border-white/6 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30 transition-colors" />
          <input required value={form.leetcodeLink} onChange={(e)=>setForm({...form, leetcodeLink:e.target.value})} placeholder="LeetCode link" className="rounded-md p-2 bg-[#071122] border border-white/6 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30 transition-colors" />
          <SearchableSelect
            value={form.topic}
            onChange={set('topic')}
            options={DSA_TOPICS}
            placeholder="Select a topic"
          />
          <select value={form.difficulty} onChange={(e)=>setForm({...form, difficulty:e.target.value})} className="rounded-md p-2 bg-[#071122] border border-white/6 text-white focus:outline-none focus:border-cyan-500/30 transition-colors">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select value={form.status} onChange={(e)=>setForm({...form, status:e.target.value})} className="rounded-md p-2 bg-[#071122] border border-white/6 text-white focus:outline-none focus:border-cyan-500/30 transition-colors">
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Solved</option>
          </select>
          <input value={form.attemptCount} onChange={(e)=>setForm({...form, attemptCount: e.target.value})} type="number" min={1} className="rounded-md p-2 bg-[#071122] border border-white/6 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30 transition-colors" />
        </div>

        <textarea value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} placeholder="Notes" className="mt-3 w-full rounded-md p-2 bg-[#071122] border border-white/6 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30 transition-colors" rows={4} />

        <div className="mt-4 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-white/3 text-slate-300 hover:bg-white/6 hover:text-white transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:scale-105 transition-transform">{initial ? 'Save' : 'Create'}</button>
        </div>
      </form>
    </div>
  )
}
