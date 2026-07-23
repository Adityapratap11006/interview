import { useMemo, useState } from 'react'
import { Edit2, Trash2, Link, CheckSquare, Square } from 'lucide-react'

function Row({p, onEdit, onDelete, isSelected, onSelect}){
  return (
    <tr className="hover:bg-white/3 transition">
      <td className="px-3 py-2">
        <button onClick={() => onSelect(p._id)} className="p-1 rounded-md hover:bg-white/5">
          {isSelected ? <CheckSquare size={16} className="text-cyan-300" /> : <Square size={16} className="text-slate-500" />}
        </button>
      </td>
      <td className="px-3 py-2">{p.title}</td>
      <td className="px-3 py-2 text-sm text-slate-400">{p.topic}</td>
      <td className="px-3 py-2">{p.difficulty}</td>
      <td className="px-3 py-2">{p.status}</td>
      <td className="px-3 py-2 text-sm text-slate-400">{p.attemptCount}</td>
      <td className="px-3 py-2 flex items-center gap-2">
        {p.leetcodeLink && <a href={p.leetcodeLink} target="_blank" rel="noreferrer" className="text-cyan-300"><Link size={16}/></a>}
        <button onClick={()=>onEdit(p)} className="p-1 rounded-md hover:bg-white/5"><Edit2 size={16}/></button>
        <button onClick={()=>onDelete(p._id)} className="p-1 rounded-md hover:bg-red-600/30"><Trash2 size={16}/></button>
      </td>
    </tr>
  )
}

export default function ProblemsTable({data, loading, onEdit, onDelete, selectedProblems, onSelectProblem, onSelectAll}){
  const [page, setPage] = useState(1)
  const perPage = 10
  const total = data.length
  const pages = Math.max(1, Math.ceil(total / perPage))

  const visible = useMemo(()=> data.slice((page-1)*perPage, page*perPage), [data, page])

  const allSelected = visible.length > 0 && visible.every(p => selectedProblems.includes(p._id))
  const someSelected = visible.some(p => selectedProblems.includes(p._id))

  return (
    <div className="card p-4">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="text-slate-400 text-sm">
            <th className="px-3 py-2">
              <button 
                onClick={onSelectAll}
                className="p-1 rounded-md hover:bg-white/5"
                title="Select all on this page"
              >
                {allSelected ? 
                  <CheckSquare size={16} className="text-cyan-300" /> : 
                  someSelected ? 
                  <div className="w-4 h-4 rounded border-2 border-cyan-400 bg-cyan-400/20" /> : 
                  <Square size={16} className="text-slate-500" />
                }
              </button>
            </th>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Topic</th>
            <th className="px-3 py-2">Difficulty</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Attempts</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan={7} className="p-6 text-center">Loading...</td></tr> : (
            visible.map(p => <Row key={p._id} p={p} onEdit={onEdit} onDelete={onDelete} isSelected={selectedProblems.includes(p._id)} onSelect={onSelectProblem} />)
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-400">{total} problems</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setPage(v=>Math.max(1, v-1))} className="px-3 py-1 rounded-md bg-white/3">Prev</button>
          <div className="px-3 py-1">{page} / {pages}</div>
          <button onClick={()=>setPage(v=>Math.min(pages, v+1))} className="px-3 py-1 rounded-md bg-white/3">Next</button>
        </div>
      </div>
    </div>
  )
}
