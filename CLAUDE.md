# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 개발 서버 (Turbopack, localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run start    # 프로덕션 서버
```

테스트 프레임워크 없음. 브라우저에서 직접 확인.

## 아키텍처

### 앱 라우트 구조

```
/ (홈 · 난이도 선택)
/test (테스트 허브 — 5개 세부 테스트 진행 관리)
  /reaction  자극 반응 테스트
  /memory    기억력 테스트
  /signs     표지판 식별
  /hazard    위험 지각
  /trail     선 잇기 (주의력)
/result-loading  강제 5초 대기 → AdSense 광고 노출
/result          최종 점수 리포트 + 공유 버튼
```

### 상태 관리

- `src/lib/useTestStore.ts` — Zustand + **sessionStorage persist** 필수. 카카오 웹뷰 hard-reload 대비.
- `src/lib/useLevelStore.ts` — 난이도(1/2/3) 전역 상태.
- `src/lib/levelConfig.ts` — 난이도별 타이머·문항 수 설정 단일 진실 공급원.

### 주요 패턴

- **타이머 stale closure** → `useRef`로 callback을 ref에 저장(ref-as-stable-callback 패턴). 중첩 타이머는 `delayTimerRef` + `activeTimerRef` 분리.
- **history.state 보존** → `useConfirmLeave`에서 `pushState` 시 반드시 `savedState`를 보존해 전달. `null`로 덮으면 Next.js 라우터 붕괴.
- **AdSense** → `isProd` 조건으로 개발 환경 방어. `AdBanner` 컴포넌트가 페이지별 스크립트 직접 로드.
- **Kakao SDK** → `ShareButton.tsx`에서 `afterInteractive + onLoad`로 로드. `initKakao()`는 중복 init 방지.
- **카카오 웹뷰 TTS 불가** → `isKakaoWebview.ts`로 감지 후 `SpeechGuide`가 텍스트 강조 폴백.

### 어르신 UX 규칙 (항상 준수)

- 기본 폰트 **18px 이상**, 제목 24px 이상 (Noto Sans KR)
- 팔레트: **navy(`#1a1a2e`) + yellow(`#FEE500`)** 고대비
- 터치 타겟 **48px 이상**
- 더블클릭·드래그 UI 사용 금지
- 모든 지시문은 **Web Speech API TTS** (`useSpeech.ts`) 병행

### 환경변수 (Vercel)

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense Publisher ID |
| `NEXT_PUBLIC_KAKAO_JS_APP_KEY` | Kakao JS SDK 앱 키 |

### PWA

`next-pwa` 미사용 (Turbopack 비호환). `public/sw.js` 수동 서비스워커. `PwaRegister` 컴포넌트가 등록.

### 배포

Vercel. 도메인 `https://silverdrive.andxo.com`. Kakao Developers 앱 ID: 1408533.
