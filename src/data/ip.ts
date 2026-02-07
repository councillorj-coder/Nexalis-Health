export type IpDeadline = {
  id: string
  title: string
  dueDateIso: string
  owner: string
  link?: string
  notes?: string
}

export type PatentLink = {
  title: string
  url: string
  jurisdiction?: string
  classification?: string
}

export const ipDeadlines: IpDeadline[] = [
  {
    id: 'IP-001',
    title: 'Provisional filing — draft review',
    dueDateIso: '2026-01-10',
    owner: 'IP Counsel',
    link: 'https://example.com/patent-draft',
    notes: 'Placeholder link; replace with real docket entry',
  },
  {
    id: 'IP-002',
    title: 'Freedom-to-operate (FTO) search — initial results',
    dueDateIso: '2026-02-05',
    owner: 'IP Counsel',
  },
]

export const patents: PatentLink[] = [
  {
    title: 'Nexalis concept disclosure (placeholder)',
    url: 'https://example.com/ip/disclosure',
    jurisdiction: 'US',
    classification: 'CPC: A61B (placeholder)',
  },
]
