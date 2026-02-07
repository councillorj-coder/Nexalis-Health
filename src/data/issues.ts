export type ProjectLink = {
  label: string
  url: string
}

export type IssueItem = {
  id: string
  title: string
  area: 'Regulatory' | 'Quality' | 'R&D' | 'Clinical' | 'Operations' | 'Sales' | 'Finance'
  priority: 'P0' | 'P1' | 'P2'
  status: 'Backlog' | 'In Progress' | 'Blocked' | 'Done'
  owner: string
  dueDateIso?: string
}

export const githubProjectPlaceholder: ProjectLink = {
  label: 'GitHub Project (placeholder — create later)',
  url: 'https://github.com/orgs/<org>/projects/<number>',
}

export const codebasePlaceholder: ProjectLink = {
  label: 'Codebase (placeholder)',
  url: 'https://github.com/WinWinLabs/Nexalis_Health',
}

export const sampleIssues: IssueItem[] = [
  {
    id: 'ISS-001',
    title: 'Define product requirements & clinical claims baseline',
    area: 'Clinical',
    priority: 'P0',
    status: 'Backlog',
    owner: 'CEO',
    dueDateIso: '2026-01-15',
  },
  {
    id: 'ISS-002',
    title: 'Draft Quality Management System (QMS) outline',
    area: 'Quality',
    priority: 'P1',
    status: 'Backlog',
    owner: 'QA Lead',
    dueDateIso: '2026-02-01',
  },
  {
    id: 'ISS-003',
    title: 'Prototype dashboard data ingestion (GitHub Projects API)',
    area: 'R&D',
    priority: 'P2',
    status: 'Backlog',
    owner: 'Eng Lead',
  },
]
