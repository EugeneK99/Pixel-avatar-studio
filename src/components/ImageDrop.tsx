import { useCallback, useRef, useState } from 'react'

interface Props {
  label: string
  hint: string
  src: string | null
  onFile: (dataUrl: string | null) => void
}

export function ImageDrop({ label, hint, src, onFile }: Props) {
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const read = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => onFile(reader.result as string)
      reader.readAsDataURL(file)
    },
    [onFile],
  )

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        {src && (
          <button
            onClick={() => onFile(null)}
            className="text-xs text-muted hover:text-accent2"
          >
            제거
          </button>
        )}
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          const f = e.dataTransfer.files[0]
          if (f) read(f)
        }}
        onClick={() => inputRef.current?.click()}
        className={
          'checkerboard flex min-h-[180px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-3 transition-colors ' +
          (drag ? 'border-accent bg-accent/5' : 'border-white/15 hover:border-white/30')
        }
      >
        {src ? (
          <img
            src={src}
            alt="preview"
            className="pixelated max-h-[320px] max-w-full rounded object-contain"
          />
        ) : (
          <div className="text-center text-sm text-muted">
            <div className="mb-1 text-2xl">🖼️</div>
            <div>클릭 또는 드래그하여 업로드</div>
            <div className="mt-1 text-xs text-muted/70">{hint}</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) read(f)
          }}
        />
      </div>
    </div>
  )
}
