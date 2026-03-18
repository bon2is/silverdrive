import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const alt         = "실버드라이브 - 75세 운전면허 갱신 인지능력검사 무료 연습";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

const BASE_URL = "https://silverdrive.andxo.com";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           "100%",
          height:          "100%",
          display:         "flex",
          alignItems:      "center",
          backgroundColor: "#1a1a2e",
          overflow:        "hidden",
          position:        "relative",
        }}
      >
        {/* 왼쪽: 할아버지 이미지 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE_URL}/share-image.png`}
          width={630}
          height={630}
          style={{ objectFit: "cover", flexShrink: 0 }}
          alt=""
        />

        {/* 오른쪽: 텍스트 */}
        <div
          style={{
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "center",
            padding:        "48px 56px",
            gap:            "20px",
            flex:           1,
          }}
        >
          <div style={{ fontSize: 58, fontWeight: 900, color: "#f5c518", lineHeight: 1.2 }}>
            실버드라이브
          </div>
          <div style={{ fontSize: 28, color: "#e0e0e0", lineHeight: 1.5 }}>
            75세 운전면허 갱신{"\n"}인지능력검사 무료 연습
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
            {["기억력", "반응속도", "표지판", "위험지각"].map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: "#0f3460",
                  color:           "#f5c518",
                  fontSize:        22,
                  fontWeight:      700,
                  padding:         "8px 20px",
                  borderRadius:    40,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 22, color: "#8888aa", marginTop: 8 }}>
            silverdrive.andxo.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
