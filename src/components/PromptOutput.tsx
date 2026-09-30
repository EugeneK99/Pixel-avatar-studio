import { useState } from 'react'

export function PromptOutput({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // 클립보드 접근 실패 시 무시 (사용자가 수동 선택 가능)
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-ink/60">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          생성된 프롬프트
        </span>
        <button
          onClick={copy}
          className="rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-ink transition hover:bg-accent/80"
        >
          {copied ? '✓ 복사됨' : '복사'}
        </button>
      </div>
      <pre className="max-h-[340px] overflow-auto whitespace-pre-wrap px-4 py-3 text-xs leading-relaxed text-ece9f5">
        {prompt}
      </pre>
    </div>
  )
}
