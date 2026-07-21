import { motion } from 'framer-motion'

function Button({ children, type = 'button', className = '', loading = false, ...rest }) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${loading ? 'cursor-wait bg-slate-700 text-slate-400' : 'bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950'} ${className}`}
      disabled={loading}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  )
}

export default Button
