import type { PostProcessSpec } from './styleSpecs'

/**
 * 후처리 규격화 엔진.
 *
 * AI가 매번 다르게 뱉어내는 이미지를 스타일 규격(PostProcessSpec)에
 * 맞춰 강제로 통일한다:
 *   1) 정사각형 캔버스에 컨테인(비율 유지) 배치
 *   2) 흰색 근처 배경 → 투명 처리
 *   3) 픽셀화(다운샘플 후 니어리스트로 업스케일)
 *   4) 색 팔레트 양자화(median cut)로 최대 색상 수 제한
 */

export interface ProcessResult {
  dataUrl: string
  width: number
  height: number
  colorCount: number
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'))
    img.src = src
  })
}

/** 흰색 근처 픽셀을 투명하게 (플러드 없이 전역 임계값 방식) */
function removeWhiteBg(data: Uint8ClampedArray, threshold: number) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0
    }
  }
}

// ---- Median cut 색 양자화 ----
interface Pixel {
  r: number
  g: number
  b: number
}

function medianCut(pixels: Pixel[], depth: number): Pixel[] {
  if (pixels.length === 0) return []
  if (depth === 0 || pixels.length === 1) {
    const avg = pixels.reduce(
      (acc, p) => {
        acc.r += p.r
        acc.g += p.g
        acc.b += p.b
        return acc
      },
      { r: 0, g: 0, b: 0 },
    )
    const n = pixels.length
    return [{ r: avg.r / n, g: avg.g / n, b: avg.b / n }]
  }

  // 가장 넓은 채널 찾기
  const ranges = { r: [255, 0], g: [255, 0], b: [255, 0] }
  for (const p of pixels) {
    ranges.r[0] = Math.min(ranges.r[0], p.r)
    ranges.r[1] = Math.max(ranges.r[1], p.r)
    ranges.g[0] = Math.min(ranges.g[0], p.g)
    ranges.g[1] = Math.max(ranges.g[1], p.g)
    ranges.b[0] = Math.min(ranges.b[0], p.b)
    ranges.b[1] = Math.max(ranges.b[1], p.b)
  }
  const spanR = ranges.r[1] - ranges.r[0]
  const spanG = ranges.g[1] - ranges.g[0]
  const spanB = ranges.b[1] - ranges.b[0]
  const channel: keyof Pixel = spanR >= spanG && spanR >= spanB ? 'r' : spanG >= spanB ? 'g' : 'b'

  pixels.sort((a, b) => a[channel] - b[channel])
  const mid = Math.floor(pixels.length / 2)
  return [
    ...medianCut(pixels.slice(0, mid), depth - 1),
    ...medianCut(pixels.slice(mid), depth - 1),
  ]
}

function buildPalette(data: Uint8ClampedArray, maxColors: number): Pixel[] {
  const sample: Pixel[] = []
  // 성능을 위해 최대 ~20k 픽셀만 샘플링
  const step = Math.max(4, Math.floor(data.length / 4 / 20000) * 4)
  for (let i = 0; i < data.length; i += step) {
    if (data[i + 3] < 128) continue // 투명 픽셀 제외
    sample.push({ r: data[i], g: data[i + 1], b: data[i + 2] })
  }
  if (sample.length === 0) return []
  const depth = Math.ceil(Math.log2(maxColors))
  return medianCut(sample, depth).slice(0, maxColors)
}

function nearest(palette: Pixel[], r: number, g: number, b: number): Pixel {
  let best = palette[0]
  let bestD = Infinity
  for (const p of palette) {
    const d = (p.r - r) ** 2 + (p.g - g) ** 2 + (p.b - b) ** 2
    if (d < bestD) {
      bestD = d
      best = p
    }
  }
  return best
}

function quantize(data: Uint8ClampedArray, maxColors: number): number {
  const palette = buildPalette(data, maxColors)
  if (palette.length === 0) return 0
  const used = new Set<string>()
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) {
      data[i + 3] = 0
      continue
    }
    const p = nearest(palette, data[i], data[i + 1], data[i + 2])
    data[i] = Math.round(p.r)
    data[i + 1] = Math.round(p.g)
    data[i + 2] = Math.round(p.b)
    data[i + 3] = 255
    used.add(`${data[i]},${data[i + 1]},${data[i + 2]}`)
  }
  return used.size
}

export async function processImage(
  src: string,
  spec: PostProcessSpec,
): Promise<ProcessResult> {
  const img = await loadImage(src)
  const size = spec.canvas

  // 1) 정사각형 캔버스에 비율 유지 컨테인 배치
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  const scale = Math.min(size / img.width, size / img.height)
  const w = img.width * scale
  const h = img.height * scale
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)

  // 2) 픽셀화: 작은 격자로 다운샘플 후 니어리스트 업스케일
  if (spec.pixelGrid) {
    const g = spec.pixelGrid
    const tmp = document.createElement('canvas')
    tmp.width = g
    tmp.height = g
    const tctx = tmp.getContext('2d')!
    tctx.imageSmoothingEnabled = true
    tctx.drawImage(canvas, 0, 0, g, g)
    ctx.clearRect(0, 0, size, size)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(tmp, 0, 0, size, size)
  }

  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data

  // 3) 흰 배경 → 투명
  if (spec.removeWhiteBackground) {
    removeWhiteBg(data, spec.bgThreshold)
  }

  // 4) 색 양자화
  let colorCount = -1
  if (spec.maxColors) {
    colorCount = quantize(data, spec.maxColors)
  }

  ctx.putImageData(imageData, 0, 0)

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: size,
    height: size,
    colorCount,
  }
}
