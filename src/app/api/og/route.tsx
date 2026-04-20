import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
// grade는 safe/caution/danger 3가지뿐 — 30일 캐시
export const revalidate = 2592000;

const GRADE_MAP = {
  safe:    { emoji: "🟢", label: "안전 등급",      badgeBg: "#dcfce7", badgeText: "#166534" },
  caution: { emoji: "🟡", label: "주의 등급",      badgeBg: "#fef9c3", badgeText: "#854d0e" },
  danger:  { emoji: "🔴", label: "집중 연습 등급", badgeBg: "#fee2e2", badgeText: "#991b1b" },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawGrade = searchParams.get("grade") ?? "safe";
  const score    = searchParams.get("score") ?? "0";
  const grade    = (rawGrade in GRADE_MAP ? rawGrade : "safe") as keyof typeof GRADE_MAP;
  const g        = GRADE_MAP[grade];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#1a1a2e",
          fontFamily: "sans-serif",
        }}
      >
        {/* 상단 타이틀 */}
        <div style={{ color: "#FEE500", fontSize: 44, fontWeight: 900, marginBottom: 40, display: "flex", gap: 12 }}>
          🚗 실버드라이브
        </div>

        {/* 점수 카드 */}
        <div
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            background: "#ffffff", borderRadius: 28,
            padding: "44px 100px", marginBottom: 40,
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ fontSize: 72, marginBottom: 12, display: "flex" }}>{g.emoji}</div>
          <div style={{ fontSize: 96, fontWeight: 900, color: "#1a1a2e", lineHeight: 1, display: "flex" }}>
            {score}점
          </div>
          <div
            style={{
              marginTop: 16, padding: "8px 28px", borderRadius: 999,
              background: g.badgeBg, color: g.badgeText,
              fontSize: 32, fontWeight: 700, display: "flex",
            }}
          >
            {g.label}
          </div>
        </div>

        {/* 하단 설명 */}
        <div style={{ color: "#8888aa", fontSize: 26, marginBottom: 10, display: "flex" }}>
          운전면허 갱신 인지능력 자가진단
        </div>
        <div style={{ color: "#FEE500", fontSize: 22, display: "flex" }}>
          silverdrive.andxo.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400",
      },
    }
  );
}
