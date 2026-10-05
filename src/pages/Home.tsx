import { useNavigate } from 'react-router-dom'

const features = [
  ['Quick Approval', 'Get pre-approved in minutes with our streamlined digital process.'],
  ['Flexible Terms', 'Choose loan terms from 30 to 90 days that fit your budget.'],
  ['No Hidden Fees', 'Transparent pricing with no surprises. Know exactly what you\'ll pay.'],
]

export default function Home() {
  const nav = useNavigate()
  return (
    <div className="space-y-6">
      <section className="card bg-gradient-to-br from-primary to-primary-dark text-white">
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">★ Special Offer</span>
        <h1 className="mt-4 text-3xl font-bold">Get Up To Ksh 100,000</h1>
        <p className="mt-1 text-white/90">Low 7.5% interest rate for qualified borrowers</p>
        <ol className="mt-6 flex justify-between text-sm">
          {['Apply', 'Approve', 'Receive'].map((s, i) => (
            <li key={s} className="flex flex-col items-center gap-1">
              <span className="grid size-8 place-items-center rounded-full bg-white font-bold text-primary-dark">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </section>

      <button className="btn" onClick={() => nav('/eligibility')}>Apply Now →</button>

      <div className="space-y-3">
        {features.map(([t, d]) => (
          <div key={t} className="card">
            <h3 className="font-semibold">{t}</h3>
            <p className="text-sm text-muted">{d}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6 py-4">
        <div className="flex flex-col items-center gap-1">
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">🔒</span>
          <span className="text-xs font-medium text-muted">Secure</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">✓</span>
          <span className="text-xs font-medium text-muted">Licensed</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">✗</span>
          <span className="text-xs font-medium text-muted">No CRB Check</span>
        </div>
      </div>
    </div>
  )
}
