import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.95))] px-6 py-16 shadow-[0_30px_140px_rgba(0,0,0,0.35)] sm:px-8 lg:px-12 lg:py-20">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-10 top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            <Sparkles size={14} />
            AI-powered placement prep for ambitious builders
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Master DSA. Track Progress. Crack Interviews.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            PrepPilot helps you track DSA progress, analyze resumes, rehearse mock interviews, and follow AI-guided study plans in one premium workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-medium text-slate-950 transition hover:scale-[1.01]"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10"
            >
              <Play size={16} />
              View Demo
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <TrendingUp size={14} className="text-cyan-300" />
              Live analytics
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Sparkles size={14} className="text-violet-300" />
              AI study assistant
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative"
        >
          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="rounded-[22px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Weekly momentum</p>
                  <p className="mt-1 text-xl font-semibold text-white">82% consistency</p>
                </div>
                <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                  <TrendingUp size={18} />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                  <p className="text-sm text-cyan-200">Mock interviews</p>
                  <p className="mt-2 text-2xl font-semibold text-white">24</p>
                </div>
                <div className="rounded-2xl border border-violet-400/15 bg-violet-400/10 p-4">
                  <p className="text-sm text-violet-200">Resume score</p>
                  <p className="mt-2 text-2xl font-semibold text-white">91</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">Study plan progress</p>
                  <p className="text-sm text-cyan-300">67%</p>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-2 w-[67%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
