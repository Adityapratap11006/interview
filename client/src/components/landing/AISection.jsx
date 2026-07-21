import { motion } from 'framer-motion'
import { BrainCircuit, MessageCircle, Sparkles, Target } from 'lucide-react'

const aiItems = [
  {
    title: 'AI Resume Analyzer',
    description: 'Get a strategic score and actionable suggestions to strengthen your profile.',
    icon: Sparkles,
  },
  {
    title: 'AI Mock Interviews',
    description: 'Practice realistic interview questions with structured feedback and guidance.',
    icon: MessageCircle,
  },
  {
    title: 'AI Study Plans',
    description: 'Create a weekly learning map tailored to your target company and role.',
    icon: Target,
  },
  {
    title: 'AI Problem Hints',
    description: 'Receive focused support that nudges you forward without giving away solutions.',
    icon: BrainCircuit,
  },
]

function AISection() {
  return (
    <section id="aitools" className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 px-6 py-10 shadow-[0_20px_90px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Intelligence layer</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Sharper prep with calm AI assistance.</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          Every tool is designed to make your prep feel lighter, smarter, and more focused.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {aiItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">{item.description}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default AISection
