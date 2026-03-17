# SilverDrive 진행 현황

> PM 에이전트가 관리하는 파일입니다. 각 Phase 완료 시 업데이트됩니다.

---

## Phase 1 — ✅ 완료 (2026-03-17)

**완료 항목:**
- Next.js 16 (Turbopack) + Tailwind CSS v4 프로젝트 세팅
- 어르신 디자인 토큰 (navy/yellow 팔레트, 18px 베이스, 48px 터치 타겟)
- PWA: `manifest.json` + `public/sw.js` (cache-first) + `PwaRegister` 클라이언트 컴포넌트
- Noto Sans KR 폰트 적용
- 홈 화면 (`/`) — 제목, CTA 버튼, 3종 테스트 소개 카드

**특이사항:**
- `next-pwa` Turbopack 비호환 → 수동 서비스워커로 대체

---

## Phase 2 — ✅ 완료 (2026-03-17)

**완료 항목:**
- `useSpeech` 훅 (Web Speech API, ko-KR, rate 0.85)
- `useTestStore` Zustand 스토어 (반응시간 / 표지판 정오답 / 위험지각 결과)
- 테스트 허브 `/test` — 3종 소개 + 전체 시작
- 자극 반응 테스트 `/test/reaction` — 5라운드, 1500~3000ms 랜덤 딜레이
- 표지판 식별 테스트 `/test/signs` — 7종 SVG 표지판, 5라운드 랜덤 출제
- 위험 지각 테스트 `/test/hazard` — CSS 도로씬, 3라운드
- `TestProgressBar`, `SpeechGuide`, `SignIcon` 공통 컴포넌트
- `/result-loading` 스텁, `/result` 스텁

**특이사항:**
- stale closure 버그(3건) 발견 → ref-as-stable-callback 패턴으로 해소
- 타이머 분리(delayTimerRef / activeTimerRef)로 메모리 누수 방지

---

## Phase 3 — ✅ 완료 (2026-03-17)

**완료 항목:**
- `/result-loading` 풀 구현 — 5초 카운트다운 바, 분석 문구 3종 순환, 스피너 애니메이션
- `AdBanner` 컴포넌트 — 개발 환경 플레이스홀더 / 프로덕션 AdSense `<ins>` 삽입
- `AdErrorBoundary` 클래스 컴포넌트 — ErrorBoundary + SafeDrivingCard fallback
- `SafeDrivingCard` — 안전 운전 수칙 5종 1.5초 간격 순환
- `layout.tsx` AdSense Script 삽입 (`afterInteractive`, 1회)
- `.env.example` 환경변수 가이드

**특이사항:**
- AdSense Publisher ID는 `NEXT_PUBLIC_ADSENSE_CLIENT` 환경변수로 주입 (빌드 시)
- 개발 환경에서는 광고 자리에 플레이스홀더 표시, `adsbygoogle.push()` 미실행

---

## Phase 4 — ⏳ 대기 중

**목표:** 결과 리포트 + 등급 알고리즘 + Web Share API 공유 기능

---

## 이슈 로그

| 날짜 | Phase | 이슈 | 조치 |
|------|-------|------|------|
| 2026-03-17 | Phase 1 | `next-pwa` v5 Turbopack 비호환 | 수동 `sw.js`로 대체 |
| 2026-03-17 | Phase 2 | stale closure (reaction/hazard 타임아웃 라운드 오작동) | ref-as-stable-callback 패턴 적용 |
| 2026-03-17 | Phase 2 | `useRef<T>()` 초기값 누락 TypeScript 오류 | `undefined` 명시로 수정 |
| 2026-03-17 | Phase 3 | 개발환경에서 `adsbygoogle.push()` 불필요 실행 | `isProd` 조건 분리로 방어 |
| 2026-03-17 | Phase 3 | `componentDidCatch` 시그니처 누락 | `ErrorInfo` 인수 추가 |
