export type BudgetItem = {
  category: 'People' | 'Clinical' | 'Regulatory' | 'Software' | 'Hardware' | 'Operations' | 'Legal'
  vendor: string
  cadence: 'Monthly' | 'Quarterly' | 'One-time'
  amountUsd: number
  startDateIso: string
  notes?: string
}

export const budgetAssumptions = {
  cashOnHandUsd: 250_000,
  currency: 'USD',
}

export const budgetItems: BudgetItem[] = [
  {
    category: 'People',
    vendor: 'Contract Engineering',
    cadence: 'Monthly',
    amountUsd: 18_000,
    startDateIso: '2026-01-01',
    notes: 'Placeholder — adjust to current plan',
  },
  {
    category: 'Legal',
    vendor: 'IP Counsel',
    cadence: 'Monthly',
    amountUsd: 6_000,
    startDateIso: '2026-01-01',
  },
  {
    category: 'Operations',
    vendor: 'Cloud + tooling',
    cadence: 'Monthly',
    amountUsd: 1_500,
    startDateIso: '2026-01-01',
  },
]
