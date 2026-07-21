import { motion } from 'framer-motion'
import { BarChart3, BrainCircuit, Flame, GraduationCap, Layers3, MessageCircle, Sparkles, Target } from 'lucide-react'

const features = [
  {
    title: 'DSA Tracker',
    description: 'Organize every problem, tag every concept, and monitor momentum over time.',
    icon: Target,
    accent: 'from-cyan-400/20 to-cyan-500/5',
  },
  {
    title: 'Analytics',
    description: 'Watch your growth with elegant streaks, progress summaries, and weekly insights.',
    icon: BarChart3,
    accent: 'from-violet-400/20 to-violet-500/5',
  },
  {
    title: 'Heatmaps',
    description: 'Spot your strong and weak topics instantly with rich visual feedback.',
    icon: Layers3,
    accent: 'from-emerald-400/20 to-emerald-500/5',
  },
  {
    title: 'AI Hints',
    description: 'Get smart nudges tailored to your current problem and study flow.',
    icon: BrainCircuit,
    accent: 'from-amber-400/20 to-amber-500/5',
  },
  {
    title: 'Resume Analyzer',
    description: 'Turn your resume into a stronger story with AI-assisted refinement.',
    icon: Sparkles,
    accent: 'from-pink-400/20 to-pink-500/5',
  },
  {
    title: 'Mock Interviews',
    description: 'Simulate placement interviews with a calm, structured, and realistic flow.',
    icon: MessageCircle,
    accent: 'from-sky-400/20 to-sky-500/5',
  },
  {
    title: 'Study Plans',
    description: 'Create and follow refined daily plans with just the right number of challenges.',
    icon: GraduationCap,
    accent: 'from-fuchsia-400/20 to-fuchsia-500/5',
  },
  {
    title: 'Topic Mastery',
    description: 'Measure mastery across core topics and focus your prep with precision.',
    icon: Flame,
    accent: 'from-indigo-400/20 to-indigo-500/5',
  },
]

function Features() {
  return (
    <section id="features" className="px-1 py-8 sm:py-14">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Core experience</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Everything you need for placement prep.</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          From daily practice to interview readiness, each module is designed to feel calm, fast, and deeply useful.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_12px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl"
            >
              <div className={`rounded-2xl bg-gradient-to-br ${feature.accent} p-3 text-cyan-200`}>
                <Icon size={18} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">{feature.description}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default Features
