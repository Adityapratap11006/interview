import { motion } from 'framer-motion'
import { Home, BookOpen, Cpu, Zap, FileText, PieChart, Settings, LogOut } from 'lucide-react'

const menu = [
  { label: 'Dashboard', icon: Home },
  { label: 'Problems', icon: BookOpen },
  { label: 'Study Plan', icon: Cpu },
  { label: 'AI Assistant', icon: Zap },
  { label: 'Resume Analyzer', icon: FileText },
  { label: 'Analytics', icon: PieChart },
  { label: 'Settings', icon: Settings },
]

export default function Sidebar({ collapsed }) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`hidden lg:flex flex-col gap-6 w-[260px] p-5 text-slate-200 card glass`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">PP</div>
          <div>
            <div className="text-lg font-semibold">PrepPilot</div>
            <div className="text-xs text-slate-400">AI Interview Prep</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 mt-3">
        {menu.map((m) => {
          const path = m.label === 'Dashboard' ? '/dashboard' : m.label === 'Problems' ? '/problems' : '#'
          return (
            <a key={m.label} href={path} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/5 transition-colors text-sm">
              <m.icon size={18} className="text-cyan-300" />
              <span className="text-sm text-slate-200">{m.label}</span>
            </a>
          )
        })}
      </nav>

      <div className="pt-3 border-t border-white/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm">A</div>
            <div className="text-sm">
              <div className="font-medium">Aditya</div>
              <div className="text-xs text-slate-400">Member</div>
            </div>
          </div>
          <button className="p-2 rounded-md hover:bg-white/5"><LogOut size={16} /></button>
        </div>
      </div>
    </motion.aside>
  )
}
