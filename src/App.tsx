import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Eligibility from './pages/Eligibility'
import Offers from './pages/Offers'
import Dashboard from './pages/Dashboard'
import SocialProof from './components/SocialProof'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <SocialProof />

      {/* Premium Header */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/50">
        <div className="mx-auto flex max-w-[520px] items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Meta Instant Loan" className="size-12 rounded-xl shadow-lg" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-primary">META INSTANT</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">Digital Banking</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/help" className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-slate-200">
              Support
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-[520px] flex-1 px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[520px] px-6 py-8">
          {/* Trust Badges */}
          <div className="mb-6 flex justify-center gap-8">
            <div className="flex flex-col items-center gap-1">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <span className="text-[10px] font-medium text-muted">CBK Licensed</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <span className="text-[10px] font-medium text-muted">256-bit SSL</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="text-[10px] font-medium text-muted">Verified</span>
            </div>
          </div>

          <div className="mb-4 flex justify-center gap-6 text-xs font-medium text-muted">
            <a href="#" className="transition hover:text-primary">Privacy Policy</a>
            <a href="#" className="transition hover:text-primary">Terms of Service</a>
            <a href="#" className="transition hover:text-primary">Contact Us</a>
          </div>

          <p className="text-center text-[10px] text-muted/70">
            © 2026 Meta Instant Loan Ltd. All rights reserved.<br/>
            Regulated by Central Bank of Kenya | License No. MBL/2024/001
          </p>
        </div>
      </footer>
    </div>
  )
}
