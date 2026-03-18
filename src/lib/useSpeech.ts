"use client";

import { useCallback, useEffect, useRef } from "react";

// 여성 목소리 이름 키워드 (OS별 주요 한국어 여성 음성)
const FEMALE_VOICE_KEYWORDS = [
  "yuna",
  "heami",
  "female",
  "woman",
  "여성",
];

function pickKoreanFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices  = window.speechSynthesis.getVoices();
  const korean  = voices.filter((v) => v.lang.startsWith("ko"));
  if (korean.length === 0) return null;

  const female = korean.find((v) =>
    FEMALE_VOICE_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw))
  );
  if (female) return female;

  return korean[1] ?? korean[0];
}

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    function loadVoices() {
      voiceRef.current = pickKoreanFemaleVoice();
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance    = new SpeechSynthesisUtterance(text);
    utterance.lang     = "ko-KR";
    utterance.rate     = 1.06;
    utterance.pitch    = 1.1;

    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, cancel };
}
