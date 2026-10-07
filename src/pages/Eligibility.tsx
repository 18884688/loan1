import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isNationalId, isSafaricom, save } from '../lib'

const LOAN_TYPES = ['Business Loan', 'Personal Loan', 'Education Loan', 'Medical Loan', 'Emergency Loan']

export default function Eligibility() {
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', phone: '', idNumber: '', loanType: '' })
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (f.name.trim().length < 3) return setError('Enter your full name.')
    if (!isSafaricom(f.phone)) return setError('Enter a valid Safaricom number, e.g. 0712 345 678.')
    if (!isNationalId(f.idNumber)) return setError('National ID must be 7 or 8 digits.')
    if (!f.loanType) return setError('Please select a loan type.')
    setError('')
    setChecking(true)
    save({ applicant: { ...f, name: f.name.trim(), income: 50000 }, loan: undefined })
    setTimeout(() => nav('/offers'), 1200)
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-white">1</span>
        <span className="h-0.5 w-8 bg-slate-200" />
        <span className="grid size-8 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-400">2</span>
        <span className="h-0.5 w-8 bg-slate-200" />
        <span className="grid size-8 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-400">3</span>
      </div>

      <form onSubmit={submit} className="card space-y-5" noValidate>
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-ink">Personal Information</h2>
          <p className="text-sm text-muted">Fill in your details to check loan eligibility</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">Full Name</label>
          <input className="input" value={f.name} onChange={set('name')} maxLength={80} autoComplete="name" placeholder="John Kamau Mwangi" />
          <p className="mt-1.5 text-xs text-muted">As it appears on your National ID</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">M-Pesa Phone Number</label>
          <input className="input" value={f.phone} onChange={set('phone')} maxLength={13} inputMode="tel" placeholder="0712 345 678" />
          <p className="mt-1.5 text-xs text-muted">Safaricom number where you'll receive funds</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">National ID Number</label>
          <input className="input" value={f.idNumber} onChange={set('idNumber')} maxLength={8} inputMode="numeric" placeholder="12345678" />
          <p className="mt-1.5 text-xs text-muted">7 or 8 digit Kenyan National ID</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">Loan Purpose</label>
          <select className="input" value={f.loanType} onChange={set('loanType')}>
            <option value="">Select loan purpose</option>
            {LOAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-4">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        <button className="btn text-primary font-bold" disabled={checking}>
          {checking ? (
            <span className="flex items-center justify-center gap-2">
              <span className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              Verifying...
            </span>
          ) : (
            'Continue to Loan Offers'
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="rounded-2xl bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-ink">Your data is secure</p>
            <p className="text-xs text-muted">256-bit encryption protects your information. We never share your data with third parties.</p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        No paperwork • No guarantors • No CRB check required
      </p>
    </div>
  )
}
