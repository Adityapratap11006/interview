import StatCard from './StatCard'
import { CheckCircle, Flame, Clock, UserCheck } from 'lucide-react'

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={CheckCircle} label="Problems Solved" value="320" trend="+4%" />
      <StatCard icon={Flame} label="Daily Streak" value="15 Days" trend="+1%" />
      <StatCard icon={Clock} label="Revision Pending" value="12" trend="-2%" />
      <StatCard icon={UserCheck} label="Mock Interviews" value="5" trend="+10%" />
    </div>
  )
}
