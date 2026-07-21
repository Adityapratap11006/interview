import { motion } from 'framer-motion'

function AuthLayout({ children, title, description }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_25%),linear-gradient(180deg,#05070f_0%,#060816_46%,#020612_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.16),transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto w-full rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-3xl sm:p-10"
        >
          <div className="mb-10 flex flex-col gap-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              PrepPilot
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">{description}</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.85fr_0.95fr]">
            {children}
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-slate-300 shadow-[0_16px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <p className="font-semibold text-white">Why PrepPilot?</p>
              <ul className="mt-5 space-y-4 text-slate-400">
                <li>Premium prep workspace that keeps your focus sharp.</li>
                <li>AI-guided suggestions without distractions.</li>
                <li>Clean, fast, and responsive auth experience.</li>
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default AuthLayout
