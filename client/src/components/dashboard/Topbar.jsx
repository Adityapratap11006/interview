import { Bell, Sun, User } from 'lucide-react'

export default function Topbar() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-slate-400">Good Evening, Aditya 👋</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Welcome back to PrepPilot</h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg bg-white/3 hover:bg-white/5 transition-shadow shadow-sm"><Bell /></button>
        <button className="p-2 rounded-lg bg-white/3 hover:bg-white/5 transition-shadow shadow-sm"><Sun /></button>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-medium">A</div>
      </div>
    </div>
  )
}
