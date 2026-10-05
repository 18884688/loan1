import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { INTEREST, isSafaricom, ksh, load, save, TERM_DAYS, TIERS, maxLoan } from '../lib'

type Step = 'select' | 'confirm' | 'pay' | 'waiting' | 'success' | 'failed'

// Backend API URL - uses Vercel serverless function
const API_URL = import.meta.env.VITE_API_URL || '/api/mpesa'

export default function Offers() {
  const nav = useNavigate()
  const { applicant } = load()
  const [pick, setPick] = useState<[number, number] | null>(null)
  const [step, setStep] = useState<Step>('select')
  const [phone, setPhone] = useState(applicant?.phone ?? '')
  const [error, setError] = useState('')
  const [, setCheckoutId] = useState('')
  const [receipt, setReceipt] = useState('')

  if (!applicant) return <Navigate to="/eligibility" replace />

  const limit = maxLoan()

  const confirmLoan = () => {
    setStep('pay')
    setPhone(applicant.phone)
    setError('')
  }

  const sendStkForFee = async () => {
    if (!isSafaricom(phone)) {
      setError('Enter a valid Safaricom number, e.g. 0712 345 678.')
      return
    }
    setError('')
    setStep('waiting')

    const [amount, fee] = pick!
    const reference = `MKP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    try {
      const res = await fetch(`${API_URL}?action=initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: fee, // Pay the processing fee first
          reference,
          meta: { loan_amount: amount, fee, applicant_name: applicant.name }
        })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Failed to initiate payment')
        setStep('pay')
        return
      }

      setCheckoutId(data.checkout_id)
      // Start polling for payment status
      pollPaymentStatus(data.checkout_id, amount, fee, reference)

    } catch (err) {
      setError('Network error. Please try again.')
      setStep('pay')
    }
  }

  const pollPaymentStatus = async (checkoutId: string, loanAmount: number, fee: number, reference: string) => {
    let attempts = 0
    const maxAttempts = 60 // Poll for up to 2 minutes

    const poll = async () => {
      attempts++

      try {
        const res = await fetch(`${API_URL}?action=status&checkout_id=${checkoutId}`)
        const data = await res.json()

        if (data.status === 'paid') {
          // Fee paid successfully - save loan and show success
          setReceipt(data.receipt || '')
          save({
            loan: {
              amount: loanAmount,
              fee,
              ref: reference,
              date: new Date().toISOString(),
              feeReceipt: data.receipt
            }
          })
          setStep('success')
          return
        }

        if (data.status === 'failed') {
          setError(data.message || 'Payment was cancelled or failed')
          setStep('failed')
          return
        }

        // Still pending, continue polling
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000)
        } else {
          setError('Payment timed out. If you paid, please contact support.')
          setStep('failed')
        }
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000)
        }
      }
    }

    setTimeout(poll, 3000) // Start polling after 3 seconds
  }

  const goToDashboard = () => {
    nav('/dashboard')
  }

  const retry = () => {
    setStep('pay')
    setError('')
    setCheckoutId('')
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <p>Hi <b>{applicant.name.split(' ')[0]}</b>, you're eligible to borrow up to <b>{ksh(limit)}</b>. Select your preferred amount below.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TIERS.map(([amount, fee]) => {
          const ok = amount <= limit
          return (
            <button key={amount} disabled={!ok} onClick={() => { setPick([amount, fee]); setStep('confirm') }}
              className="card p-4 text-left transition enabled:hover:ring-2 enabled:hover:ring-primary disabled:opacity-40">
              <div className="text-lg font-bold text-primary-dark">{ksh(amount)}</div>
              <div className="text-xs text-muted">{ok ? `Fee: ${ksh(fee)}` : 'Above your limit'}</div>
            </button>
          )
        })}
      </div>

      <p className="text-xs text-muted">Pay the processing fee via M-Pesa, then receive your loan instantly.</p>

      {/* Confirm Modal */}
      {pick && step === 'confirm' && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/50 p-4" onClick={() => setStep('select')}>
          <div className="card w-full max-w-sm space-y-3" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Confirm Loan</h3>
            {[
              ['Loan Amount', ksh(pick[0])],
              ['Processing Fee', ksh(pick[1])],
              ['You Will Receive', ksh(pick[0])],
              [`Interest (${INTEREST * 100}%)`, ksh(pick[0] * INTEREST)],
              ['Total Repayment', ksh(Math.round(pick[0] * (1 + INTEREST)))],
              ['Due In', `${TERM_DAYS} days`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm"><span className="text-muted">{k}</span><b>{v}</b></div>
            ))}
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              You will pay <b>{ksh(pick[1])}</b> processing fee via M-Pesa first. Once confirmed, <b>{ksh(pick[0])}</b> will be sent to your phone.
            </p>
            <div className="flex gap-2 pt-2">
              <button className="w-full rounded-xl border py-3 font-medium" onClick={() => setStep('select')}>Cancel</button>
              <button className="btn" onClick={confirmLoan}>Pay Fee & Get Loan</button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Fee Modal */}
      {pick && step === 'pay' && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/50 p-4">
          <div className="card w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Pay Processing Fee</h3>
            <p className="text-sm text-muted">Pay <b>{ksh(pick[1])}</b> to receive your loan of <b>{ksh(pick[0])}</b>.</p>

            <label className="block text-sm font-medium">M-Pesa Phone Number
              <input className="input mt-1" value={phone} onChange={e => setPhone(e.target.value)} maxLength={13} inputMode="tel" placeholder="0712 345 678" />
            </label>

            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button className="w-full rounded-xl border py-3 font-medium" onClick={() => setStep('select')}>Cancel</button>
              <button className="btn" onClick={sendStkForFee}>Send STK Push</button>
            </div>
          </div>
        </div>
      )}

      {/* Waiting for Payment */}
      {pick && step === 'waiting' && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/50 p-4">
          <div className="card w-full max-w-sm space-y-4 py-6 text-center">
            <div className="mx-auto size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-medium">Check your phone</p>
            <div className="rounded-xl bg-slate-900 p-4 text-left text-sm text-white">
              <p className="text-xs text-slate-400">M-PESA</p>
              <p className="mt-1">Pay {ksh(pick[1])} to MKOPO HELA for loan processing fee?</p>
              <p className="mt-1 text-slate-400">Enter M-PESA PIN on your phone</p>
            </div>
            <p className="text-xs text-muted">Enter your M-Pesa PIN on your phone to complete payment.</p>
          </div>
        </div>
      )}

      {/* Success */}
      {pick && step === 'success' && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/50 p-4">
          <div className="card w-full max-w-sm space-y-4 py-6 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-3xl text-white">✓</div>
            <h3 className="text-xl font-semibold">Payment Received!</h3>
            <p className="text-muted">
              Fee of <b>{ksh(pick[1])}</b> paid successfully.
            </p>
            {receipt && <p className="text-xs text-muted">Receipt: {receipt}</p>}
            <p className="text-sm">
              <b>{ksh(pick[0])}</b> is being sent to <b>{phone}</b>
            </p>
            <p className="text-sm text-muted">
              Total repayment: {ksh(Math.round(pick[0] * (1 + INTEREST)))} due in {TERM_DAYS} days
            </p>
            <button className="btn" onClick={goToDashboard}>Go to Dashboard</button>
          </div>
        </div>
      )}

      {/* Failed */}
      {pick && step === 'failed' && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/50 p-4">
          <div className="card w-full max-w-sm space-y-4 py-6 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-500 text-3xl text-white">✗</div>
            <h3 className="text-xl font-semibold">Payment Failed</h3>
            <p className="text-sm text-muted">{error || 'The payment was not completed.'}</p>
            <div className="flex gap-2">
              <button className="w-full rounded-xl border py-3 font-medium" onClick={() => setStep('select')}>Cancel</button>
              <button className="btn" onClick={retry}>Try Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
