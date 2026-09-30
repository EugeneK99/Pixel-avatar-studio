/**
 * Style Specs — 프로젝트의 심장.
 *
 * 여기서 각 아바타 스타일의 "규격"을 코드로 고정한다.
 * AI 생성 때마다 규격이 흔들리는 문제를 막기 위해,
 * 프롬프트 문구와 후처리 파라미터를 모두 하나의 명세(spec)에서 파생시킨다.
 */

export type StyleId = 'pixel' | 'semireal'

export interface PostProcessSpec {
  /** 최종 출력 정사각형 캔버스 한 변(px) */
  canvas: number
  /** 픽셀화(다운샘플) 격자 한 변(px). null이면 픽셀화하지 않음 */
  pixelGrid: number | null
  /** 색상 팔레트 최대 색상 수. null이면 색 양자화하지 않음 */
  maxColors: number | null
  /** 배경을 흰색 근처에서 투명으로 처리할지 여부 */
  removeWhiteBackground: boolean
  /** 배경 제거 임계값(0-255). 이 값 이상으로 밝으면 투명 처리 */
  bgThreshold: number
}

export interface StyleSpec {
  id: StyleId
  label: string
  emoji: string
  blurb: string
  /** 프롬프트에 항상 삽입되는 고정 규격 문구(영문 — 이미지 모델 호환성) */
  fixedPromptRules: string[]
  /** 사람이 읽는 규격 요약(한글, UI 표시용) */
  humanSpec: { label: string; value: string }[]
  post: PostProcessSpec
}

export const STYLE_SPECS: Record<StyleId, StyleSpec> = {
  pixel: {
    id: 'pixel',
    label: 'everskies 픽셀',
    emoji: '🎮',
    blurb: '2.8등신 · 25색 · 투명 배경 · 1px 검정 외곽선. 레트로 게임 캐릭터 느낌.',
    fixedPromptRules: [
      'full-body pixel art in the Everskies dress-up game style',
      'head-to-body ratio of exactly 2.8 (cute chibi-leaning deformation)',
      'strictly limited color palette of at most 25 colors',
      'clean 1px solid black outline, minimal dithering',
      'centered standing front-facing pose like a game character',
      'the background MUST be a fully transparent PNG',
      'square 1:1 composition, crisp pixels, no anti-aliasing on the outline',
    ],
    humanSpec: [
      { label: '등신 비율', value: '2.8등신' },
      { label: '색상 수', value: '최대 25색' },
      { label: '외곽선', value: '검정 1px' },
      { label: '배경', value: '투명 PNG' },
      { label: '포즈', value: '정면 · 중앙 정렬' },
      { label: '출력 규격', value: '512×512, 96px 격자로 픽셀화' },
    ],
    post: {
      canvas: 512,
      pixelGrid: 96,
      maxColors: 25,
      removeWhiteBackground: true,
      bgThreshold: 244,
    },
  },
  semireal: {
    id: 'semireal',
    label: '세미리얼 일러스트',
    emoji: '🎨',
    blurb: '7~8등신 실사 비율 · 부드러운 셰이딩 · 투명 배경. 고퀄 캐릭터 원화.',
    fixedPromptRules: [
      'full-body semi-realistic anime-style character illustration',
      'realistic head-to-body proportions of about 7.5 to 8 heads tall',
      'soft cel-to-smooth shading with subtle rendering, painterly finish',
      'clean lineless or very thin lineart, high detail on face and fabric',
      'centered full-body standing front-facing pose, feet visible',
      'the background MUST be a fully transparent PNG (isolated character)',
      'portrait 2:3 composition, high resolution, consistent lighting from top-left',
    ],
    humanSpec: [
      { label: '등신 비율', value: '약 7.5~8등신' },
      { label: '셰이딩', value: '부드러운 렌더링' },
      { label: '라인', value: '얇거나 라인리스' },
      { label: '배경', value: '투명 PNG' },
      { label: '포즈', value: '정면 전신 · 중앙' },
      { label: '출력 규격', value: '1024×1024 (픽셀화 없음)' },
    ],
    post: {
      canvas: 1024,
      pixelGrid: null,
      maxColors: null,
      removeWhiteBackground: true,
      bgThreshold: 248,
    },
  },
}

export const STYLE_LIST: StyleSpec[] = [STYLE_SPECS.pixel, STYLE_SPECS.semireal]
