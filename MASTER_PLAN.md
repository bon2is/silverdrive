# SilverDrive — 멀티에이전트 마스터 플랜

> 75세 이상 고령 운전자의 면허 갱신 인지능력 자가진단 대비 연습 PWA

---

## 1. 프로젝트 개요 (리뷰 및 업데이트)

| 항목 | 내용 |
|------|------|
| **목표** | 실제 운전 적성검사와 유사한 로직으로 자가 연습, 합격률 향상 |
| **타겟** | 75세 이상 면허 갱신 대상자 (디지털 친숙도 낮음) |
| **수익** | Google AdSense (무료 서비스 유지) |
| **접근성** | PWA — 홈 화면 추가, 오프라인 동작, 모바일 우선 |

### 기술 스택 (확정)

| 구성요소 | 선택 | 비고 |
|----------|------|------|
| Framework | Next.js 16 (App Router) | Turbopack 기본 사용 |
| Styling | Tailwind CSS v4 | `@theme` 기반 설정 (config 파일 없음) |
| PWA | 수동 `sw.js` + `manifest.json` | next-pwa 미사용 (Turbopack 비호환) |
| 폰트 | Noto Sans KR | 한글 전용, Google Fonts |
| 상태관리 | Zustand | 테스트 진행 상태 전역 관리 |
| 음성 | Web Speech API | 브라우저 내장 TTS, 별도 설치 없음 |
| 광고 | Google AdSense | Script 태그 직접 통합 |

---

## 2. 에이전트 롤 정의

멀티에이전트 방식으로 운영한다. 각 에이전트는 독립된 관심사를 가지며, PM 에이전트가 전체를 조율한다.

---

### 🗂️ PM 에이전트 (프로젝트 매니저)

**역할:** 전체 진행 조율, 페이즈 게이팅, 리스크 관리

**책임:**
- 각 Phase 시작 전 `기획/설계 에이전트`의 산출물 승인
- 각 Phase 완료 전 `테스트/검수 에이전트`의 DoD 통과 확인
- 진행 상황을 `PROGRESS.md`에 기록
- 의사결정이 필요한 트레이드오프를 사용자에게 보고
- 다음 Phase 진입 여부 결정

**산출물:**
- `PROGRESS.md` — 페이즈별 진행 현황 및 이슈 로그
- Phase 게이팅 보고서 (각 Phase 완료 시)

**호출 시점:**
- 새 Phase 시작 요청 시
- 에이전트 간 충돌/블로커 발생 시
- 사용자가 진행 상황 요약을 요청할 때

---

### 🎨 기획/설계 에이전트 (Product Designer)

**역할:** 기능 명세, 화면 설계, UX 가이드라인 수립

**책임:**
- 각 Phase의 기능 요구사항 상세화 (`spec/` 디렉터리에 마크다운으로 작성)
- 어르신 UX 원칙 준수 여부 사전 검토
- 화면 흐름(User Flow) 및 컴포넌트 구조 설계
- 개발 에이전트에게 명확한 구현 지침 제공

**어르신 UX 핵심 원칙 (설계 시 반드시 준수):**
1. 폰트 기본 18px 이상, 제목 24px 이상
2. 고대비 컬러 (navy `#1a1a2e` 배경 + yellow `#f5c518` 강조)
3. 터치 타겟 최소 48×48px (WCAG 2.5.5)
4. 더블클릭·드래그 인터랙션 금지 (탭/클릭만)
5. 모든 지시문은 TTS 음성 안내와 동시 출력
6. 한 화면에 하나의 핵심 행동만 요구 (인지 부하 최소화)
7. 오류 발생 시 명확하고 큰 글씨로 재시도 안내

**산출물:**
- `spec/phase-N-spec.md` — 기능 명세서
- `spec/ux-flows.md` — 화면 전환 흐름도 (텍스트 기반)

**호출 시점:**
- 각 Phase 개발 착수 전 (설계 우선)
- 개발 중 UX 판단이 필요한 경우

---

### 💻 개발 에이전트 (Frontend Engineer)

**역할:** 기획/설계 에이전트의 명세를 바탕으로 코드 구현

