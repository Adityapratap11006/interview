import { motion } from 'framer-motion'
import { useState } from 'react'

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 bg-slate-700/50 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-slate-700/50 rounded-lg animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-slate-700/50 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-700/50 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-28 bg-slate-700/50 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-8 w-16 bg-slate-700/50 rounded-lg animate-pulse" />
            <div className="h-8 w-16 bg-slate-700/50 rounded-lg animate-pulse" />
            <div className="h-8 w-16 bg-slate-700/50 rounded-lg animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default LoadingSkeleton