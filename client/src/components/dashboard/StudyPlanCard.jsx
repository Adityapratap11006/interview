export default function StudyPlanCard(){
  return (
    <div className="card glass p-4">
      <h4 className="text-sm text-slate-400">Today's Goal</h4>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold text-white">5 Problems</div>
            <div className="text-sm text-slate-400">2 Revisions · 1 Mock Interview</div>
          </div>
          <div className="text-sm text-slate-400">Progress</div>
        </div>
        <div className="mt-3 h-3 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-600" style={{width:'45%'}}></div>
        </div>
      </div>
    </div>
  )
}
