import { useState } from 'react'
import { LayoutGrid, PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react'
import PageCard from '../components/ui/PageCard'

function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="grid min-h-[70vh] gap-4 lg:grid-cols-[260px_1fr]">
      <aside className={`rounded-[28px] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl transition-all ${collapsed ? 'lg:w-[88px]' : 'lg:w-[260px]'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-100">
            <span className="inline-flex h-9 items-center rounded-full bg-cyan-400/10 px-3 py-2 text-cyan-300">PP</span>
            {!collapsed && <span className="text-lg font-semibold">PrepPilot</span>}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <div className="mt-8 space-y-2">
          <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-3 text-sm text-cyan-200">
            <LayoutGrid size={16} />
            {!collapsed && <span>Overview</span>}
          </div>
          <div className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-400">
            <Sparkles size={16} />
            {!collapsed && <span>Planner</span>}
          </div>
        </div>
      </aside>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
            <p className="mt-1 text-sm text-slate-400">Your prep workspace is ready.</p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">PP</span>
        </div>

        <PageCard
          title="Dashboard"
          description="Placeholder dashboard shell for future data-driven sections."
        >
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-sm text-slate-400">
            Dashboard widgets and analytics will arrive in later steps.
          </div>
        </PageCard>
      </div>
    </div>
  )
}

export default DashboardPage
