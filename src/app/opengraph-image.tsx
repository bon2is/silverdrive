import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "실버드라이브 - 75세 운전면허 갱신 인지능력검사 무료 연습";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
          padding: "60px",
        }}
      >
        {/* 아이콘 */}
        <div style={{ fontSize: 120, marginBottom: 24 }}>🚗</div>

        {/* 타이틀 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#f5c518",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          실버드라이브
        </div>

        {/* 부제목 */}
        <div
          style={{
            fontSize: 36,
            color: "#f0f0f0",
            textAlign: "center",
            marginBottom: 40,
            lineHeight: 1.4,
          }}
        >
          75세 운전면허 갱신 인지능력검사 무료 연습
        </div>

        {/* 태그 */}
        <div style={{ display: "flex", gap: 16 }}>
          {["기억력", "반응속도", "표지판", "위험지각"].map((tag) => (
            <div
              key={tag}
              style={{
                backgroundColor: "#0f3460",
                color: "#f5c518",
                fontSize: 26,
                fontWeight: 700,
                padding: "10px 24px",
                borderRadius: 50,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            color: "#b0b0c0",
            fontSize: 24,
          }}
        >
          silverdrive.andxo.com
        </div>
      </div>
    ),
    { ...size }
  );
}
