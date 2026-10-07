// Loan tiers: [amount, processing fee] in Ksh. Fee is deducted at disbursement, never collected upfront.
export const TIERS: [number, number][] = [
  [1, 1], // ponytail: test tier, remove for production
  [10000, 200], [15000, 300], [20000, 400], [30000, 600], [40000, 800], [50000, 1000],
  [60000, 1200], [70000, 1400], [80000, 1600], [90000, 1800], [100000, 2000],
]
export const INTEREST = 0.075 // 7.5% for qualified borrowers
export const TERM_DAYS = 90 // 30-90 days flexible

// All tiers available - no income-based restriction
export const maxLoan = () => TIERS[TIERS.length - 1][0]

export const isSafaricom = (p: string) => /^(?:\+?254|0)(?:7\d{8}|1[01]\d{7})$/.test(p.replace(/\s/g, ''))
export const isNationalId = (id: string) => /^\d{7,8}$/.test(id)

export const ksh = (n: number) => `Ksh ${Math.round(n).toLocaleString()}`

export type Applicant = { name: string; phone: string; idNumber: string; loanType: string; income?: number }
export type Loan = { amount: number; fee: number; ref: string; date: string; paid?: number; feeReceipt?: string }
type State = { applicant?: Applicant; loan?: Loan }

// ponytail: localStorage only — swap for Supabase when backend is ready
const KEY = 'mkopo-hela'
export const load = (): State => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
export const save = (patch: State) => {
  try { localStorage.setItem(KEY, JSON.stringify({ ...load(), ...patch })) } catch { /* private mode */ }
}
export const reset = () => {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
}
