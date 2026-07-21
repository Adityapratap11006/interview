import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

function PasswordInput({ label, value, onChange, placeholder, error, ...rest }) {
  const [visible, setVisible] = useState(false)

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
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 pr-12 text-slate-100 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-100"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </motion.label>
  )
}

export default PasswordInput
