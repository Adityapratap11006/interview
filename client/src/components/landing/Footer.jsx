function Footer() {
  return (
    <footer className="border-t border-white/10 px-1 py-8 text-sm text-slate-500">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 PrepPilot. Built for ambitious learners.</p>
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
