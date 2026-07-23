import { motion } from 'framer-motion'

export default function WeeklyChart() {
  const values = [40, 60, 30, 80, 50, 70, 90]
  return (
    <div className="card glass p-4">
      <h4 className="text-sm text-slate-400">Weekly Progress</h4>
      <div className="mt-3 flex items-end gap-3 h-32">
        {values.map((v, i) => (
          <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: v / 100 }} transition={{ type: 'spring', stiffness: 120 }} style={{ transformOrigin: 'bottom' }} className="w-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-md" />
        ))}
      </div>
    </div>
  )
}
