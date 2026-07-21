import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

function SocialButton({ children, ...rest }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      className="inline-flex w-full items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-slate-100 transition hover:border-cyan-400/20 hover:bg-white/5"
      {...rest}
    >
      <ShieldCheck size={18} className="text-cyan-300" />
      {children}
    </motion.button>
  )
}

export default SocialButton
