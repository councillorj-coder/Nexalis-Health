import Card from '../components/Card'
import { ipDeadlines, patents } from '../data/ip'
import { daysUntil, formatDateISO } from '../lib/format'

export default function IpTab() {
  const sorted = [...ipDeadlines].sort((a, b) => a.dueDateIso.localeCompare(b.dueDateIso))

  return (
    <div className="grid gap-4">
      <Card title="Upcoming IP deadlines" subtitle="Docket placeholders">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-semibold text-slate-700">
              <tr>
                <th className="px-2 py-2">Deadline</th>
                <th className="px-2 py-2">Due</th>
                <th className="px-2 py-2">Days</th>
                <th className="px-2 py-2">Owner</th>
                <th className="px-2 py-2">Link</th>
                <th className="px-2 py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sorted.map((d) => (
                <tr key={d.id} className="align-top">
                  <td className="px-2 py-2 text-slate-900">{d.title}</td>
                  <td className="px-2 py-2 text-slate-700">{formatDateISO(d.dueDateIso)}</td>
                  <td className="px-2 py-2 text-slate-700">{daysUntil(d.dueDateIso)}</td>
                  <td className="px-2 py-2 text-slate-700">{d.owner}</td>
                  <td className="px-2 py-2 text-slate-700">{d.link ? <a href={d.link}>open</a> : '—'}</td>
                  <td className="px-2 py-2 text-slate-600">{d.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Patents & classifications" subtitle="Links + CPC/IPC placeholders">
        <div className="grid gap-2 text-sm">
          {patents.map((p) => (
            <div
              key={p.url}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <div className="font-semibold text-slate-900">
                <a href={p.url}>{p.title}</a>
              </div>
              <div className="mt-1 text-xs text-slate-600">
                {p.jurisdiction ? `Jurisdiction: ${p.jurisdiction}` : null}
                {p.jurisdiction && p.classification ? ' • ' : null}
                {p.classification ? `Classification: ${p.classification}` : null}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
