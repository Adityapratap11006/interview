import { motion } from 'framer-motion'

function Input({ label, type = 'text', value, onChange, placeholder, error, ...rest }) {
  return (
    <motion.label
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="grid gap-3 text-sm text-slate-200"
    >
      <span className="flex items-center justify-between text-slate-300">
        {label}
        {error ? <span className="text-rose-300">{error}</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
        {...rest}
      />
    </motion.label>
  )
}

export default Input
