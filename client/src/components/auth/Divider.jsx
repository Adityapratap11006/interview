function Divider({ text }) {
  return (
    <div className="relative text-center text-sm text-slate-500">
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
      <span className="relative inline-block bg-slate-950 px-4">{text}</span>
    </div>
  )
}

export default Divider
