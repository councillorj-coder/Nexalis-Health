export type TabKey =
  | 'issues'
  | 'budget'
  | 'pipeline'
  | 'ip'
  | 'technical'
  | 'business'

export type TabDef = {
  key: TabKey
  label: string
}

const tabs: TabDef[] = [
  { key: 'issues', label: 'Issues & Stats' },
  { key: 'budget', label: 'Budget' },
  { key: 'pipeline', label: 'Sales Pipeline' },
  { key: 'ip', label: 'IP' },
  { key: 'technical', label: 'Technical' },
  { key: 'business', label: 'Business' },
]

export function allTabs(): TabDef[] {
  return tabs
}

export function TabNav(props: {
  active: TabKey
  onChange: (tab: TabKey) => void
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Dashboard sections">
      {tabs.map((t) => {
        const isActive = t.key === props.active
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => props.onChange(t.key)}
            className={
              isActive
                ? 'rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white'
                : 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:border-slate-300'
            }
            aria-current={isActive ? 'page' : undefined}
          >
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}
