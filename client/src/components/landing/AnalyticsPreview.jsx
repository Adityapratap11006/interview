import { motion } from 'framer-motion'
import { Activity, CalendarRange, Flame, TrendingUp } from 'lucide-react'

function AnalyticsPreview() {
  return (
    <section id="analytics" className="py-8 sm:py-14">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Live overview</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Visual momentum, built for clarity.</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          See your streaks, progress, and heatmaps in a way that feels clean and motivating.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Current streak</p>
              <p className="mt-2 text-3xl font-semibold text-white">14 days</p>
            </div>
            <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-300">
              <Flame size={20} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {[42, 58, 81, 67, 92, 74, 88].map((height, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end rounded-2xl border border-white/10 bg-slate-950/60 p-1">
                  <div className="w-full rounded-xl bg-gradient-to-t from-cyan-400 to-violet-500" style={{ height: `${height}%` }} />
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.article
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Weekly analytics</p>
                <p className="mt-1 text-xl font-semibold text-white">+22% consistency</p>
              </div>
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <TrendingUp size={18} />
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.05 }}
            className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Study focus</p>
                <p className="mt-1 text-xl font-semibold text-white">Graphs + Arrays</p>
              </div>
              <div className="rounded-2xl bg-violet-400/10 p-3 text-violet-300">
                <Activity size={18} />
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Next milestone</p>
                <p className="mt-1 text-xl font-semibold text-white">3 sessions left</p>
              </div>
              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                <CalendarRange size={18} />
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}

export default AnalyticsPreview
