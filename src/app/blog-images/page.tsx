// /blog-images — 네이버 블로그용 이미지 캡처 페이지
// 각 카드를 1200×630 비율로 스크린샷하여 블로그 이미지로 사용하세요.
// 이 페이지는 검색엔진에 노출될 필요가 없으므로 noindex 처리합니다.

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "블로그 이미지 | 실버드라이브",
};

const TESTS = [
  { icon: "🧠", label: "기억력 검사",      desc: "그림·단어를 기억했다가 다시 맞추기" },
  { icon: "🔢", label: "주의력 검사",      desc: "숫자·기호를 순서대로 선 잇기" },
  { icon: "🚦", label: "신호 반응 검사",   desc: "신호등 변화에 빠르게 반응하기" },
  { icon: "🪧", label: "표지판 식별 검사", desc: "교통 표지판 의미 맞추기" },
  { icon: "⚠️", label: "위험 지각 검사",  desc: "도로 상황의 위험 요소 찾기" },
];

/* ── 공통 카드 래퍼 ── */
function CardFrame({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "3rem" }}>
      <p style={{ color: "#b0b0c0", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
        📷 카드 {id} — {title}
      </p>
      {/* 1200:630 비율 고정 프레임 */}
      <div
        style={{
          width: "100%",
          maxWidth: "840px",
          aspectRatio: "1200 / 630",
          background: "#1a1a2e",
          borderRadius: "1.25rem",
          overflow: "hidden",
          border: "3px solid #0f3460",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </section>
  );
}

/* ── 카드 1: 메인 썸네일 ── */
function Card1() {
  return (
    <CardFrame id="1" title="메인 썸네일 (블로그 대표 이미지)">
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5%",
          gap: "4%",
        }}
      >
        {/* 배지 */}
        <div
          style={{
            background: "#f5c518",
            color: "#1a1a2e",
            fontWeight: 900,
            fontSize: "clamp(0.75rem, 2vw, 1rem)",
            padding: "0.3em 1.2em",
            borderRadius: "999px",
            letterSpacing: "0.05em",
          }}
        >
          무료 · 회원가입 불필요
        </div>

        {/* 메인 카피 */}
        <h2
          style={{
            color: "#f0f0f0",
            fontWeight: 900,
            fontSize: "clamp(1.2rem, 4vw, 2.4rem)",
            textAlign: "center",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          75세 운전면허 갱신<br />
          <span style={{ color: "#f5c518" }}>인지능력검사</span> 미리 연습하세요
        </h2>

        {/* 서브 카피 */}
        <p
          style={{
            color: "#b0b0c0",
            fontSize: "clamp(0.75rem, 2vw, 1.05rem)",
            textAlign: "center",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          기억력 · 주의력 · 반응속도 · 표지판 · 위험지각<br />
          실제 검사와 동일한 5가지를 집에서 연습
        </p>

        {/* URL 배지 */}
        <div
          style={{
            background: "#16213e",
            border: "2px solid #0f3460",
            borderRadius: "0.75rem",
            padding: "0.5em 1.5em",
            color: "#f5c518",
            fontWeight: 700,
            fontSize: "clamp(0.75rem, 2vw, 1rem)",
            letterSpacing: "0.02em",
          }}
        >
          silverdrive.andxo.com
        </div>
      </div>

      {/* 하단 장식 바 */}
      <div style={{ height: "6px", background: "linear-gradient(90deg, #f5c518, #ffd700, #f5c518)" }} />
    </CardFrame>
  );
}

/* ── 카드 2: 5가지 검사 항목 ── */
function Card2() {
  return (
    <CardFrame id="2" title="5가지 검사 항목 안내">
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "4% 5%",
          gap: "3%",
        }}
      >
        <h2
          style={{
            color: "#f5c518",
            fontWeight: 900,
            fontSize: "clamp(1rem, 3vw, 1.7rem)",
            margin: 0,
            textAlign: "center",
          }}
        >
          75세 면허 갱신 인지능력검사 — 5가지 항목
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "2%", flex: 1 }}>
          {TESTS.map((t, i) => (
            <div
              key={t.label}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "3%",
                background: "#16213e",
                border: "2px solid #0f3460",
                borderRadius: "0.75rem",
                padding: "0 4%",
              }}
            >
              <span
                style={{
                  background: "#f5c518",
                  color: "#1a1a2e",
                  fontWeight: 900,
                  borderRadius: "50%",
                  width: "clamp(1.4rem, 4vw, 2rem)",
                  height: "clamp(1.4rem, 4vw, 2rem)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(0.65rem, 1.8vw, 0.9rem)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "clamp(0.8rem, 2vw, 1.2rem)" }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    color: "#f0f0f0",
                    fontWeight: 700,
                    fontSize: "clamp(0.75rem, 2vw, 1.05rem)",
                  }}
                >
                  {t.label}
                </span>
                <span
                  style={{
                    color: "#b0b0c0",
                    fontSize: "clamp(0.6rem, 1.6vw, 0.85rem)",
                    marginLeft: "1em",
                  }}
                >
                  {t.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            color: "#f5c518",
            fontWeight: 700,
            textAlign: "center",
            fontSize: "clamp(0.65rem, 1.8vw, 0.9rem)",
            margin: 0,
          }}
        >
          silverdrive.andxo.com 에서 무료 연습 가능
        </p>
      </div>
    </CardFrame>
  );
}

