import { STYLE_LIST, type StyleId } from '../lib/styleSpecs'

interface Props {
  value: StyleId
  onChange: (id: StyleId) => void
}

export function StylePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STYLE_LIST.map((s) => {
        const active = s.id === value
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={
              'text-left rounded-xl border p-4 transition-all ' +
              (active
                ? 'border-accent bg-panel2 shadow-glow'
                : 'border-white/10 bg-panel hover:border-white/25')
            }
          >
            <div className="flex items-center gap-2 text-base font-semibold">
              <span className="text-xl">{s.emoji}</span>
              {s.label}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{s.blurb}</p>
          </button>
        )
      })}
    </div>
  )
}
