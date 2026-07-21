import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function CTASection() {
  return (
    <section id="pricing" className="rounded-[36px] border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 via-slate-900/80 to-violet-500/10 px-6 py-12 text-center shadow-[0_20px_80px_rgba(34,211,238,0.1)] sm:px-8 lg:px-12">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Ready to begin</p>
      <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Start your placement journey today.</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-400">
        Build momentum, sharpen your story, and move toward interviews with confidence.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-medium text-slate-950 transition hover:scale-[1.01]"
        >
          Get Started
          <ArrowRight size={16} />
        </Link>
        <a
          href="#features"
          className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10"
        >
          Explore Features
        </a>
      </div>
    </section>
  )
}

export default CTASection
