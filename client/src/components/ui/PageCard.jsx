import { motion } from 'framer-motion'

function PageCard({ title, description, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
    >
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">PrepPilot</p>
        <h1 className="text-2xl font-semibold text-slate-100">{title}</h1>
        <p className="text-sm text-slate-400">{description}</p>
      </div>

      {children}
    </motion.section>
  )
}

export default PageCard
