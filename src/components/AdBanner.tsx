"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { AdErrorBoundary } from "@/components/AdErrorBoundary";
import { SafeDrivingCard } from "@/components/SafeDrivingCard";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  /** "banner" = 하단 얇은 배너 (기본) | "rectangle" = 중앙 큰 직사각형 */
  variant?: "banner" | "rectangle";
}

function AdUnit({ variant = "banner" }: AdUnitProps) {
  const pushed = useRef(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const slot   = process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim();

  const isRect    = variant === "rectangle";
  const minHeight = isRect ? "250px" : "60px";

  useEffect(() => {
    if (!client || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("[AdSense] push 실패:", e);
    }
  }, [client]);

  if (!client) {
    return (
      <div style={{
        width: "100%",
        maxWidth: isRect ? "336px" : "100%",
        height: minHeight,
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
    <>
      {/* 광고가 있는 페이지에서만 스크립트 로드 (Auto Ads 방지) */}
      <Script
        id="adsbygoogle-js"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={isRect ? "rectangle" : "auto"}
        data-full-width-responsive={isRect ? "false" : "true"}
      />
    </>
  );
}

interface AdBannerProps {
  variant?: "banner" | "rectangle";
}

export function AdBanner({ variant = "banner" }: AdBannerProps) {
  return (
    <AdErrorBoundary fallback={<SafeDrivingCard />}>
      <AdUnit variant={variant} />
    </AdErrorBoundary>
  );
}
