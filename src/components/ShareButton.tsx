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

const GRADE_MSG: Record<Grade, string> = {
  safe:    "5가지 인지능력 검사 모두 통과! 당신도 도전해보세요 🚗",
  caution: "연습하면 충분히 합격할 수 있어요! 지금 바로 도전해보세요 🚗",
  danger:  "반복 연습으로 면허 갱신을 준비하세요! 같이 해봐요 🚗",
};

const BASE_URL  = "https://silverdrive.andxo.com";
// Next.js opengraph-image 라우트 (확장자 없음) + 정적 앱 이미지 순서로 시도
const SHARE_IMG = `${BASE_URL}/share-image.png`;

interface ShareButtonProps {
  grade: Grade;
  total: number;
}

export function ShareButton({ grade, total }: ShareButtonProps) {
  const [copied, setCopied]         = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  const emoji = GRADE_EMOJI[grade];
  const label = GRADE_LABEL[grade];

  const handleSdkLoad = useCallback(() => {
    setKakaoReady(initKakao());
  }, []);

  // ── 카카오 공유 (sendDefault: feed 카드 — content.link로 링크 삽입) ──
  // buttons는 비즈앱 전용이라 일반 앱에선 미노출.
  // 카드 이미지/제목 탭 시 content.link가 열리므로 버튼 없이도 링크 동작.
  const handleKakaoShare = useCallback(() => {
    if (!window.Kakao?.Share) return;
    const link = { mobileWebUrl: BASE_URL, webUrl: BASE_URL };
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${emoji} 실버드라이브 ${total}점 · ${label}`,
        description: "75세 이상 운전면허 갱신 인지능력검사 무료 연습 — 5가지 검사를 지금 바로 도전해보세요!",
        imageUrl: SHARE_IMG,
        link,
      },
    });
  }, [emoji, label, total]);

  // ── 친구에게 도전장 ────────────────────────────────────────────
  const handleKakaoChallenge = useCallback(() => {
    if (!window.Kakao?.Share) return;
    const link = { mobileWebUrl: BASE_URL, webUrl: BASE_URL };
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "실버드라이브 — 나도 도전해봐! 🚗",
        description: "75세 운전면허 갱신 인지능력검사 무료 연습. 5가지 검사로 미리 준비하세요.",
        imageUrl: SHARE_IMG,
        link,
      },
    });
  }, []);

  // ── Web Share / 클립보드 폴백 ──────────────────────────────────
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
      try { await navigator.share({ title: "실버드라이브 자가진단", text }); }
      catch { /* 취소 */ }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [emoji, label, total]);

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={handleSdkLoad}
      />

      <div className="space-y-3">
        {/* 결과 공유 */}
        <button
          onClick={kakaoReady ? handleKakaoShare : handleNativeShare}
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
          <img src="/kakao-logo.svg" alt="" width={26} height={26} style={{ flexShrink: 0 }} />
          {copied ? "✅ 클립보드에 복사됐어요!" : "카카오톡으로 결과 공유하기"}
        </button>

        {/* 도전장 */}
        <button
          onClick={kakaoReady ? handleKakaoChallenge : handleNativeShare}
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
