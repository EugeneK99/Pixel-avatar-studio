# Pixel Avatar Studio

이미지 + 텍스트를 넣으면 **일관된 규격**의 아바타 프롬프트를 만들고,
AI가 생성한 결과물을 규격에 맞춰 **자동으로 통일**하는 웹앱.

> AI 이미지 생성은 매번 결과가 달라진다. 이 도구는 규격을 **코드로 고정**해
> (프롬프트 문구 + 후처리 파라미터) 그 흔들림을 최소화한다.

## 두 가지 스타일

| 스타일 | 규격 |
| --- | --- |
| 🎮 **everskies 픽셀** | 2.8등신 · 최대 25색 · 1px 검정 외곽선 · 투명 배경 · 512×512 |
| 🎨 **세미리얼 일러스트** | 약 7.5~8등신 · 부드러운 셰이딩 · 투명 배경 · 1024×1024 |

## 기능

1. **프롬프트 빌더** — 참조 이미지 + 헤어/얼굴/의상/액세서리/HEX 팔레트 입력 →
   고정 규격이 항상 붙은 일관된 프롬프트 생성 + 복사
2. **결과물 규격화** — AI 생성 이미지를 넣으면 브라우저에서 리사이즈 · 픽셀화 ·
   색 팔레트 양자화(median cut) · 흰 배경 투명화를 자동 처리 → PNG 다운로드

## 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
```

## 배포 (Vercel)

1. [vercel.com](https://vercel.com)에서 GitHub로 로그인
2. 이 레포를 Import → 프레임워크 자동 감지(Vite) → Deploy
3. `https://<프로젝트>.vercel.app` URL 생성. 이후 push 시 자동 재배포.

## 스택

React + Vite + TypeScript + Tailwind CSS

## 규격 근거

- everskies 픽셀 트렌드(2.8등신·최대 25색·투명 PNG·1px 외곽선):
  [note.com 가이드](https://note.com/nekota88713/n/n804049b861b4) *(내용 정리·재구성)*
- everskies 공식 캔버스 규격 221×340px:
  [everskies Design Guide](https://everskies.com/page/design-guide)
