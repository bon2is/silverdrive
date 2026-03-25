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

// /share 페이지 — 서버 렌더링 + generateMetadata로 점수별 동적 OG 이미지 제공
// sendScrap이 이 URL을 크롤링 → 카카오 카드에 실제 점수/등급 이미지 노출
function makeShareUrl(grade: Grade, total: number) {
  return `${BASE_URL}/share?grade=${grade}&score=${total}&utm_source=kakao&utm_medium=share&utm_campaign=result`;
}
function makeChallengeUrl(grade: Grade, total: number) {
  return `${BASE_URL}/share?grade=${grade}&score=${total}&utm_source=kakao&utm_medium=challenge`;
}

// 네이티브 공유용 UTM URL (카카오 크롤러 불필요)
const RESULT_URL_BASE   = `${BASE_URL}?utm_source=kakao&utm_medium=share&utm_campaign=result`;
const CHALLENGE_URL_BASE = `${BASE_URL}?utm_source=kakao&utm_medium=challenge`;

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
      `나는 ${label}! 어르신 운전 적성 자가진단`,
      `종합 ${total}점 나왔어요 🚗`,
      ``,
      `75세 갱신 전에 한 번 연습해보세요 👇`,
      ``,
      `🧠 기억력  🔢 주의력  🚦 반응속도`,
      `🪧 표지판  ⚠️ 위험지각`,
      `5가지 검사 무료!`,
      ``,
      `👉 ${RESULT_URL_BASE}`,
      `#운전면허갱신 #75세적성검사 #실버드라이브 #고령운전자`,
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({ title: "실버드라이브 자가진단", text, url: RESULT_URL_BASE });
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
  }, [label, total]);

  // ── 카카오 공유 (sendScrap: OG 태그 기반) ────────────────────
  // Kakao 서버가 RESULT_URL을 크롤링해 og:title/og:image/og:url로 카드 생성.
  // UTM 파라미터는 GA4 채널별 유입 트래킹에 사용됨.
  const handleKakaoShare = useCallback(() => {
    if (!window.Kakao?.Share) {
      handleNativeShare();
      return;
    }
    try {
      window.Kakao.Share.sendScrap({ requestUrl: makeShareUrl(grade, total) });
    } catch {
      setKakaoError(true);
      handleNativeShare();
    }
  }, [handleNativeShare]);

  // ── 친구에게 도전장 ────────────────────────────────────────────
  const handleChallengeNativeShare = useCallback(async () => {
    const text = [
      `나는 ${total}점 나왔는데, 당신은요? 🏆`,
      `75세 운전면허 갱신 인지능력 자가진단`,
      `같이 해봐요 👇`,
      ``,
      `👉 ${CHALLENGE_URL_BASE}`,
      `#운전면허갱신 #75세적성검사 #실버드라이브`,
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({ title: "실버드라이브 도전장", text, url: CHALLENGE_URL_BASE });
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          await navigator.clipboard.writeText(text).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      }
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [total]);

  const handleKakaoChallenge = useCallback(() => {
    if (!window.Kakao?.Share) {
      handleChallengeNativeShare();
      return;
    }
    try {
      window.Kakao.Share.sendScrap({ requestUrl: makeChallengeUrl(grade, total) });
    } catch {
      setKakaoError(true);
      handleChallengeNativeShare();
    }
  }, [handleChallengeNativeShare]);

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
    : handleChallengeNativeShare;

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
          🏆 &ldquo;나는 {total}점, 당신은요?&rdquo; 도전장 보내기
        </button>
      </div>
    </>
  );
}
