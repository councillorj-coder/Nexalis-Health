export type ResourceLink = {
  label: string
  url: string
  owner?: string
  notes?: string
}

export const technicalLinks: ResourceLink[] = [
  {
    label: 'Repository',
    url: 'https://github.com/WinWinLabs/Nexalis_Health',
    notes: 'Replace if repo URL differs',
  },
  {
    label: 'Architecture Doc (placeholder)',
    url: 'https://example.com/tech/architecture',
  },
]

export const mechanicalResources: ResourceLink[] = [
  { label: 'CAD (placeholder)', url: 'https://example.com/mech/cad' },
  { label: 'BOM (placeholder)', url: 'https://example.com/mech/bom' },
]

export const electricalResources: ResourceLink[] = [
  { label: 'Schematics (placeholder)', url: 'https://example.com/ee/schematics' },
  { label: 'PCB layouts (placeholder)', url: 'https://example.com/ee/pcb' },
]