**책임:**
- Next.js App Router 기반 페이지 및 컴포넌트 구현
- Tailwind v4 `@theme` 토큰 활용한 스타일링
- 상태 관리 로직 (Zustand) 구현
- Web Speech API TTS 유틸리티 구현
- 성능 최적화 (Core Web Vitals 고려)

**코딩 원칙:**
- `"use client"` 는 인터랙션이 필요한 최소 범위에만 적용
- 모든 클릭 핸들러는 단일 탭으로 동작 (더블클릭 이벤트 등록 금지)
- 타이머 로직은 `useRef` + `clearTimeout/clearInterval` 으로 메모리 누수 방지
- 광고 컴포넌트는 ErrorBoundary로 감싸 광고 실패가 앱을 깨뜨리지 않도록

**산출물:**
- `src/` 하위 구현 코드 전체

**호출 시점:**
- 기획/설계 에이전트의 명세 완료 후
- 버그 수정 요청 시

---

### 🔍 테스트/검수 에이전트 (QA Engineer)

**역할:** 구현 품질 검증, 어르신 UX 적합성 검수, 코드 리뷰

**책임:**
- 각 Phase 완료 후 DoD(Definition of Done) 체크리스트 검증
- 어르신 UX 원칙 준수 여부 코드 레벨 검토
- 접근성 이슈 발견 및 보고
- 타이머·상태 로직의 엣지케이스 검토
- 광고 컴포넌트 렌더링 실패 시나리오 검토

**검수 체크리스트 (공통):**
- [ ] 폰트 사이즈 18px 이상 (실제 렌더 기준)
- [ ] 버튼 터치 영역 48px 이상
- [ ] TTS 음성 안내 구현 여부
- [ ] `npm run build` 오류 없음
- [ ] TypeScript 타입 에러 없음
- [ ] 더블클릭 방어 로직 존재 여부
- [ ] 메모리 누수 위험 (`useEffect` cleanup) 검토

**산출물:**
- `spec/review-phase-N.md` — 검수 보고서 (이슈 목록 + 조치 결과)

**호출 시점:**
- 개발 에이전트의 Phase 구현 완료 후
- PM 에이전트의 게이팅 전 마지막 단계로 호출

---

## 3. 에이전트 협업 플로우

```
[사용자] Phase N 시작 요청
     │
     ▼
[PM 에이전트] Phase 계획 수립, 기획/설계 에이전트 호출 승인
     │
     ▼
[기획/설계 에이전트] spec/phase-N-spec.md 작성 및 UX 검토
     │
     ▼
[개발 에이전트] 명세 기반 코드 구현, npm run build 통과 확인
     │
     ▼
[테스트/검수 에이전트] DoD 체크리스트 검증, 이슈 보고
     │
     ├── 이슈 있음 → [개발 에이전트] 수정 → 재검수
     │
     └── 이슈 없음 ▼
[PM 에이전트] Phase N 완료 선언, PROGRESS.md 업데이트, 사용자 보고
```

---

## 4. Phase별 작업 계획

---

### ✅ Phase 1: 인프라 및 PWA 세팅 — **완료**

**완료 일자:** 2026-03-17
**주요 산출물:**
- Next.js 16 + Tailwind v4 프로젝트 세팅
- 어르신 디자인 토큰 (`globals.css` — navy/yellow 팔레트, 18px 베이스)
- PWA: `manifest.json` + `public/sw.js` + `PwaRegister` 컴포넌트
- 홈 화면(`/`) — 제목, CTA 버튼, 3종 테스트 소개 카드

---

### 🔄 Phase 2: 테스트 엔진 개발

#### 기획/설계 에이전트 태스크

**화면 흐름:**
```
/test (테스트 선택 허브)
  ├── /test/reaction   (자극 반응 테스트)
  ├── /test/signs      (표지판 식별 테스트)
  └── /test/hazard     (위험 지각 테스트)
```

**각 테스트 공통 UX:**
- 시작 전: TTS 음성 + 텍스트로 지시사항 안내 (재생 버튼 포함)
- 진행 중: 상단 진행 바 + 남은 문항 수
- 완료 시: `/result-loading` 으로 이동

