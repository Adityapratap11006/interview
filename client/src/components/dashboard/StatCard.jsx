import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="card glass p-4 transition-transform">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-cyan-300"><Icon /></div>
          <div>
            <div className="text-2xl font-semibold text-white">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
          </div>
        </div>
        <div className="text-sm text-green-400">{trend}</div>
      </div>
    </motion.div>
  )
}
