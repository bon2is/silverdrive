"use client";

import { useEffect, useState } from "react";

const TIPS = [
  { icon: "🛑", title: "출발 전 확인", desc: "좌우 사이드미러와 안전벨트를 반드시 확인하세요." },
  { icon: "🚗", title: "속도 조절",   desc: "반응 속도를 고려해 여유 있게 천천히 운전하세요." },
  { icon: "🌙", title: "야간 주의",   desc: "해질 무렵과 야간엔 전조등을 켜고 속도를 줄이세요." },
  { icon: "🅿️", title: "주차 확인",   desc: "주차 후 핸드브레이크 체결 및 기어 P를 확인하세요." },
  { icon: "💊", title: "약 복용 주의", desc: "졸음 유발 약 복용 후에는 절대 운전하지 마세요." },
];

export function SafeDrivingCard() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((prev) => (prev + 1) % TIPS.length);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const tip = TIPS[idx];

  return (
    <div
      className="card-senior w-full"
      style={{ maxWidth: "320px", minHeight: "100px", transition: "opacity 0.3s" }}
    >
      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--color-senior-text-muted)",
          marginBottom: "0.5rem",
        }}
      >
        안전 운전 수칙 {idx + 1} / {TIPS.length}
      </p>
      <div className="flex items-start gap-3">
        <span style={{ fontSize: "2rem" }}>{tip.icon}</span>
        <div>
          <p style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            {tip.title}
          </p>
          <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", lineHeight: 1.5 }}>
            {tip.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
