function Footer() {
  return (
    <footer className="border-t border-white/10 px-1 py-8 text-sm text-slate-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-lg font-semibold text-slate-100 transition hover:text-white">
            PrepPilot
          </a>
          <p>© 2026 PrepPilot. Built for ambitious learners.</p>
        </div>
        <div className="flex gap-4">
          <a href="#features" className="transition hover:text-slate-300">Features</a>
          <a href="#aitools" className="transition hover:text-slate-300">AI Tools</a>
          <a href="#analytics" className="transition hover:text-slate-300">Analytics</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
