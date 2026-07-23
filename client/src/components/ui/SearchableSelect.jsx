import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'

export default function SearchableSelect({ value, onChange, options, placeholder, disabled, required }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)
  const searchInputRef = useRef(null)

  const filtered = useMemo(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter(o => o.toLowerCase().includes(q))
  }, [options, search])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setHighlightedIndex(-1)
      requestAnimationFrame(() => searchInputRef.current?.focus())
    }
  }, [isOpen])

  const handleKeyDown = (e) => {
    if (!isOpen) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1))
        break
      case 'Enter':
      case 'Tab':
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          e.preventDefault()
          onChange(filtered[highlightedIndex])
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => { if (!disabled) setIsOpen(!isOpen) }}
        className={`w-full rounded-md p-2 bg-[#071122] border text-sm text-left flex items-center justify-between gap-2 transition-all ${isOpen ? 'border-cyan-500/50' : 'border-white/6'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-white/20'}`}
      >
        {value ? (
          <span className="flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <span className="text-sm">{value}</span>
          </span>
        ) : (
          <span className="text-slate-500 text-sm">{placeholder || 'Select...'}</span>
        )}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-slate-500 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ transformOrigin: 'top center', position: 'absolute', zIndex: 100, top: '100%', left: 0 }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-[#0b192e] shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5">
              <Search size={14} className="text-slate-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setHighlightedIndex(0) }}
                onKeyDown={handleKeyDown}
                placeholder="Search topics..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className={`max-h-48 overflow-y-auto ${filtered.length > 0 ? 'py-1' : ''}`}>
              {filtered.length === 0 ? (
                <div className="px-3 py-8 text-center text-slate-500 text-sm">No topics found</div>
              ) : (
                filtered.map((option, index) => {
                  const isSelected = option === value
                  const isHighlighted = index === highlightedIndex
                  return (
                    <button
                      key={option}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); onChange(option); setIsOpen(false) }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${isHighlighted ? 'bg-white/8 text-white' : 'text-slate-300'} ${isSelected ? 'bg-cyan-500/8 text-cyan-300' : ''}`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-cyan-400' : 'border-slate-600'}`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </span>
                      <span className="truncate">{option}</span>
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