**자극 반응 테스트 명세:**
- 화면 중앙에 랜덤 위치로 노란 원 출현 (딜레이 1.5~3초 랜덤)
- 출현 후 최대 3초 내 클릭 시 성공, 초과 시 실패
- 총 5회 반복, 반응 시간 ms 단위로 기록
- 원 색상: 노란색(`#f5c518`), 크기: 80px (손가락 탭에 충분한 크기)

**표지판 식별 테스트 명세:**
- 상단에 찾아야 할 표지판 이름 텍스트 + TTS 안내
- 하단에 4개 보기 표지판 아이콘 (2×2 그리드)
- SVG 아이콘 활용 (실제 한국 도로 표지판 7종 — 진입금지, 일방통행, 횡단보도, 신호등, 속도제한, 주차금지, 양보)
- 총 5문항, 정답 여부 기록

**위험 지각 테스트 명세 (Phase 2 간소화 버전):**
- CSS로 구현한 단순 도로 씬 (실제 이미지 없이 SVG/CSS)
- 랜덤 위치에 위험 요소(보행자 아이콘) 출현
- 3초 내 탭 시 성공
- 총 3회 반복

#### 개발 에이전트 태스크

1. `src/lib/useSpeech.ts` — Web Speech API TTS 훅
2. `src/lib/useTestStore.ts` — Zustand 스토어 (테스트 결과 누적)
3. `src/app/test/page.tsx` — 테스트 선택 허브
4. `src/app/test/reaction/page.tsx` — 자극 반응 테스트
5. `src/app/test/signs/page.tsx` — 표지판 식별 테스트
6. `src/app/test/hazard/page.tsx` — 위험 지각 테스트
7. `src/components/TestProgressBar.tsx` — 공통 진행 바
8. `src/components/SpeechGuide.tsx` — TTS 안내 + 재생 버튼 공통 컴포넌트

#### 테스트/검수 에이전트 DoD

- [ ] 각 테스트 페이지 `npm run build` 통과
- [ ] TTS 음성 안내 코드 존재 확인
- [ ] 타이머 `clearTimeout` cleanup 확인
- [ ] 더블클릭 방어 (`disabled` 상태 처리) 확인
- [ ] Zustand 스토어 타입 안전성 확인
- [ ] 표지판 아이콘 SVG 접근성 (`aria-label`) 확인

---

### ⏳ Phase 3: 광고 수익화 페이지

#### 기획/설계 에이전트 태스크

**`/result-loading` 페이지 설계:**
- 3~5초 강제 대기 (결과 분석 연출)
- 중앙 애니메이션: 로딩 스피너 + "어르신의 검사 결과를 정밀 분석 중입니다..."
- 광고 위치: 애니메이션 하단, 뷰포트 내 고정
- 광고 로딩 실패 시: "안전 운전 수칙 5가지" 카드로 대체
- 5초 후 `/result` 자동 이동 (사용자 조작 불필요)

**광고 배치 전략:**
- `/result-loading`: 네이티브 광고 1개 (300×250 or 320×100)
- `/result`: 리포트 하단 배너 1개
- 공유 버튼 클릭 전: 전면 광고 (Interstitial) — AdSense 정책 검토 후 결정

#### 개발 에이전트 태스크

1. `src/app/result-loading/page.tsx` — 대기 화면 + 카운트다운
2. `src/components/AdBanner.tsx` — AdSense 컴포넌트 (ErrorBoundary 포함)
3. `src/components/SafeDrivingCard.tsx` — 광고 대체 컨텐츠

#### 테스트/검수 에이전트 DoD

- [ ] 5초 타이머 정확성 확인
- [ ] 광고 실패 시 fallback 렌더링 확인
- [ ] `result-loading` → `result` 자동 이동 확인
- [ ] AdSense Script 중복 로드 방지 확인

---

### ⏳ Phase 4: 결과 리포트 및 공유

#### 기획/설계 에이전트 태스크

**결과 등급 알고리즘:**

| 등급 | 조건 | 메시지 |
|------|------|--------|
| 🟢 안전 | 반응속도 평균 < 800ms AND 표지판 정답률 ≥ 80% | "운전 능력이 우수합니다!" |
| 🟡 주의 | 반응속도 평균 800~1200ms OR 정답률 60~79% | "조금 더 연습하면 좋겠어요." |
| 🔴 노력 | 반응속도 평균 > 1200ms OR 정답률 < 60% | "안전을 위해 충분한 연습을 권장합니다." |

