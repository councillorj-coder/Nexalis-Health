import Card from '../components/Card'
import { codebasePlaceholder, githubProjectPlaceholder, sampleIssues } from '../data/issues'
import { formatDateISO } from '../lib/format'

function pillClass(status: string): string {
  switch (status) {
    case 'Done':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200'
    case 'Blocked':
      return 'bg-rose-50 text-rose-800 border-rose-200'
    case 'In Progress':
      return 'bg-amber-50 text-amber-900 border-amber-200'
    default:
      return 'bg-slate-50 text-slate-800 border-slate-200'
  }
}

export default function IssuesStatsTab() {
  const openCount = sampleIssues.filter((i) => i.status !== 'Done').length
  const p0Count = sampleIssues.filter((i) => i.priority === 'P0' && i.status !== 'Done').length

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Card title="GitHub Projects" subtitle="Integration placeholder">
          <div className="grid gap-2 text-sm text-slate-700">
            <div>
              Link: <a href={githubProjectPlaceholder.url}>{githubProjectPlaceholder.label}</a>
            </div>
            <div>
              Codebase: <a href={codebasePlaceholder.url}>{codebasePlaceholder.url}</a>
            </div>
            <div className="text-xs text-slate-600">
              Next step: create a GitHub Project, then replace the URL and wire in read-only metrics.
            </div>
          </div>
        </Card>

        <Card title="Snapshot" subtitle="High-level operational view">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-xs font-medium text-slate-600">Open items</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{openCount}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-xs font-medium text-slate-600">P0 open</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{p0Count}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Issues" subtitle="Placeholder list until GitHub Projects is connected">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-semibold text-slate-700">
              <tr>
                <th className="px-2 py-2">ID</th>
                <th className="px-2 py-2">Title</th>
                <th className="px-2 py-2">Area</th>
                <th className="px-2 py-2">Priority</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Owner</th>
                <th className="px-2 py-2">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sampleIssues.map((i) => (
                <tr key={i.id} className="align-top">
                  <td className="px-2 py-2 font-mono text-xs text-slate-700">{i.id}</td>
                  <td className="px-2 py-2 text-slate-900">{i.title}</td>
                  <td className="px-2 py-2 text-slate-700">{i.area}</td>
                  <td className="px-2 py-2 text-slate-700">{i.priority}</td>
                  <td className="px-2 py-2">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${pillClass(i.status)}`}
                    >
                      {i.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-slate-700">{i.owner}</td>
                  <td className="px-2 py-2 text-slate-700">
                    {i.dueDateIso ? formatDateISO(i.dueDateIso) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
