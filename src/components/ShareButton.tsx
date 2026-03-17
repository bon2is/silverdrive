"use client";

import { useCallback, useState } from "react";

interface ShareButtonProps {
  gradeLabel: string;
  total: number;
}

export function ShareButton({ gradeLabel, total }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `[실버드라이브] 나의 운전 적성 결과: ${gradeLabel} (${total}점)\n무료로 연습해 보세요 → https://silverdrive.andxo.com`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // 사용자 취소 시 무시
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [shareText]);

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
      {copied ? "✅ 클립보드에 복사됐어요!" : "📤 결과 공유하기"}
    </button>
  );
}
