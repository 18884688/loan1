import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { INTEREST, isSafaricom, ksh, load, reset, save, TERM_DAYS } from '../lib'

type Step = 'form' | 'waiting' | 'done'

export default function Dashboard() {
  const nav = useNavigate()
  const [{ applicant, loan }, setState] = useState(load)
  const [step, setStep] = useState<Step | null>(null)
  const [phone, setPhone] = useState(applicant?.phone ?? '')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  if (!applicant || !loan) return <Navigate to="/" replace />

  const total = Math.round(loan.amount * (1 + INTEREST))
  const balance = total - (loan.paid ?? 0)
  const due = new Date(new Date(loan.date).getTime() + TERM_DAYS * 864e5).toLocaleDateString('en-KE')
  const rows = [
    ['Loan Amount', ksh(loan.amount)],
    ['Processing Fee', ksh(loan.fee)],
    ['Amount Received', ksh(loan.amount - loan.fee)],
    ['Total Repayment', ksh(total)],
    ['Paid So Far', ksh(loan.paid ?? 0)],
    ['Balance', ksh(balance)],
    ['Due Date', due],
    ['Reference', loan.ref],
  ]

  const openRepay = () => { setAmount(String(balance)); setError(''); setStep('form') }

  const sendStk = () => {
    const amt = Number(amount)
    if (!isSafaricom(phone)) return setError('Enter a valid Safaricom number, e.g. 0712 345 678.')
    if (!(amt >= 1 && amt <= balance)) return setError(`Enter an amount between Ksh 1 and ${ksh(balance)}.`)
    setError('')
    setStep('waiting')
    // ponytail: STK push via Safaricom Daraja + callback URL
    setTimeout(() => {
      const next = { ...loan, paid: (loan.paid ?? 0) + amt }
      save({ loan: next })
      setState({ applicant, loan: next })
      setStep('done')
    }, 4000)
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold">Welcome, {applicant.name.split(' ')[0]}</h2>
        <p className="text-sm text-muted">Your loan dashboard</p>
      </div>
      <div className="card space-y-2">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">Loan Status</h3>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
            {balance > 0 ? 'Active' : 'Fully Repaid'}
          </span>
        </div>
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm"><span className="text-muted">{k}</span><b>{v}</b></div>
        ))}
      </div>
      {balance > 0 && <button className="btn" onClick={openRepay}>Repay via M-Pesa</button>}
      <button className="w-full rounded-xl border bg-white py-3 font-medium" onClick={() => { reset(); nav('/eligibility') }}>Apply for Another Loan</button>
      <button className="w-full rounded-xl border bg-white py-3 font-medium" onClick={() => { reset(); nav('/') }}>Log out</button>

      {step && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/50 p-4" onClick={() => step !== 'waiting' && setStep(null)}>
          <div className="card w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            {step === 'form' && (
              <>
                <h3 className="text-lg font-semibold">Repay via M-Pesa</h3>
                <label className="block text-sm font-medium">M-Pesa Phone Number
                  <input className="input mt-1" value={phone} onChange={e => setPhone(e.target.value)} maxLength={13} inputMode="tel" placeholder="0712 345 678" />
                </label>
                <label className="block text-sm font-medium">Amount (Ksh)
                  <input className="input mt-1" value={amount} onChange={e => setAmount(e.target.value)} inputMode="numeric" />
                </label>
                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-2">
                  <button className="w-full rounded-xl border py-3 font-medium" onClick={() => setStep(null)}>Cancel</button>
                  <button className="btn" onClick={sendStk}>Send STK Push</button>
                </div>
              </>
            )}
            {step === 'waiting' && (
              <div className="space-y-4 py-2 text-center">
                <div className="mx-auto size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="font-medium">Check your phone</p>
                <div className="rounded-xl bg-slate-900 p-4 text-left text-sm text-white">
                  <p className="text-xs text-slate-400">M-PESA</p>
                  <p className="mt-1">Pay {ksh(Number(amount))} to MKOPO HELA, account {loan.ref}?</p>
                  <p className="mt-1 text-slate-400">Enter M-PESA PIN on your phone</p>
                </div>
                <p className="text-xs text-muted">You will receive an M-Pesa prompt on your phone. Never enter your PIN on a website.</p>
              </div>
            )}
            {step === 'done' && (
              <div className="space-y-3 py-2 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-2xl text-white">✓</div>
                <p className="font-semibold">Payment received</p>
                <p className="text-sm text-muted">New balance: {ksh(balance)}</p>
                <button className="btn" onClick={() => setStep(null)}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
