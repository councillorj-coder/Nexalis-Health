import Card from '../components/Card'
import { businessTasks, competitors } from '../data/business'
import { formatDateISO } from '../lib/format'

export default function BusinessTab() {
  return (
    <div className="grid gap-4">
      <Card title="Business tasks" subtitle="Strategy, partnerships, fundraising, ops">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-semibold text-slate-700">
              <tr>
                <th className="px-2 py-2">ID</th>
                <th className="px-2 py-2">Title</th>
                <th className="px-2 py-2">Owner</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {businessTasks.map((t) => (
                <tr key={t.id} className="align-top">
                  <td className="px-2 py-2 font-mono text-xs text-slate-700">{t.id}</td>
                  <td className="px-2 py-2 text-slate-900">{t.title}</td>
                  <td className="px-2 py-2 text-slate-700">{t.owner}</td>
                  <td className="px-2 py-2 text-slate-700">{t.status}</td>
                  <td className="px-2 py-2 text-slate-700">
                    {t.dueDateIso ? formatDateISO(t.dueDateIso) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Research & competition" subtitle="Competitive landscape placeholders">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-semibold text-slate-700">
              <tr>
                <th className="px-2 py-2">Competitor</th>
                <th className="px-2 py-2">Positioning</th>
                <th className="px-2 py-2">Strengths</th>
                <th className="px-2 py-2">Risks</th>
                <th className="px-2 py-2">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {competitors.map((c) => (
                <tr key={c.name} className="align-top">
                  <td className="px-2 py-2 text-slate-900">{c.name}</td>
                  <td className="px-2 py-2 text-slate-700">{c.positioning}</td>
                  <td className="px-2 py-2 text-slate-700">{c.strengths}</td>
                  <td className="px-2 py-2 text-slate-700">{c.risks}</td>
                  <td className="px-2 py-2 text-slate-700">{c.link ? <a href={c.link}>open</a> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
