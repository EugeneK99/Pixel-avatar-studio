import type { StyleSpec } from '../lib/styleSpecs'

export function SpecBadges({ spec }: { spec: StyleSpec }) {
  return (
    <div className="rounded-xl border border-white/10 bg-panel/60 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
        <span>🔒</span> 고정 규격 (일관성 보장)
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
        {spec.humanSpec.map((item) => (
          <div key={item.label}>
            <div className="text-[10px] uppercase text-muted">{item.label}</div>
            <div className="text-sm font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
