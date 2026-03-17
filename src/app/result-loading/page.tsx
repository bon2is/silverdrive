"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdBanner } from "@/components/AdBanner";
import { useSpeech } from "@/lib/useSpeech";

const TOTAL_SEC = 5;

const ANALYSIS_MSGS = [
  "어르신의 반응 속도를 분석하고 있습니다...",
  "표지판 인식 능력을 평가하고 있습니다...",
  "종합 결과를 정리하고 있습니다...",
];

export default function ResultLoadingPage() {
  const router      = useRouter();
  const { speak }   = useSpeech();
  const [elapsed,   setElapsed]   = useState(0);      // 0 ~ TOTAL_SEC
  const [msgIdx,    setMsgIdx]    = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    speak("검사 결과를 분석하고 있습니다. 잠시만 기다려주세요.");

    // 카운트다운 바 (100ms 단위로 부드럽게 업데이트)
    const startAt = Date.now();
    intervalRef.current = setInterval(() => {
      const passed = (Date.now() - startAt) / 1000;
      if (passed >= TOTAL_SEC) {
        clearInterval(intervalRef.current!);
        router.push("/result");
      } else {
        setElapsed(passed);
      }
    }, 100);

    // 분석 문구 순환 (1.5초 간격)
    msgTimerRef.current = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % ANALYSIS_MSGS.length);
    }, 1500);

    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(msgTimerRef.current!);
    };
  }, [router, speak]);

  const progressPct = Math.min((elapsed / TOTAL_SEC) * 100, 100);
  const remaining   = Math.max(Math.ceil(TOTAL_SEC - elapsed), 0);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-between px-6 py-10">

      {/* 상단: 스피너 + 분석 문구 */}
      <div className="flex flex-col items-center gap-5 pt-4">
        <div
          aria-label="분석 중"
          style={{
            width:        "80px",
            height:       "80px",
            borderRadius: "50%",
            border:       "6px solid var(--color-senior-border)",
            borderTopColor: "var(--color-senior-primary)",
            animation:    "spin 1s linear infinite",
            flexShrink:   0,
          }}
        />
        <p
          style={{
            fontSize:   "1.25rem",
            fontWeight: 700,
            textAlign:  "center",
            minHeight:  "3rem",
            color:      "var(--color-senior-text)",
          }}
        >
          {ANALYSIS_MSGS[msgIdx]}
        </p>
      </div>

      {/* 중앙: 광고 영역 (직사각형 300×250) */}
      <div style={{
        width: "100%",
        maxWidth: "336px",
        margin: "0 auto",
      }}>
        <AdBanner variant="rectangle" />
      </div>

      {/* 하단: 카운트다운 바 */}
      <div className="w-full space-y-3">
        <p
          className="text-center"
          style={{ fontSize: "1.125rem", color: "var(--color-senior-text-muted)" }}
        >
          {remaining}초 후 결과가 공개됩니다
        </p>
        <div
          className="h-4 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--color-senior-border)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width:           `${progressPct}%`,
              backgroundColor: "var(--color-senior-primary)",
              transition:      "width 0.1s linear",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
