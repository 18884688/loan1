import { useNavigate } from 'react-router-dom'

// SVG Icons
const Icons = {
  bolt: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  chart: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  refresh: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  shield: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
}

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <section className="card-dark relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="relative">
          <div className="mb-6 flex items-center gap-2">
            <span className="badge bg-accent/20 text-accent">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
              Limited Offer
            </span>
            <span className="badge bg-white/10 text-white/80">
              7.5% APR
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">
            Up to <span className="text-accent">Ksh 100,000</span>
          </h1>
          <p className="mt-2 text-lg text-white/70">
            Instant approval. Funds in minutes.
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <p className="text-2xl font-bold text-accent">500K+</p>
              <p className="text-xs text-white/50">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">2B+</p>
              <p className="text-xs text-white/50">Disbursed (Ksh)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">4.9★</p>
              <p className="text-xs text-white/50">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Button */}
      <button className="btn text-primary font-bold text-lg" onClick={() => nav('/eligibility')}>
        Apply Now — Get Instant Decision
      </button>

      {/* Process Steps */}
      <section className="card">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-muted">
          How It Works
        </h2>
        <div className="flex justify-between">
          {[
            { step: '01', title: 'Apply', desc: '2 minutes' },
            { step: '02', title: 'Approve', desc: 'Instant' },
            { step: '03', title: 'Receive', desc: 'Via M-Pesa' },
          ].map((item, i) => (
            <div key={item.step} className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-xl font-bold text-white shadow-lg">
                  {item.step}
                </span>
                {i < 2 && (
                  <span className="absolute left-full top-1/2 w-8 border-t-2 border-dashed border-slate-200" />
                )}
              </div>
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <div className="grid gap-4">
        {[
          { icon: Icons.bolt, title: 'Lightning Fast', desc: 'Get funds deposited to your M-Pesa within 5 minutes of approval.' },
          { icon: Icons.chart, title: 'Transparent Pricing', desc: 'No hidden fees. Know exactly what you pay before you commit.' },
          { icon: Icons.refresh, title: 'Flexible Repayment', desc: 'Choose 30, 60, or 90 day terms that fit your cash flow.' },
          { icon: Icons.shield, title: 'Bank-Grade Security', desc: 'Your data is protected with 256-bit encryption.' },
        ].map(f => (
          <div key={f.title} className="card flex gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
              {f.icon}
            </span>
            <div>
              <h3 className="font-semibold text-ink">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <section className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
        <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-primary">
          Trusted By Leading Institutions
        </h3>
        <div className="flex items-center justify-center gap-6">
          <img src="/safaricom.png" alt="Safaricom" className="h-8 object-contain" />
          <img src="/cbk.jpg" alt="Central Bank of Kenya" className="h-10 object-contain" />
        </div>
      </section>

      {/* Secondary CTA */}
      <button className="btn-outline" onClick={() => nav('/eligibility')}>
        Check Your Eligibility
      </button>
    </div>
  )
}
