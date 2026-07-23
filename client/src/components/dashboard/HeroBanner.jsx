import { motion } from 'framer-motion'

export default function HeroBanner() {
  return (
    <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative card glass p-6 overflow-hidden">
      <svg className="hero-decor" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g2" x1="0" x2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.12"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0.12"/></linearGradient>
        </defs>
        <circle cx="720" cy="40" r="220" fill="url(#g2)" />
        <circle cx="80" cy="320" r="160" fill="rgba(124,58,237,0.04)" />
      </svg>
      <div className="relative z-10 flex items-start justify-between gap-6">
        <div>
          <h3 className="text-3xl font-bold text-white">Ready to crack your next interview?</h3>
          <p className="mt-2 text-slate-300 max-w-xl">Stay consistent. Track your progress. Let AI guide your preparation.</p>

          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform">Continue Learning</button>
            <button className="px-4 py-2 rounded-xl border border-white/10 text-white/90 hover:bg-white/5 transition">AI Roadmap</button>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700/60 shadow-2xl flex items-center justify-center text-white">AI</div>
        </div>
      </div>
    </motion.div>
  )
}
