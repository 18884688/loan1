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
    <form onSubmit={submit} className="card space-y-4" noValidate>
      <div className="flex items-center gap-2 text-primary">
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <h2 className="text-xl font-semibold">Personal Information</h2>
      </div>

      <div>
        <input className="input" value={f.name} onChange={set('name')} maxLength={80} autoComplete="name" placeholder="Full Name" />
        <p className="mt-1 text-xs text-muted">Enter your full name as on your national ID</p>
      </div>

      <div>
        <input className="input" value={f.phone} onChange={set('phone')} maxLength={13} inputMode="tel" placeholder="Phone Number" />
        <p className="mt-1 text-xs text-muted">Safaricom only — e.g. 0712 345 678 or 0110 123 456</p>
      </div>

      <div>
        <input className="input" value={f.idNumber} onChange={set('idNumber')} maxLength={8} inputMode="numeric" placeholder="National ID Number" />
        <p className="mt-1 text-xs text-muted">7 or 8 digit Kenyan National ID number</p>
      </div>

      <div>
        <select className="input" value={f.loanType} onChange={set('loanType')}>
          <option value="">Select Loan Type</option>
          {LOAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <p className="mt-1 text-xs text-muted">Choose the purpose of your loan</p>
      </div>

      <div className="flex justify-center gap-6 py-2">
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

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button className="btn" disabled={checking}>
        {checking ? 'Checking…' : 'Check Eligibility →'}
      </button>

      <p className="text-center text-xs text-muted">No paperwork required. No guarantors needed.</p>
    </form>
  )
}
