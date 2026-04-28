"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function GAPageTracker({ gaId }: { gaId: string }) {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    window.gtag?.("config", gaId, { page_path: url });
  }, [gaId, pathname, searchParams]);

  return null;
}

interface Props {
  gaId: string;
}

/** GA4 스크립트 로드 + Next.js SPA 라우트 변경마다 page_view 전송 */
export function GoogleAnalytics({ gaId }: Props) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: false });
        `}
      </Script>
      {/* useSearchParams는 Suspense 필요 */}
      <Suspense>
        <GAPageTracker gaId={gaId} />
      </Suspense>
    </>
  );
}
