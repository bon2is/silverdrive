"use client";

import { useEffect } from "react";
import { useSpeech } from "@/lib/useSpeech";

interface SpeechGuideProps {
  text: string;
  autoPlay?: boolean;
}

export function SpeechGuide({ text, autoPlay = true }: SpeechGuideProps) {
  const { speak } = useSpeech();

  useEffect(() => {
    if (autoPlay) {
      // 짧은 딜레이 후 재생 (iOS Safari 첫 발화 타이밍 이슈 방지)
      const t = setTimeout(() => speak(text), 300);
      return () => clearTimeout(t);
    }
  }, [text, autoPlay, speak]);

  return (
    <div className="card-senior mb-4 flex items-start gap-3">
      <span className="text-2xl">📢</span>
      <div className="flex-1">
        <p style={{ fontSize: "1.125rem", lineHeight: 1.6 }}>{text}</p>
        <button
          onClick={() => speak(text)}
          className="btn-senior mt-3"
          style={{
            fontSize: "1rem",
            padding: "0.5rem 1.25rem",
            minHeight: "3rem",
            backgroundColor: "var(--color-senior-border)",
            color: "var(--color-senior-text)",
            borderRadius: "0.5rem",
          }}
        >
          🔊 다시 듣기
        </button>
      </div>
    </div>
  );
}
