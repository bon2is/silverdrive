"use client";

import { useCallback, useEffect, useRef } from "react";

// 여성 목소리 이름 키워드 (OS별 주요 한국어 여성 음성)
const FEMALE_VOICE_KEYWORDS = [
  "yuna",        // macOS / iOS 기본 한국어 여성
  "heami",       // Windows Microsoft 한국어 여성
  "female",
  "woman",
  "여성",
];

function pickKoreanFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const korean  = voices.filter((v) => v.lang.startsWith("ko"));
  if (korean.length === 0) return null;

  // 여성 키워드가 이름에 포함된 음성 우선
  const female = korean.find((v) =>
    FEMALE_VOICE_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw))
  );
  if (female) return female;

  // 폴백: 한국어 목록 중 두 번째 (macOS에서 보통 Yuna가 두 번째)
  return korean[1] ?? korean[0];
}

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    function loadVoices() {
      voiceRef.current = pickKoreanFemaleVoice();
    }

    loadVoices(); // 이미 로드된 경우 즉시 적용
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();

    const utterance    = new SpeechSynthesisUtterance(text);
    utterance.lang     = "ko-KR";
    utterance.rate     = 1.06; // 0.85 × 1.25배 빠르게
    utterance.pitch    = 1.1;  // 약간 높은 음조로 친근한 느낌

    // 여성 음성이 로드됐으면 적용
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, cancel };
}
