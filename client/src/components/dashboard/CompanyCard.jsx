export default function CompanyCard(){
  const companies = [
    { name: 'Google', p: 78 },
    { name: 'Amazon', p: 64 },
    { name: 'Microsoft', p: 52 },
    { name: 'Flipkart', p: 41 },
  ]
  return (
    <div className="card glass p-4">
      <h4 className="text-sm text-slate-400">Company Preparation</h4>
      <div className="mt-3 space-y-3">
        {companies.map(c=> (
          <div key={c.name}>
            <div className="flex items-center justify-between text-white font-medium">{c.name} <span className="text-sm text-slate-400">{c.p}%</span></div>
            <div className="mt-1 h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600" style={{width: c.p + '%'}}></div></div>
          </div>
        ))}
      </div>
    </div>
  )
}
