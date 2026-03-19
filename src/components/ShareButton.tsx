"use client";

import { useCallback, useState } from "react";
import Script from "next/script";
import { Grade } from "@/lib/gradeCalculator";
import { initKakao } from "@/lib/kakaoSdk";

const GRADE_EMOJI: Record<Grade, string> = {
  safe:    "🟢",
  caution: "🟡",
  danger:  "🔴",
};

const GRADE_LABEL: Record<Grade, string> = {
  safe:    "안전 운전 가능",
  caution: "주의 필요",
  danger:  "집중 연습 필요",
};

const BASE_URL = "https://silverdrive.andxo.com";

interface ShareButtonProps {
  grade: Grade;
  total: number;
}

export function ShareButton({ grade, total }: ShareButtonProps) {
  const [copied, setCopied]         = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);
  const [kakaoError, setKakaoError] = useState(false);

  const emoji = GRADE_EMOJI[grade];
  const label = GRADE_LABEL[grade];

  const handleSdkLoad = useCallback(() => {
    setKakaoReady(initKakao());
  }, []);

  // ── Web Share / 클립보드 폴백 (항상 먼저 정의) ────────────────
  const handleNativeShare = useCallback(async () => {
    const text = [
      `${emoji} 운전 적성 자가진단 — ${total}점 · ${label}`,
      ``,
      `🧠 기억력  🔢 주의력  🚦 반응속도`,
      `🪧 표지판  ⚠️ 위험지각`,
      `5가지 검사를 무료로 연습할 수 있어요!`,
      ``,
      `👉 ${BASE_URL}`,
      `#운전면허갱신 #75세적성검사 #실버드라이브`,
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({ title: "실버드라이브 자가진단", text, url: BASE_URL });
      } catch (e) {
        // AbortError(취소)는 무시, 그 외는 클립보드로 재시도
        if (e instanceof Error && e.name !== "AbortError") {
          try {
            await navigator.clipboard.writeText(`${text}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          } catch { /* clipboard도 실패 시 무시 */ }
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch { /* 권한 없을 시 무시 */ }
    }
  }, [emoji, label, total]);

  // ── 카카오 공유 (sendScrap: OG 태그 기반) ────────────────────
  // Kakao 서버가 BASE_URL을 크롤링해 og:title/og:image/og:url로 카드 생성.
  // 링크는 og:url 기반으로 Kakao가 자동 삽입 → 탭 시 반드시 동작.
  // OG 이미지: /share-image.png (정적 파일, 크롤러 접근 가능)
  const handleKakaoShare = useCallback(() => {
    if (!window.Kakao?.Share) {
      handleNativeShare();
      return;
    }
    try {
      window.Kakao.Share.sendScrap({ requestUrl: BASE_URL });
    } catch {
      setKakaoError(true);
      handleNativeShare();
    }
  }, [handleNativeShare]);

  // ── 친구에게 도전장 ────────────────────────────────────────────
  const handleKakaoChallenge = useCallback(() => {
    if (!window.Kakao?.Share) {
      handleNativeShare();
      return;
    }
    try {
      window.Kakao.Share.sendScrap({ requestUrl: BASE_URL });
    } catch {
      setKakaoError(true);
      handleNativeShare();
    }
  }, [handleNativeShare]);

  const shareLabel = copied
    ? "✅ 클립보드에 복사됐어요!"
    : kakaoError
      ? "링크 복사하기"
      : "카카오톡으로 결과 공유하기";

  const handleShareClick = kakaoReady && !kakaoError
    ? handleKakaoShare
    : handleNativeShare;

  const handleChallengeClick = kakaoReady && !kakaoError
    ? handleKakaoChallenge
    : handleNativeShare;

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={handleSdkLoad}
        onError={() => setKakaoReady(false)}
      />

      <div className="space-y-3">
        {/* 결과 공유 */}
        <button
          onClick={handleShareClick}
          className="btn-senior w-full"
          style={{
            fontSize:        "1.25rem",
            fontWeight:      900,
            backgroundColor: "#FEE500",
            color:           "#191600",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             "0.625rem",
            boxShadow:       "0 4px 12px rgba(254,229,0,0.4)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {!kakaoError && <img src="/kakao-logo.svg" alt="" width={26} height={26} style={{ flexShrink: 0 }} />}
          {shareLabel}
        </button>

        {/* 도전장 */}
        <button
          onClick={handleChallengeClick}
          className="btn-senior w-full"
          style={{
            fontSize:        "1.125rem",
            fontWeight:      900,
            backgroundColor: "#1a1a2e",
            color:           "#FEE500",
            border:          "2px solid #FEE500",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             "0.5rem",
          }}
        >
          🏆 친구에게 도전장 보내기
        </button>
      </div>
    </>
  );
}
