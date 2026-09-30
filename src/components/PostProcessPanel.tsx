import { useState } from 'react'
import type { StyleSpec } from '../lib/styleSpecs'
import { processImage, type ProcessResult } from '../lib/imageProcessor'
import { ImageDrop } from './ImageDrop'

export function PostProcessPanel({ spec }: { spec: StyleSpec }) {
  const [src, setSrc] = useState<string | null>(null)
  const [result, setResult] = useState<ProcessResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    if (!src) return
    setBusy(true)
    setError(null)
    try {
      const r = await processImage(src, spec.post)
      setResult(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : '처리 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.dataUrl
    a.download = `avatar-${spec.id}-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        AI가 생성한 이미지를 여기에 넣으면{' '}
        <span className="text-accent">{spec.label}</span> 규격에 맞춰
        자동으로 통일합니다. (리사이즈
        {spec.post.pixelGrid ? ' · 픽셀화' : ''}
        {spec.post.maxColors ? ` · ${spec.post.maxColors}색 양자화` : ''} · 투명 배경)
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageDrop
          label="입력 이미지"
          hint="ChatGPT 등에서 생성한 결과물"
          src={src}
          onFile={(s) => {
            setSrc(s)
            setResult(null)
          }}
        />
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-muted">규격화 결과</span>
            {result && (
              <button onClick={download} className="text-xs text-accent hover:underline">
                PNG 다운로드
              </button>
            )}
          </div>
          <div className="checkerboard flex min-h-[180px] items-center justify-center rounded-xl border border-white/15 p-3">
            {result ? (
              <img
                src={result.dataUrl}
                alt="result"
                className="pixelated max-h-[320px] max-w-full rounded object-contain"
              />
            ) : (
              <span className="text-sm text-muted">결과가 여기에 표시됩니다</span>
            )}
          </div>
          {result && (
            <div className="mt-2 text-xs text-muted">
              {result.width}×{result.height}px
              {result.colorCount >= 0 && ` · ${result.colorCount}색 사용`}
            </div>
          )}
        </div>
      </div>

      {error && <div className="text-sm text-accent2">⚠️ {error}</div>}

      <button
        onClick={run}
        disabled={!src || busy}
        className="w-full rounded-xl bg-accent2 py-3 text-sm font-semibold text-ink transition hover:bg-accent2/80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? '처리 중…' : '✨ 규격에 맞춰 자동 정리'}
      </button>
    </div>
  )
}
