import { Clock, Check } from 'lucide-react'

const items = [
  { text: 'Completed Two Sum', time: 'Today' },
  { text: 'Solved Binary Search', time: 'Yesterday' },
  { text: 'Generated AI Hint', time: '2 days ago' },
  { text: 'Updated Resume', time: '3 days ago' },
  { text: 'Completed Revision', time: '1 week ago' },
]

export default function Timeline() {
  return (
    <div className="card glass p-4">
      <h4 className="text-sm text-slate-400">Recent Activity</h4>
      <ul className="mt-3 space-y-3">
        {items.map((it) => (
          <li key={it.text} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white"><Check/></div>
            <div>
              <div className="font-medium text-white">{it.text}</div>
              <div className="text-xs text-slate-400 flex items-center gap-2"><Clock size={12}/> {it.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
