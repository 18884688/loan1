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
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-fade-in">
      <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg">
        <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">✓</span>
        <span>{current.phone} received <b>Ksh {current.amount.toLocaleString()}</b></span>
      </div>
    </div>
  )
}
