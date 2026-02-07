export type Competitor = {
  name: string
  positioning: string
  strengths: string
  risks: string
  link?: string
}

export type BusinessTask = {
  id: string
  title: string
  owner: string
  status: 'Backlog' | 'In Progress' | 'Blocked' | 'Done'
  dueDateIso?: string
}

export const businessTasks: BusinessTask[] = [
  {
    id: 'BIZ-001',
    title: 'Define pricing model & reimbursement strategy (placeholder)',
    owner: 'CEO',
    status: 'Backlog',
    dueDateIso: '2026-02-15',
  },
  {
    id: 'BIZ-002',
    title: 'Competitive landscape review (quarterly)',
    owner: 'BizOps',
    status: 'Backlog',
  },
]

export const competitors: Competitor[] = [
  {
    name: 'Competitor A (placeholder)',
    positioning: 'Clinical decision support',
    strengths: 'Installed base',
    risks: 'Legacy tech stack',
    link: 'https://example.com/competitor-a',
  },
  {
    name: 'Competitor B (placeholder)',
    positioning: 'Workflow automation',
    strengths: 'Strong partnerships',
    risks: 'Narrow product scope',
  },
]
