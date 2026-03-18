"use client";

import { useEffect, useState } from "react";
import { useSpeech } from "@/lib/useSpeech";
import { isKakaoWebview } from "@/lib/isKakaoWebview";

interface SpeechGuideProps {
  text: string;
  autoPlay?: boolean;
}

export function SpeechGuide({ text, autoPlay = true }: SpeechGuideProps) {
  const { speak }       = useSpeech();
  const [inKakao]       = useState(() => isKakaoWebview());
  // speechSynthesis 지원 여부 (카톡 웹뷰·일부 Android에서 undefined)
  const [ttsSupported]  = useState(
    () => typeof window !== "undefined" && !!window.speechSynthesis
  );

  useEffect(() => {
    if (autoPlay && ttsSupported) {
      const t = setTimeout(() => speak(text), 300);
      return () => clearTimeout(t);
    }
  }, [text, autoPlay, speak, ttsSupported]);

  return (
    <div
      className="card-senior mb-4 flex items-start gap-3"
      style={inKakao ? { borderWidth: "3px", borderColor: "var(--color-senior-primary)" } : undefined}
    >
      <span className="text-2xl">📢</span>
      <div className="flex-1">
        {/* 카톡 웹뷰에서는 텍스트를 더 크게·굵게 강조 */}
        <p
          style={{
            fontSize:   inKakao ? "1.25rem" : "1.125rem",
            fontWeight: inKakao ? 700        : undefined,
            lineHeight: 1.6,
          }}
        >
          {text}
        </p>

        {ttsSupported ? (
          <button
            onClick={() => speak(text)}
            className="btn-senior mt-3"
            style={{
              fontSize:        "1rem",
              padding:         "0.5rem 1.25rem",
              minHeight:       "3rem",
              backgroundColor: "var(--color-senior-border)",
              color:           "var(--color-senior-text)",
              borderRadius:    "0.5rem",
            }}
          >
            🔊 다시 듣기
          </button>
        ) : (
          /* TTS 불가 환경 (카톡 웹뷰 등) → 안내 텍스트로 대체 */
          <p
            style={{
              marginTop: "0.5rem",
              fontSize:  "0.875rem",
              color:     "var(--color-senior-text-muted)",
            }}
          >
            📖 위 안내문을 읽고 시작해 주세요
          </p>
        )}
      </div>
    </div>
  );
}
