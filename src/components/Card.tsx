import type { ReactNode } from 'react'

export default function Card(props: {
  title: string
  subtitle?: string
  right?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{props.title}</h2>
          {props.subtitle ? (
            <p className="mt-0.5 text-xs text-slate-600">{props.subtitle}</p>
          ) : null}
        </div>
        {props.right ? <div className="text-xs text-slate-600">{props.right}</div> : null}
      </div>
      <div className="px-4 py-3">{props.children}</div>
    </section>
  )
}
