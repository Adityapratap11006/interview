import { useMemo } from 'react'

export default function SearchFilter({ query, setQuery, filters, setFilters, problems }){
  const topics = useMemo(()=>Array.from(new Set(problems.map(p=>p.topic).filter(Boolean))), [problems])

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-3 flex-1">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by title" className="flex-1 rounded-lg p-2 bg-[#071122] border border-white/6 text-white" />
      </div>

      <div className="flex items-center gap-2">
        <select value={filters.difficulty} onChange={(e)=>setFilters({...filters, difficulty:e.target.value})} className="rounded-lg p-2 bg-[#071122] border border-white/6 text-white">
          <option value="">All difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select value={filters.status} onChange={(e)=>setFilters({...filters, status:e.target.value})} className="rounded-lg p-2 bg-[#071122] border border-white/6 text-white">
          <option value="">All status</option>
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Solved</option>
        </select>
        <select value={filters.topic} onChange={(e)=>setFilters({...filters, topic:e.target.value})} className="rounded-lg p-2 bg-[#071122] border border-white/6 text-white">
          <option value="">All topics</option>
          {topics.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>
  )
}
