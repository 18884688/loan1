import { useEffect, useState } from 'react'

// ponytail: 100 random masked phones + amounts for social proof
const PROOFS = Array.from({ length: 100 }, () => {
  const prefix = ['07', '01'][Math.floor(Math.random() * 2)]
  const mid = Math.floor(Math.random() * 90 + 10)
  const end = Math.floor(Math.random() * 90 + 10)
  const amounts = [10000, 15000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000]
  const amount = amounts[Math.floor(Math.random() * amounts.length)]
  return { phone: `${prefix}${mid}****${end}`, amount }
})

export default function SocialProof() {
  const [current, setCurrent] = useState<typeof PROOFS[0] | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let idx = Math.floor(Math.random() * PROOFS.length)

    const show = () => {
      idx = (idx + 1) % PROOFS.length
      setCurrent(PROOFS[idx])
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
    }

    show()
    const interval = setInterval(show, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!current || !visible) return null

  return (
    <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 animate-fade-in">
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-2xl shadow-slate-300/50 border border-slate-100">
        <span className="grid size-8 place-items-center rounded-full bg-green-500 text-sm text-white">✓</span>
        <div className="text-sm">
          <span className="font-medium text-ink">{current.phone}</span>
          <span className="text-muted"> received </span>
          <span className="font-bold text-green-600">Ksh {current.amount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
