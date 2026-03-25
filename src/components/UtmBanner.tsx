"use client";

import { useSearchParams } from "next/navigation";

const BANNER: Record<string, { emoji: string; text: string }> = {
  parent:    { emoji: "😊", text: "자녀분이 보내주셨군요! 바로 시작해보세요" },
  challenge: { emoji: "🏆", text: "도전장을 받으셨네요! 점수 비교해봐요" },
};

export function UtmBanner() {
  const params = useSearchParams();
  const medium = params.get("utm_medium") ?? "";
  const info = BANNER[medium];

  if (!info) return null;

  return (
    <div
      style={{
        background:   "#FEE500",
        color:        "#191600",
        borderRadius: "0.75rem",
        padding:      "0.875rem 1rem",
        fontWeight:   700,
        fontSize:     "1rem",
        display:      "flex",
        alignItems:   "center",
        gap:          "0.5rem",
        marginBottom: "0.5rem",
      }}
    >
      <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{info.emoji}</span>
      <span>{info.text}</span>
    </div>
  );
}
