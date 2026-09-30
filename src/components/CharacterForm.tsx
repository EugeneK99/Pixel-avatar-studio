import { useState } from 'react'
import type { CharacterInput } from '../lib/promptBuilder'

interface Props {
  value: CharacterInput
  onChange: (next: CharacterInput) => void
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  textarea,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
}) {
  const cls =
    'w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm ' +
    'outline-none placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent'
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {textarea ? (
        <textarea
          className={cls + ' min-h-[64px] resize-y'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={cls}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function CharacterForm({ value, onChange }: Props) {
  const [hexDraft, setHexDraft] = useState('')
  const set = (patch: Partial<CharacterInput>) => onChange({ ...value, ...patch })

  const addHex = () => {
    const h = hexDraft.trim()
    if (HEX_RE.test(h) && !value.palette.includes(h)) {
      set({ palette: [...value.palette, h] })
    }
    setHexDraft('')
  }

  return (
    <div className="space-y-3">
      <Field
        label="캐릭터 / 프로젝트 이름"
        placeholder="예: 한복 프로젝트 아바타"
        value={value.name}
        onChange={(v) => set({ name: v })}
      />
      <Field
        label="헤어스타일"
        placeholder="예: 검은색 낮은 번헤어, 잔머리, 은장식 비녀 (#2A2A2A)"
        value={value.hair}
        onChange={(v) => set({ hair: v })}
      />
      <Field
        label="얼굴 / 표정"
        placeholder="예: 큰 눈, 차분한 표정, 옅은 홍조"
        value={value.face}
        onChange={(v) => set({ face: v })}
      />
      <Field
        label="의상"
        textarea
        placeholder="예: 청록색 치마저고리 한복, 흰 동정, 자주색 두루마기 겉감, 올리브 고름"
        value={value.outfit}
        onChange={(v) => set({ outfit: v })}
      />
      <Field
        label="액세서리"
        placeholder="예: 은비녀, 접부채, 진주 귀걸이"
        value={value.accessories}
        onChange={(v) => set({ accessories: v })}
      />

      {/* 색 팔레트 */}
      <div>
        <span className="mb-1 block text-xs font-medium text-muted">
          색 팔레트 (HEX) — 색 통일에 강력 추천
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {value.palette.map((hex) => (
            <button
              key={hex}
              onClick={() => set({ palette: value.palette.filter((h) => h !== hex) })}
              className="group flex items-center gap-1 rounded-full border border-white/10 bg-ink/60 py-1 pl-1 pr-2 text-xs"
              title="클릭하여 삭제"
            >
              <span
                className="h-4 w-4 rounded-full border border-white/20"
                style={{ backgroundColor: hex }}
              />
              {hex}
              <span className="text-muted group-hover:text-accent2">×</span>
            </button>
          ))}
          <div className="flex items-center gap-1">
            <input
              className="w-24 rounded-lg border border-white/10 bg-ink/60 px-2 py-1 text-xs outline-none focus:border-accent"
              placeholder="#F9C8D8"
              value={hexDraft}
              onChange={(e) => setHexDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addHex()}
            />
            <input
              type="color"
              className="h-7 w-7 cursor-pointer rounded border border-white/10 bg-transparent"
              value={HEX_RE.test(hexDraft) ? hexDraft : '#a78bfa'}
              onChange={(e) => setHexDraft(e.target.value)}
            />
            <button
              onClick={addHex}
              className="rounded-lg bg-accent/20 px-2 py-1 text-xs text-accent hover:bg-accent/30"
            >
              추가
            </button>
          </div>
        </div>
      </div>

      <Field
        label="추가 지시 (선택)"
        textarea
        placeholder="예: 그림자 배경 그리지 말 것, 불필요한 소품 제외"
        value={value.extra}
        onChange={(v) => set({ extra: v })}
      />
    </div>
  )
}
