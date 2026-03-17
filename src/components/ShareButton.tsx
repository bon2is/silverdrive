"use client";

import { useCallback, useState } from "react";
import { Grade } from "@/lib/gradeCalculator";

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

interface ShareButtonProps {
  grade: Grade;
  total: number;
}

export function ShareButton({ grade, total }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const emoji = GRADE_EMOJI[grade];
  const label = GRADE_LABEL[grade];

  const shareTitle = "실버드라이브 — 운전 적성 자가진단";
  const shareText = [
    `나도 해봤어요! 운전 적성 자가진단 결과 🚗`,
    ``,
    `${emoji} ${label} 등급 (종합 ${total}점)`,
    ``,
    `🧠 기억력  🔢 주의력  🚦 반응속도`,
    `🪧 표지판  ⚠️ 위험지각`,
    `5가지 검사를 무료로 연습할 수 있어요!`,
    ``,
    `👉 silverdrive.andxo.com`,
    ``,
    `#운전면허갱신 #75세적성검사 #실버드라이브 #고령운전자`,
  ].join("\n");

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText });
      } catch {
        // 사용자 취소 시 무시
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [shareTitle, shareText]);

  return (
    <button
      onClick={handleShare}
      className="btn-senior w-full"
      style={{
        fontSize: "1.25rem",
        backgroundColor: "var(--color-senior-border)",
        color: "var(--color-senior-primary)",
      }}
    >
      {copied ? "✅ 클립보드에 복사됐어요!" : "📤 카카오톡으로 공유하기"}
    </button>
  );
}
