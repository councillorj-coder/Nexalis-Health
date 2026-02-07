export type PipelineStage =
  | 'Lead'
  | 'Qualified'
  | 'Pilot'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost'

export type Deal = {
  id: string
  account: string
  stage: PipelineStage
  amountUsd: number
  probability: number
  closeDateIso?: string
  nextStep?: string
  owner: string
}

export const deals: Deal[] = [
  {
    id: 'D-001',
    account: 'Health System A',
    stage: 'Qualified',
    amountUsd: 120_000,
    probability: 0.35,
    closeDateIso: '2026-03-15',
    nextStep: 'Schedule stakeholder demo + security review',
    owner: 'Sales',
  },
  {
    id: 'D-002',
    account: 'Clinic Network B',
    stage: 'Pilot',
    amountUsd: 60_000,
    probability: 0.55,
    closeDateIso: '2026-02-20',
    nextStep: 'Pilot success criteria agreement',
    owner: 'Sales',
  },
  {
    id: 'D-003',
    account: 'Partner C',
    stage: 'Lead',
    amountUsd: 40_000,
    probability: 0.15,
    nextStep: 'Intro call',
    owner: 'CEO',
  },
]
