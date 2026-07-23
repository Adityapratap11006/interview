import { Outlet } from 'react-router-dom'
import ToastContainer from '../components/ui/Toast'

function MainLayout() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <ToastContainer />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
