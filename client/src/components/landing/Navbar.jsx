import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const links = ['Features', 'AI Tools', 'Analytics', 'Pricing']

function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-4 z-50 mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/10 bg-slate-950/70 px-4 py-3 shadow-[0_10px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:px-6"
    >
      <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] text-slate-100 uppercase">
        <span className="inline-flex h-9 items-center rounded-full bg-cyan-400/10 px-3 py-2 text-cyan-300">
          PP
        </span>
        PrepPilot
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
        {links.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/\s+/g, '')}`}
            className="transition hover:text-slate-100"
          >
            {link}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white sm:block"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:scale-[1.01]"
        >
          Get Started
          <ArrowRight size={15} />
        </Link>
      </div>
    </motion.header>
  )
}

export default Navbar
