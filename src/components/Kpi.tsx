import type { ReactNode } from 'react'

export default function Kpi(props: { label: string; value: string; hint?: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs font-medium text-slate-600">{props.label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{props.value}</div>
      {props.hint ? <div className="mt-1 text-xs text-slate-600">{props.hint}</div> : null}
    </div>
  )
}
