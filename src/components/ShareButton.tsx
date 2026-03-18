"use client";

import { useCallback, useEffect, useState } from "react";
import { Grade } from "@/lib/gradeCalculator";
import { initKakao } from "@/lib/kakaoSdk";

const GRADE_EMOJI: Record<Grade, string> = {
  safe:    "🟢",
  caution: "🟡",
  danger:  "🔴",
};

const GRADE_LABEL: Record<Grade, string> = {
  safe:    "안전",
  caution: "주의",
  danger:  "노력 필요",
};

const BASE_URL = "https://silverdrive.andxo.com";
const OG_IMAGE = `${BASE_URL}/opengraph-image.png`;

interface ShareButtonProps {
  grade: Grade;
  total: number;
}

export function ShareButton({ grade, total }: ShareButtonProps) {
  const [copied, setCopied]         = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  const emoji = GRADE_EMOJI[grade];
  const label = GRADE_LABEL[grade];

  // Kakao SDK 초기화 (SDK 스크립트 로드 완료 후)
  useEffect(() => {
    // lazyOnload 이므로 약간 대기 후 재시도
    const tryInit = () => setKakaoReady(initKakao());
    tryInit();
    const t = setTimeout(tryInit, 1500);
    return () => clearTimeout(t);
  }, []);

  // ── 카카오 피드 공유 (결과 자랑하기) ──────────────────────────
  const handleKakaoShare = useCallback(() => {
    if (!window.Kakao?.Share) return;
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `운전 적성 자가진단 결과 ${emoji} ${label} (${total}점)`,
        description:
          "75세 운전면허 갱신 대비 — 기억력·주의력·반응속도·표지판·위험지각 5가지 검사를 무료로 연습하세요!",
        imageUrl: OG_IMAGE,
        link: { mobileWebUrl: BASE_URL, webUrl: BASE_URL },
      },
      buttons: [
        {
          title: "나도 해보기 🚗",
          link: { mobileWebUrl: BASE_URL, webUrl: BASE_URL },
        },
      ],
    });
  }, [emoji, label, total]);

  // ── 카카오 도전장 보내기 (바이럴 특화) ────────────────────────
  const handleKakaoChallenge = useCallback(() => {
    if (!window.Kakao?.Share) return;
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `나는 ${total}점! 당신도 운전 적성 자가진단 해보세요 👀`,
        description: `${emoji} ${label} 등급 획득! 5가지 인지능력 검사 — 도전해보세요!`,
        imageUrl: OG_IMAGE,
        link: { mobileWebUrl: BASE_URL, webUrl: BASE_URL },
      },
      buttons: [
        {
          title: "도전하기 🏆",
          link: { mobileWebUrl: BASE_URL, webUrl: BASE_URL },
        },
      ],
    });
  }, [emoji, label, total]);

  // ── Web Share API / 클립보드 폴백 ─────────────────────────────
  const handleNativeShare = useCallback(async () => {
    const text = [
      `나도 해봤어요! 운전 적성 자가진단 결과 🚗`,
      ``,
      `${emoji} ${label} 등급 (종합 ${total}점)`,
      ``,
      `🧠 기억력  🔢 주의력  🚦 반응속도`,
      `🪧 표지판  ⚠️ 위험지각`,
      `5가지 검사를 무료로 연습할 수 있어요!`,
      ``,
      `👉 ${BASE_URL}`,
      ``,
      `#운전면허갱신 #75세적성검사 #실버드라이브`,
    ].join("\n");

    if (navigator.share) {
      try { await navigator.share({ title: "실버드라이브 자가진단", text }); }
      catch { /* 사용자 취소 */ }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [emoji, label, total]);

  return (
    <div className="space-y-3">
      {/* 결과 공유 버튼 */}
      <button
        onClick={kakaoReady ? handleKakaoShare : handleNativeShare}
        className="btn-senior w-full"
        style={{
          fontSize:        "1.25rem",
          backgroundColor: kakaoReady ? "#FEE500" : "var(--color-senior-border)",
          color:           kakaoReady ? "#191600" : "var(--color-senior-primary)",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          gap:             "0.5rem",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {kakaoReady && <img src="/kakao-logo.svg" alt="" width={24} height={24} style={{ flexShrink: 0 }} />}
        {copied ? "✅ 클립보드에 복사됐어요!" : "카카오톡으로 결과 공유하기"}
      </button>

      {/* 친구에게 도전장 보내기 (카카오 전용) */}
      {kakaoReady && (
        <button
          onClick={handleKakaoChallenge}
          className="btn-senior w-full"
          style={{
            fontSize:        "1.125rem",
            backgroundColor: "#191600",
            color:           "#FEE500",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             "0.5rem",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kakao-logo.svg" alt="" width={22} height={22} style={{ flexShrink: 0, filter: "invert(0.9) sepia(1) saturate(5) hue-rotate(10deg)" }} />
          친구에게 도전장 보내기 🏆
        </button>
      )}
    </div>
  );
}
