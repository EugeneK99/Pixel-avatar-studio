import { useMemo, useState } from 'react'
import { STYLE_SPECS, type StyleId } from './lib/styleSpecs'
import { buildPrompt, emptyCharacter, type CharacterInput } from './lib/promptBuilder'
import { StylePicker } from './components/StylePicker'
import { SpecBadges } from './components/SpecBadges'
import { CharacterForm } from './components/CharacterForm'
import { ImageDrop } from './components/ImageDrop'
import { PromptOutput } from './components/PromptOutput'
import { PostProcessPanel } from './components/PostProcessPanel'

type Tab = 'prompt' | 'post'

export default function App() {
  const [styleId, setStyleId] = useState<StyleId>('pixel')
  const [character, setCharacter] = useState<CharacterInput>(emptyCharacter)
  const [refImg, setRefImg] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('prompt')

  const spec = STYLE_SPECS[styleId]

  const prompt = useMemo(
    () => buildPrompt({ ...character, hasReference: !!refImg }, spec),
    [character, refImg, spec],
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="font-pixel text-2xl leading-relaxed text-accent sm:text-3xl">
          Pixel Avatar Studio
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
          이미지 + 텍스트를 넣으면 <b className="text-accent2">일관된 규격</b>의 아바타
          프롬프트를 만들고, AI 결과물을 규격에 맞춰 자동으로 통일합니다.
        </p>
      </header>

      {/* Style picker + spec */}
      <section className="mb-6 space-y-4">
        <StylePicker value={styleId} onChange={setStyleId} />
        <SpecBadges spec={spec} />
      </section>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-white/10 bg-panel p-1">
        <button
          onClick={() => setTab('prompt')}
          className={
            'flex-1 rounded-lg py-2 text-sm font-semibold transition ' +
            (tab === 'prompt' ? 'bg-accent text-ink' : 'text-muted hover:text-white')
          }
        >
          1️⃣ 프롬프트 만들기
        </button>
        <button
          onClick={() => setTab('post')}
          className={
            'flex-1 rounded-lg py-2 text-sm font-semibold transition ' +
            (tab === 'post' ? 'bg-accent text-ink' : 'text-muted hover:text-white')
          }
        >
          2️⃣ 결과물 규격화
        </button>
      </div>

      {/* Content */}
      {tab === 'prompt' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-panel p-5">
            <h2 className="text-sm font-semibold text-accent">캐릭터 정보 입력</h2>
            <ImageDrop
              label="참조 이미지 (선택 · 강력 추천)"
              hint="같은 캐릭터를 계속 첨부하면 일관성이 크게 올라갑니다"
              src={refImg}
              onFile={setRefImg}
            />
            <CharacterForm value={character} onChange={setCharacter} />
          </div>
          <div className="space-y-4">
            <PromptOutput prompt={prompt} />
            <div className="rounded-xl border border-white/10 bg-panel/60 p-4 text-xs leading-relaxed text-muted">
              <p className="mb-2 font-semibold text-accent">💡 사용 방법</p>
              <ol className="list-decimal space-y-1 pl-4">
                <li>위 프롬프트를 복사합니다.</li>
                <li>ChatGPT에 참조 이미지와 함께 붙여넣어 생성합니다.</li>
                <li>
                  생성된 이미지를 <b className="text-accent2">2️⃣ 결과물 규격화</b> 탭에
                  넣어 규격을 강제 통일합니다.
                </li>
              </ol>
              <p className="mt-3 text-[11px] text-muted/70">
                ※ AI 이미지 생성은 확률적이라 프롬프트만으로 100% 동일하진 않습니다.
                참조 이미지 첨부 + 결과물 규격화를 함께 쓰는 것이 핵심입니다.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-panel p-5">
          <PostProcessPanel spec={spec} />
        </div>
      )}

      <footer className="mt-10 text-center text-xs text-muted/60">
        규격은 코드로 고정됩니다 · everskies 픽셀 기준(2.8등신·25색) & 세미리얼 일러스트
      </footer>
    </div>
  )
}
