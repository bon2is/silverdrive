import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://silverdrive.andxo.com";

const GRADE_LABEL: Record<string, string> = {
  safe:    "안전 등급",
  caution: "주의 등급",
  danger:  "집중 연습 등급",
};
const GRADE_EMOJI: Record<string, string> = {
  safe: "🟢", caution: "🟡", danger: "🔴",
};
const MEDIUM_MSG: Record<string, string> = {
  challenge: "도전장을 받으셨네요! 🏆 점수 비교해봐요",
  parent:    "자녀분이 보내주셨군요 😊 바로 시작해보세요",
};

interface PageProps {
  searchParams: Promise<{ grade?: string; score?: string; utm_medium?: string; utm_campaign?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { grade = "safe", score = "0" } = await searchParams;
  const label     = GRADE_LABEL[grade] ?? GRADE_LABEL.safe;
  const ogImage   = `${BASE_URL}/api/og?grade=${grade}&score=${score}`;

  return {
    title:       `${score}점 · ${label} — 실버드라이브`,
    description: `종합 ${score}점, ${label}! 75세 운전면허 갱신 인지능력 자가진단을 무료로 연습해보세요.`,
    openGraph: {
      type:   "website",
      url:    `${BASE_URL}/share`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card:   "summary_large_image",
      images: [ogImage],
    },
  };
}

export default async function ShareLandingPage({ searchParams }: PageProps) {
  const { grade = "safe", score = "0", utm_medium = "" } = await searchParams;
  const label   = GRADE_LABEL[grade] ?? GRADE_LABEL.safe;
  const emoji   = GRADE_EMOJI[grade]  ?? "🟢";
  const ctxMsg  = MEDIUM_MSG[utm_medium] ?? null;

  return (
    <main
      style={{
        minHeight:      "100dvh",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "2rem 1.5rem",
        background:     "#1a1a2e",
        color:          "#f0f0f0",
        fontFamily:     "'Noto Sans KR', sans-serif",
        gap:            "1.5rem",
        textAlign:      "center",
      }}
    >
      {/* 문맥 메시지 */}
      {ctxMsg && (
        <div
          style={{
            background:   "#FEE500",
            color:        "#191600",
            borderRadius: "0.75rem",
            padding:      "0.875rem 1.5rem",
            fontWeight:   700,
            fontSize:     "1.125rem",
            maxWidth:     "360px",
          }}
        >
          {ctxMsg}
        </div>
      )}

      {/* 점수 카드 */}
      <div
        style={{
          background:   "#ffffff",
          borderRadius: "1.5rem",
          padding:      "2rem 3rem",
          color:        "#1a1a2e",
        }}
      >
        <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>{emoji}</div>
        <div style={{ fontSize: "3rem", fontWeight: 900, lineHeight: 1 }}>{score}점</div>
        <div style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "0.5rem" }}>{label}</div>
      </div>

      <p style={{ fontSize: "1.125rem", color: "#aaaacc", maxWidth: "320px", lineHeight: 1.6 }}>
        나도 75세 운전면허 갱신 인지능력<br />자가진단을 해볼게요!
      </p>

      <Link
        href="/"
        style={{
          display:         "block",
          background:      "#FEE500",
          color:           "#191600",
          borderRadius:    "0.75rem",
          padding:         "1rem 2.5rem",
          fontSize:        "1.25rem",
          fontWeight:      900,
          textDecoration:  "none",
          width:           "100%",
          maxWidth:        "320px",
          boxSizing:       "border-box",
        }}
      >
        🚗 나도 해보기 (무료)
      </Link>
    </main>
  );
}