**`/result` 페이지 구성:**
- 상단: 등급 아이콘 + 등급명 (대형 텍스트)
- 중단: 항목별 점수 카드 (반응속도 / 표지판 정확도 / 위험지각)
- 하단: "다시 연습하기" 버튼 + "결과 공유하기" 버튼
- 최하단: AdSense 배너

**공유 기능:**
- Web Share API 우선 사용 (카카오톡 등 OS 공유 시트 활용)
- 미지원 시: 클립보드 복사로 폴백
- 공유 텍스트: "[실버드라이브] 나의 운전 적성 결과: {등급} | silverdrive.app"

#### 개발 에이전트 태스크

1. `src/lib/gradeCalculator.ts` — 등급 산출 순수 함수
2. `src/app/result/page.tsx` — 결과 리포트 페이지
3. `src/components/GradeBadge.tsx` — 등급 배지 컴포넌트
4. `src/components/ScoreCard.tsx` — 항목별 점수 카드
5. `src/components/ShareButton.tsx` — Web Share API + 폴백

#### 테스트/검수 에이전트 DoD

- [ ] 등급 알고리즘 경계값 테스트 (800ms, 1200ms, 60%, 80%)
- [ ] Web Share API 미지원 환경 폴백 확인
- [ ] 결과 페이지 광고 위치 UX 검토
- [ ] 다시 연습하기 시 Zustand 스토어 초기화 확인

---

## 5. PROGRESS.md 운영 규칙

PM 에이전트는 각 Phase 완료 시 `PROGRESS.md`를 업데이트한다.

```markdown
# SilverDrive 진행 현황

## Phase 1 — ✅ 완료 (2026-03-17)
## Phase 2 — 🔄 진행 중
## Phase 3 — ⏳ 대기
## Phase 4 — ⏳ 대기
```

---

## 6. 디렉터리 구조 (목표)

```
silverdrive/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
├── spec/                          ← 기획/설계 에이전트 산출물
│   ├── phase-2-spec.md
│   ├── phase-3-spec.md
│   ├── phase-4-spec.md
│   ├── ux-flows.md
│   └── review-phase-N.md          ← 테스트/검수 에이전트 산출물
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               ← 홈 (/)
│   │   ├── test/
│   │   │   ├── page.tsx           ← 테스트 선택 허브
│   │   │   ├── reaction/page.tsx
│   │   │   ├── signs/page.tsx
│   │   │   └── hazard/page.tsx
│   │   ├── result-loading/page.tsx
│   │   └── result/page.tsx
│   ├── components/
│   │   ├── PwaRegister.tsx
│   │   ├── TestProgressBar.tsx
│   │   ├── SpeechGuide.tsx
│   │   ├── AdBanner.tsx
│   │   ├── SafeDrivingCard.tsx
│   │   ├── GradeBadge.tsx
│   │   ├── ScoreCard.tsx
│   │   └── ShareButton.tsx
│   └── lib/
│       ├── useSpeech.ts
│       ├── useTestStore.ts
│       └── gradeCalculator.ts
├── MASTER_PLAN.md                 ← 이 파일
├── PROGRESS.md                    ← PM 에이전트 관리
└── CLAUDE_GUIDE.md                ← 원본 기획서
```

---

## 7. 에이전트 호출 가이드

### Phase 2 시작 시 호출 순서

```
1. [기획/설계 에이전트] Phase 2 명세 확인 및 보완
   → "기획/설계 에이전트로서 Phase 2 명세를 검토하고
      spec/phase-2-spec.md를 작성해줘."

2. [개발 에이전트] 구현
   → "개발 에이전트로서 spec/phase-2-spec.md 기반으로
      Phase 2 테스트 엔진을 구현해줘."

3. [테스트/검수 에이전트] DoD 검증
   → "테스트/검수 에이전트로서 Phase 2 DoD 체크리스트를
      검증하고 spec/review-phase-2.md를 작성해줘."

4. [PM 에이전트] Phase 완료 선언
   → "PM 에이전트로서 Phase 2 완료를 선언하고
      PROGRESS.md를 업데이트해줘."
```
