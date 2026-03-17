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
  const pushed = useRef(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const slot   = process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim();

  useEffect(() => {
    if (!client || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("[AdSense] push 실패:", e);
    }
  }, [client]);

  // Publisher ID 없을 때만 플레이스홀더
  if (!client) {
    return (
      <div style={{
        width: "100%", maxWidth: "320px", height: "100px",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "2px dashed var(--color-senior-border)",
        borderRadius: "0.5rem",
        color: "var(--color-senior-text-muted)",
        fontSize: "0.875rem",
      }}>
        광고 영역
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", minHeight: "100px" }}
      data-ad-client={client}
      data-ad-slot={slot}
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
