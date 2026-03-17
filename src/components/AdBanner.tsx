"use client";

import { useEffect, useRef } from "react";
import { AdErrorBoundary } from "@/components/AdErrorBoundary";
import { SafeDrivingCard } from "@/components/SafeDrivingCard";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

function AdUnit() {
  const pushed  = useRef(false);
  const client  = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot    = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  const isProd  = process.env.NODE_ENV === "production" && !!client;

  useEffect(() => {
    if (!isProd || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("[AdSense] push 실패:", e);
    }
  }, [isProd]);

  // 개발 환경 / client ID 없음 → 플레이스홀더
  if (!isProd) {
    return (
      <div style={{
        width: "300px", height: "250px",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "8px",
        border: "2px dashed var(--color-senior-border)",
        borderRadius: "0.5rem",
        color: "var(--color-senior-text-muted)",
        fontSize: "0.9rem",
      }}>
        <span style={{ fontSize: "2rem" }}>📰</span>
        <span>광고 영역 (300×250)</span>
        <span style={{ fontSize: "0.75rem" }}>프로덕션 배포 후 실제 광고 표시</span>
      </div>
    );
  }

  // 구글 AdSense 스니펫과 동일하게 적용
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}   // 없으면 undefined → 속성 미출력, Auto Ads로 동작
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

export function AdBanner() {
  return (
    <AdErrorBoundary fallback={<SafeDrivingCard />}>
      <AdUnit />
    </AdErrorBoundary>
  );
}
