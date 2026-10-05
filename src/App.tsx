import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Eligibility from './pages/Eligibility'
import Offers from './pages/Offers'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[480px] flex-1 p-6">
        <header className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[10px] bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">M</span>
            <span className="text-2xl font-bold text-primary">Mkopo Hela</span>
          </Link>
          <Link to="/help" className="text-sm font-medium text-primary hover:underline">Help</Link>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="p-6 text-center text-xs text-muted">
        <div className="mb-2 flex justify-center gap-4">
          <a href="#" className="hover:text-primary">Privacy</a>
          <a href="#" className="hover:text-primary">Terms</a>
          <a href="#" className="hover:text-primary">Contact</a>
        </div>
        © 2025 Mkopo Hela. Licensed by CBK
      </footer>
    </div>
  )
}
