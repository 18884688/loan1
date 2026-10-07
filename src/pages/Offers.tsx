import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { INTEREST, isSafaricom, ksh, load, save, TERM_DAYS, TIERS, maxLoan } from '../lib'

type Step = 'select' | 'confirm' | 'pay' | 'waiting' | 'success' | 'failed'

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
    const reference = `META-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    try {
      const res = await fetch(`${API_URL}?action=initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: fee,
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
      pollPaymentStatus(data.checkout_id, amount, fee, reference)

    } catch {
      setError('Network error. Please try again.')
      setStep('pay')
    }
  }

  const pollPaymentStatus = async (checkoutId: string, loanAmount: number, fee: number, reference: string) => {
    let attempts = 0
    const maxAttempts = 60

    const poll = async () => {
      attempts++

      try {
        const res = await fetch(`${API_URL}?action=status&checkout_id=${checkoutId}`)
        const data = await res.json()

        if (data.status === 'paid') {
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

    setTimeout(poll, 3000)
  }

  const goToDashboard = () => nav('/dashboard')
  const retry = () => { setStep('pay'); setError(''); setCheckoutId('') }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-green-500 text-sm font-bold text-white">✓</span>
        <span className="h-0.5 w-8 bg-green-500" />
        <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-white">2</span>
        <span className="h-0.5 w-8 bg-slate-200" />
        <span className="grid size-8 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-400">3</span>
      </div>

      {/* Approval Card */}
      <div className="card-dark">
        <div className="flex items-center gap-2 mb-4">
          <span className="badge bg-green-500/20 text-green-400">
            <span className="size-1.5 rounded-full bg-green-400" />
            Pre-Approved
          </span>
        </div>
        <p className="text-white/80">
          Congratulations <span className="font-semibold text-white">{applicant.name.split(' ')[0]}</span>, you qualify for up to
        </p>
        <p className="text-3xl font-bold text-accent mt-1">{ksh(limit)}</p>
      </div>

      {/* Loan Options */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Select Loan Amount</h3>
        <div className="grid grid-cols-2 gap-3">
          {TIERS.map(([amount, fee]) => {
            const ok = amount <= limit
            const selected = pick?.[0] === amount
            return (
              <button
                key={amount}
                disabled={!ok}
                onClick={() => { setPick([amount, fee]); setStep('confirm') }}
                className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                  selected ? 'border-accent bg-accent/5 ring-4 ring-accent/20' :
                  ok ? 'border-slate-200 bg-white hover:border-primary hover:shadow-lg' :
                  'border-slate-100 bg-slate-50 opacity-50'
                }`}
              >
                {amount >= 50000 && ok && (
                  <span className="absolute -top-2 right-3 badge bg-accent text-primary text-[10px]">Popular</span>
                )}
                <p className="text-xl font-bold text-ink">{ksh(amount)}</p>
                <p className="text-xs text-muted mt-1">
                  {ok ? `Processing fee: ${ksh(fee)}` : 'Above limit'}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        Processing fee is a one-time payment. Loan disbursed instantly via M-Pesa.
      </p>

      {/* Confirm Modal */}
      {pick && step === 'confirm' && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setStep('select')}>
          <div className="card w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-ink mb-4">Loan Summary</h3>
            <div className="space-y-3 border-b border-slate-100 pb-4">
              {[
                ['Loan Amount', ksh(pick[0])],
                ['Processing Fee', ksh(pick[1])],
                ['You Receive', ksh(pick[0])],
                [`Interest (${INTEREST * 100}%)`, ksh(pick[0] * INTEREST)],
                ['Total Repayment', ksh(Math.round(pick[0] * (1 + INTEREST)))],
                ['Repayment Period', `${TERM_DAYS} days`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-muted">{k}</span>
                  <span className="font-semibold text-ink">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
              <p className="text-sm text-amber-800">
                Pay <span className="font-bold">{ksh(pick[1])}</span> processing fee to receive <span className="font-bold">{ksh(pick[0])}</span> instantly.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-outline flex-1" onClick={() => setStep('select')}>Cancel</button>
              <button className="btn flex-1 text-primary" onClick={confirmLoan}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {pick && step === 'pay' && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-ink mb-2">Complete Payment</h3>
            <p className="text-sm text-muted mb-6">Pay <span className="font-semibold text-ink">{ksh(pick[1])}</span> to activate your loan</p>

            <label className="block mb-4">
              <span className="text-sm font-semibold text-ink">M-Pesa Number</span>
              <input className="input mt-2" value={phone} onChange={e => setPhone(e.target.value)} maxLength={13} inputMode="tel" placeholder="0712 345 678" />
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3 mb-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button className="btn-outline flex-1" onClick={() => setStep('select')}>Cancel</button>
              <button className="btn flex-1 text-primary" onClick={sendStkForFee}>Pay {ksh(pick[1])}</button>
            </div>
          </div>
        </div>
      )}

      {/* Waiting Modal */}
      {pick && step === 'waiting' && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-sm py-8 text-center">
            <div className="mx-auto size-16 mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
              <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Check Your Phone</h3>
            <div className="rounded-xl bg-slate-900 p-4 text-left my-6">
              <p className="text-xs text-slate-400 mb-1">M-PESA</p>
              <p className="text-sm text-white">Pay {ksh(pick[1])} to META INSTANT LOAN?</p>
              <p className="text-xs text-slate-400 mt-2">Enter M-PESA PIN to confirm</p>
            </div>
            <p className="text-xs text-muted">Waiting for payment confirmation...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {pick && step === 'success' && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-sm py-8 text-center">
            <div className="mx-auto size-16 grid place-items-center rounded-full bg-green-500 text-3xl text-white mb-4 animate-float">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">Payment Successful!</h3>
            <p className="text-muted mb-4">Processing fee of {ksh(pick[1])} received</p>
            {receipt && <p className="text-xs text-muted mb-4">Receipt: {receipt}</p>}

            <div className="rounded-xl bg-primary/5 p-4 mb-6">
              <p className="text-sm text-muted">Disbursing</p>
              <p className="text-2xl font-bold text-primary">{ksh(pick[0])}</p>
              <p className="text-sm text-muted">to {phone}</p>
            </div>

            <p className="text-xs text-muted mb-6">
              Total repayment: {ksh(Math.round(pick[0] * (1 + INTEREST)))} due in {TERM_DAYS} days
            </p>

            <button className="btn text-primary" onClick={goToDashboard}>View Dashboard</button>
          </div>
        </div>
      )}

      {/* Failed Modal */}
      {pick && step === 'failed' && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-sm py-8 text-center">
            <div className="mx-auto size-16 grid place-items-center rounded-full bg-red-500 text-3xl text-white mb-4">✗</div>
            <h3 className="text-xl font-bold text-ink mb-2">Payment Failed</h3>
            <p className="text-sm text-muted mb-6">{error || 'The payment was not completed.'}</p>
            <div className="flex gap-3">
              <button className="btn-outline flex-1" onClick={() => setStep('select')}>Cancel</button>
              <button className="btn flex-1 text-primary" onClick={retry}>Try Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
