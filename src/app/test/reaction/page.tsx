"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpeechGuide } from "@/components/SpeechGuide";
import { TestProgressBar } from "@/components/TestProgressBar";
import { useTestStore } from "@/lib/useTestStore";
import { useSpeech } from "@/lib/useSpeech";

const TOTAL_ROUNDS = 5;
const TIMEOUT_MS   = 3000;
const MIN_DELAY    = 1500;
const MAX_DELAY    = 3000;

type Phase = "guide" | "waiting" | "active" | "feedback";

interface FeedbackState { success: boolean; ms: number }

export default function ReactionTestPage() {
  const router          = useRouter();
  const { speak }       = useSpeech();
  const addReactionTime = useTestStore((s) => s.addReactionTime);

  const [round,     setRound]     = useState(0);
  const [phase,     setPhase]     = useState<Phase>("guide");
  const [circlePos, setCirclePos] = useState({ x: 50, y: 50 });
  const [feedback,  setFeedback]  = useState<FeedbackState | null>(null);
  const [tapped,    setTapped]    = useState(false);

  const startTimeRef  = useRef<number>(0);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // stale closure 방지: 타이머 콜백에서 최신 round를 읽기 위한 ref
  const roundRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
  }, []);

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // ref-as-stable-callback 패턴: 타이머에서 항상 최신 핸들러를 호출
  const handleResultRef = useRef<((success: boolean, ms: number) => void) | undefined>(undefined);
  handleResultRef.current = (success: boolean, ms: number) => {
    clearTimers();
    addReactionTime(ms);
    setFeedback({ success, ms });
    setPhase("feedback");
    speak(success ? "잘 하셨어요!" : "조금 더 빠르게!");

    const nextRound = roundRef.current + 1;
    activeTimerRef.current = setTimeout(() => {
      if (nextRound >= TOTAL_ROUNDS) {
        router.push("/test/signs");
      } else {
        setRound(nextRound);
        startRoundRef.current?.();
      }
    }, 1500);
  };

  const startRoundRef = useRef<(() => void) | undefined>(undefined);
  startRoundRef.current = () => {
    setPhase("waiting");
    setTapped(false);
    setFeedback(null);
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    delayTimerRef.current = setTimeout(() => {
      setCirclePos({ x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 });
      startTimeRef.current = Date.now();
      setPhase("active");
      activeTimerRef.current = setTimeout(
        () => handleResultRef.current?.(false, TIMEOUT_MS),
        TIMEOUT_MS
      );
    }, delay);
  };

  const startRound = useCallback(() => startRoundRef.current?.(), []);

  const handleCircleTap = useCallback(() => {
    if (tapped || phase !== "active") return;
    setTapped(true);
    const ms = Date.now() - startTimeRef.current;
    handleResultRef.current?.(true, ms);
  }, [tapped, phase]);

  return (
    <div className="flex min-h-dvh flex-col">
      <TestProgressBar current={round} total={TOTAL_ROUNDS} label="자극 반응 테스트" />

      {phase === "guide" && (
        <div className="flex flex-1 flex-col justify-between px-6 py-4">
          <SpeechGuide text="노란 원이 나타나면 최대한 빠르게 눌러주세요. 총 5번 반복합니다." />
          <button
            onClick={startRound}
            className="btn-senior btn-senior-primary w-full"
            style={{ fontSize: "1.375rem" }}
          >
            시작하기
          </button>
        </div>
      )}

      {(phase === "waiting" || phase === "active") && (
        <div className="relative flex-1" style={{ backgroundColor: "#111" }}>
          {phase === "waiting" && (
            <p
              className="absolute left-1/2 top-8 -translate-x-1/2 text-center"
              style={{ fontSize: "1.25rem", color: "var(--color-senior-text-muted)" }}
            >
              잠깐 기다려주세요...
            </p>
          )}
          {phase === "active" && (
            <button
              onClick={handleCircleTap}
              disabled={tapped}
              aria-label="노란 원 누르기"
              style={{
                position:        "absolute",
                left:            `${circlePos.x}%`,
                top:             `${circlePos.y}%`,
                transform:       "translate(-50%, -50%)",
                width:           "120px",
                height:          "120px",
                borderRadius:    "50%",
                backgroundColor: "var(--color-senior-primary)",
                border:          "none",
                cursor:          "pointer",
                boxShadow:       "0 0 30px rgba(245,197,24,0.7)",
              }}
            />
          )}
        </div>
      )}

      {phase === "feedback" && feedback && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <span style={{ fontSize: "4rem" }}>{feedback.success ? "✅" : "⏰"}</span>
          <p style={{ fontSize: "1.75rem", fontWeight: 700 }}>
            {feedback.success ? "잘 하셨어요!" : "조금 더 빠르게!"}
          </p>
          {feedback.success && (
            <p style={{ fontSize: "1.25rem", color: "var(--color-senior-text-muted)" }}>
              반응 시간: {feedback.ms}ms
            </p>
          )}
        </div>
      )}
    </div>
  );
}