/* ── 카드 3: 추천 대상 / CTA ── */
function Card3() {
  const targets = [
    "만 75세 이상으로 면허 갱신이 다가오신 분",
    "인지능력검사가 걱정되시는 어르신",
    "부모님·조부모님 검사를 도와드리고 싶은 분",
    "검사 전 실전처럼 미리 연습하고 싶은 분",
  ];

  return (
    <CardFrame id="3" title="추천 대상 · CTA 카드">
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "4%",
          padding: "5%",
          alignItems: "stretch",
        }}
      >
        {/* 왼쪽 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "4%",
          }}
        >
          <h2
            style={{
              color: "#f0f0f0",
              fontWeight: 900,
              fontSize: "clamp(1rem, 3vw, 1.7rem)",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            이런 분들께<br />
            <span style={{ color: "#f5c518" }}>추천합니다</span>
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8%" }}>
            {targets.map((t) => (
              <li
                key={t}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5em",
                  color: "#f0f0f0",
                  fontSize: "clamp(0.65rem, 1.8vw, 0.95rem)",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: "#f5c518", flexShrink: 0 }}>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* 구분선 */}
        <div style={{ width: "2px", background: "#0f3460", borderRadius: "2px" }} />

        {/* 오른쪽 */}
        <div
          style={{
            flex: "0 0 38%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "6%",
          }}
        >
          <div style={{ fontSize: "clamp(2rem, 7vw, 4rem)", lineHeight: 1 }}>🚗</div>
          <p
            style={{
              color: "#b0b0c0",
              fontSize: "clamp(0.6rem, 1.6vw, 0.85rem)",
              textAlign: "center",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            실제 검사와 동일한<br />5가지 항목 무료 연습
          </p>
          <div
            style={{
              background: "#f5c518",
              color: "#1a1a2e",
              fontWeight: 900,
              fontSize: "clamp(0.65rem, 1.8vw, 0.95rem)",
              padding: "0.6em 1.2em",
              borderRadius: "0.6rem",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            지금 무료로 연습하기<br />
            silverdrive.andxo.com
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

/* ── 페이지 ── */
export default function BlogImagesPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#111120",
        padding: "2rem 1.5rem",
        fontFamily: "var(--font-sans, 'Noto Sans KR', sans-serif)",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* 안내 헤더 */}
        <div
          style={{
            background: "#16213e",
            border: "2px solid #0f3460",
            borderRadius: "1rem",
            padding: "1.25rem 1.5rem",
            marginBottom: "2.5rem",
            color: "#b0b0c0",
            fontSize: "0.9rem",
            lineHeight: 1.8,
          }}
        >
          <p style={{ color: "#f5c518", fontWeight: 700, margin: "0 0 0.5rem" }}>
            📸 블로그 이미지 캡처 방법
          </p>
          <ol style={{ margin: 0, paddingLeft: "1.2em" }}>
            <li>브라우저를 <strong style={{ color: "#f0f0f0" }}>840px 너비</strong>로 조절하세요 (개발자도구 → 반응형)</li>
            <li>캡처할 카드 위에서 <strong style={{ color: "#f0f0f0" }}>우클릭 → "스크린샷 찍기"</strong> (Chrome) 또는 전체 화면 캡처 후 편집</li>
            <li>Mac: <strong style={{ color: "#f0f0f0" }}>Cmd+Shift+4</strong> 드래그 캡처</li>
            <li>저장 후 네이버 블로그에 업로드하세요</li>
          </ol>
        </div>

        <Card1 />
        <Card2 />
        <Card3 />
      </div>
    </main>
  );
}
