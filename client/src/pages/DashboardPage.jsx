import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import HeroBanner from '../components/dashboard/HeroBanner'
import StatsGrid from '../components/dashboard/StatsGrid'
import QuickActions from '../components/dashboard/QuickActions'
import WeeklyChart from '../components/dashboard/WeeklyChart'
import TopicMastery from '../components/dashboard/TopicMastery'
import Timeline from '../components/dashboard/Timeline'
import StudyPlanCard from '../components/dashboard/StudyPlanCard'
import CompanyCard from '../components/dashboard/CompanyCard'
import DashboardFooter from '../components/dashboard/DashboardFooter'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#030712] p-6 text-slate-200">
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <Sidebar />

        <main>
          <Topbar />

          <div className="mt-6 space-y-6">
            <HeroBanner />

            <StatsGrid />

            <QuickActions />

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <WeeklyChart />
                <Timeline />
              </div>
              <div className="space-y-4">
                <TopicMastery />
                <StudyPlanCard />
                <CompanyCard />
              </div>
            </div>

            <DashboardFooter />
          </div>
        </main>
      </div>
    </div>
  )
}
