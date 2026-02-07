import Card from '../components/Card'
import { electricalResources, mechanicalResources, technicalLinks } from '../data/technical'

function LinkList(props: { items: { label: string; url: string; notes?: string }[] }) {
  return (
    <div className="grid gap-2">
      {props.items.map((l) => (
        <div key={l.url} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-sm font-semibold text-slate-900">
            <a href={l.url}>{l.label}</a>
          </div>
          {l.notes ? <div className="mt-1 text-xs text-slate-600">{l.notes}</div> : null}
        </div>
      ))}
    </div>
  )
}

export default function TechnicalTab() {
  return (
    <div className="grid gap-4">
      <Card title="Engineering" subtitle="Codebase and technical docs">
        <LinkList items={technicalLinks} />
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card title="Mechanical" subtitle="CAD, BOM, manufacturing artifacts">
          <LinkList items={mechanicalResources} />
        </Card>
        <Card title="Electrical" subtitle="Schematics, PCB, firmware assets">
          <LinkList items={electricalResources} />
        </Card>
      </div>

      <Card title="Roadmap notes" subtitle="Keep this aligned with GitHub Projects">
        <div className="text-sm text-slate-700">
          Use this tab to keep authoritative links to designs and sources of truth.
        </div>
      </Card>
    </div>
  )
}
