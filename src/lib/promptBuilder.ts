import type { StyleSpec } from './styleSpecs'

export interface CharacterInput {
  /** 캐릭터/프로젝트 이름 (프롬프트 상단 라벨) */
  name: string
  hair: string
  face: string
  outfit: string
  accessories: string
  /** HEX 색상 팔레트 (예: ['#2A2A2A', '#F9C8D8']) */
  palette: string[]
  /** 자유 추가 지시 */
  extra: string
  /** 참조 이미지를 첨부했는지 여부 (프롬프트 문구에 반영) */
  hasReference: boolean
}

export const emptyCharacter: CharacterInput = {
  name: '',
  hair: '',
  face: '',
  outfit: '',
  accessories: '',
  palette: [],
  extra: '',
  hasReference: false,
}

function line(label: string, value: string): string | null {
  const v = value.trim()
  return v ? `- ${label}: ${v}` : null
}

/**
 * 캐릭터 입력 + 스타일 규격 → 일관된 최종 프롬프트.
 * 고정 규격(fixedPromptRules)은 항상 동일하게 삽입되어 일관성을 보장한다.
 */
export function buildPrompt(input: CharacterInput, spec: StyleSpec): string {
  const parts: string[] = []

  parts.push(
    `Create a ${spec.fixedPromptRules[0]}.` +
      (input.name ? ` Character: "${input.name.trim()}".` : ''),
  )

  if (input.hasReference) {
    parts.push(
      'Use the attached reference image as the source of truth for the ' +
        'face, body type, hairstyle, outfit and accessories. Reproduce them faithfully.',
    )
  }

  // 캐릭터 상세 (있는 항목만)
  const details = [
    line('Hairstyle', input.hair),
    line('Face / expression', input.face),
    line('Outfit', input.outfit),
    line('Accessories', input.accessories),
  ].filter(Boolean) as string[]

  if (details.length) {
    parts.push('Appearance:\n' + details.join('\n'))
  }

  if (input.palette.length) {
    parts.push(
      'Use this exact color palette (HEX): ' + input.palette.join(', ') + '.',
    )
  }

  // 고정 규격 — 일관성의 핵심. 항상 동일.
  parts.push(
    'STRICT STYLE RULES (do not deviate):\n' +
      spec.fixedPromptRules.map((r) => `- ${r}`).join('\n'),
  )

  if (input.extra.trim()) {
    parts.push('Additional notes: ' + input.extra.trim())
  }

  // 해상도 보정 팁
  parts.push('Render at the highest available resolution (upscale 2x if limited).')

  return parts.join('\n\n')
}
