import Card from '../components/Card'
import { deals } from '../data/pipeline'
import { formatCurrency, formatDateISO } from '../lib/format'

export default function PipelineTab() {
  const openDeals = deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost')
  const totalOpen = openDeals.reduce((a, d) => a + d.amountUsd, 0)
  const weighted = openDeals.reduce((a, d) => a + d.amountUsd * d.probability, 0)

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Open pipeline" subtitle="Sum of open deals">
          <div className="text-2xl font-semibold text-slate-900">{formatCurrency(totalOpen)}</div>
        </Card>
        <Card title="Weighted forecast" subtitle="Amount × probability">
          <div className="text-2xl font-semibold text-slate-900">{formatCurrency(Math.round(weighted))}</div>
        </Card>
        <Card title="Open deals" subtitle="Active opportunities">
          <div className="text-2xl font-semibold text-slate-900">{openDeals.length}</div>
        </Card>
      </div>

      <Card title="Deals" subtitle="Placeholder CRM; wire to your system later">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-semibold text-slate-700">
              <tr>
                <th className="px-2 py-2">Account</th>
                <th className="px-2 py-2">Stage</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Prob.</th>
                <th className="px-2 py-2">Weighted</th>
                <th className="px-2 py-2">Close</th>
                <th className="px-2 py-2">Next step</th>
                <th className="px-2 py-2">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {deals.map((d) => (
                <tr key={d.id} className="align-top">
                  <td className="px-2 py-2 text-slate-900">{d.account}</td>
                  <td className="px-2 py-2 text-slate-700">{d.stage}</td>
                  <td className="px-2 py-2 text-slate-700">{formatCurrency(d.amountUsd)}</td>
                  <td className="px-2 py-2 text-slate-700">{Math.round(d.probability * 100)}%</td>
                  <td className="px-2 py-2 text-slate-700">
                    {formatCurrency(Math.round(d.amountUsd * d.probability))}
                  </td>
                  <td className="px-2 py-2 text-slate-700">
                    {d.closeDateIso ? formatDateISO(d.closeDateIso) : '—'}
                  </td>
                  <td className="px-2 py-2 text-slate-700">{d.nextStep ?? '—'}</td>
                  <td className="px-2 py-2 text-slate-700">{d.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
