import Card from '../components/Card'
import { budgetAssumptions, budgetItems } from '../data/budget'
import { formatCurrency } from '../lib/format'

function computeMonthlyBurnUsd(): number {
  const monthly = budgetItems
    .map((i) => {
      if (i.cadence === 'Monthly') return i.amountUsd
      if (i.cadence === 'Quarterly') return i.amountUsd / 3
      return 0
    })
    .reduce((a, b) => a + b, 0)

  return Math.round(monthly)
}

export default function BudgetTab() {
  const monthlyBurn = computeMonthlyBurnUsd()
  const runwayMonths = monthlyBurn > 0 ? budgetAssumptions.cashOnHandUsd / monthlyBurn : 0

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Cash on hand" subtitle="Placeholder">
          <div className="text-2xl font-semibold text-slate-900">
            {formatCurrency(budgetAssumptions.cashOnHandUsd)}
          </div>
        </Card>
        <Card title="Monthly burn (modeled)" subtitle="Monthly + quarterly normalized">
          <div className="text-2xl font-semibold text-slate-900">{formatCurrency(monthlyBurn)}</div>
        </Card>
        <Card title="Runway" subtitle="Cash / burn">
          <div className="text-2xl font-semibold text-slate-900">
            {runwayMonths ? `${runwayMonths.toFixed(1)} months` : '—'}
          </div>
        </Card>
      </div>

      <Card title="Budget items" subtitle="Edit `src/data/budget.ts` to match the plan">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-semibold text-slate-700">
              <tr>
                <th className="px-2 py-2">Category</th>
                <th className="px-2 py-2">Vendor</th>
                <th className="px-2 py-2">Cadence</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Start</th>
                <th className="px-2 py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {budgetItems.map((i) => (
                <tr key={`${i.category}-${i.vendor}`} className="align-top">
                  <td className="px-2 py-2 text-slate-700">{i.category}</td>
                  <td className="px-2 py-2 text-slate-900">{i.vendor}</td>
                  <td className="px-2 py-2 text-slate-700">{i.cadence}</td>
                  <td className="px-2 py-2 text-slate-700">{formatCurrency(i.amountUsd)}</td>
                  <td className="px-2 py-2 text-slate-700">{i.startDateIso}</td>
                  <td className="px-2 py-2 text-slate-600">{i.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
