import { motion } from 'framer-motion'

function Ring({ size = 64, percent = 60 }) {
  const stroke = 8
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (percent / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={radius} stroke="#0f1724" strokeWidth={stroke} fill="none" />
      <motion.circle cx={size/2} cy={size/2} r={radius} stroke="url(#g1)" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" fill="none" initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }} />
    </svg>
  )
}

export default function TopicMastery() {
  const topics = [
    { name: 'Arrays', p: 82 },
    { name: 'Trees', p: 65 },
    { name: 'Graphs', p: 48 },
    { name: 'DP', p: 34 },
    { name: 'Binary Search', p: 91 },
  ]
  return (
    <div className="space-y-3">
      <h4 className="text-sm text-slate-400">Topic Mastery</h4>
      <div className="grid grid-cols-2 gap-3">
        {topics.map((t) => (
          <div key={t.name} className="flex items-center gap-3 rounded-xl p-3 card glass">
            <div className="w-20 h-20 flex items-center justify-center">
              <Ring percent={t.p} />
            </div>
            <div>
              <div className="font-semibold text-white">{t.name}</div>
              <div className="text-sm text-slate-400">{t.p}% mastery</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
