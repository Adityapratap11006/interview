import { motion } from 'framer-motion'
import { Zap, Play, FileText, BookOpen } from 'lucide-react'

const actions = [
  { title: 'Practice DSA', icon: Play },
  { title: 'Generate AI Hint', icon: Zap },
  { title: 'Analyze Resume', icon: FileText },
  { title: 'Start Mock Interview', icon: BookOpen },
  { title: 'Continue Revision', icon: Play },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <motion.button
            key={action.title}
            whileHover={{ y: -6 }}
            className="card glass p-4 text-left transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-cyan-300"><Icon /></div>
              <div>
                <div className="font-semibold text-white">{action.title}</div>
                <div className="text-xs text-slate-400">Quick action</div>
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
