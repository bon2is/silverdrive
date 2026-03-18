"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpeechGuide } from "@/components/SpeechGuide";
import { TestProgressBar } from "@/components/TestProgressBar";
import { useTestStore } from "@/lib/useTestStore";
import { useSpeech } from "@/lib/useSpeech";
import { useLevelStore } from "@/lib/useLevelStore";
import { LEVEL_CONFIGS } from "@/lib/levelConfig";

const RED_MIN     = 1500;
const RED_MAX     = 3000;
const GREEN_LIMIT = 3000;

type Light   = "red" | "green";
type Phase   = "guide" | "waiting" | "red" | "green" | "feedback";
type Outcome = "success" | "timeout" | "false-start";

interface FeedbackState { outcome: Outcome; ms?: number }

export default function ReactionTestPage() {
  const router             = useRouter();
  const { speak }          = useSpeech();
  const addReactionTime    = useTestStore((s) => s.addReactionTime);
  const addReactionMistake = useTestStore((s) => s.addReactionMistake);
  const level              = useLevelStore((s) => s.level);
  const cfg                = LEVEL_CONFIGS[level];

  const [round,    setRound]    = useState(0);
  const [phase,    setPhase]    = useState<Phase>("guide");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [tapped,   setTapped]   = useState(false);

  const startTimeRef   = useRef<number>(0);
  const roundRef       = useRef(0);
  const delayTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (delayTimerRef.current)  clearTimeout(delayTimerRef.current);
    if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
  }, []);

  useEffect(() => { roundRef.current = round; }, [round]);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleResultRef = useRef<((outcome: Outcome, ms?: number) => void) | undefined>(undefined);
  handleResultRef.current = (outcome, ms) => {
    clearTimers();
    if (outcome === "false-start") {
      addReactionMistake();
    } else {
      addReactionTime(ms ?? GREEN_LIMIT);
    }
    setFeedback({ outcome, ms });
    setPhase("feedback");
    speak(
      outcome === "success"     ? "잘 하셨어요!" :
      outcome === "false-start" ? "빨간불에는 누르지 마세요!" :
      "조금 더 빠르게 눌러주세요!"
    );
    const nextRound = roundRef.current + 1;
    activeTimerRef.current = setTimeout(() => {
      if (nextRound >= cfg.reactionRounds) {
        router.push("/test/signs");
      } else {
        setRound(nextRound);
        startRoundRef.current?.();
      }
    }, 2000);
  };

  const startRoundRef = useRef<(() => void) | undefined>(undefined);
  startRoundRef.current = () => {
    setPhase("red");
    setTapped(false);
    setFeedback(null);
    const delay = RED_MIN + Math.random() * (RED_MAX - RED_MIN);
    delayTimerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setPhase("green");
      activeTimerRef.current = setTimeout(
        () => handleResultRef.current?.("timeout", GREEN_LIMIT),
        GREEN_LIMIT
      );
    }, delay);
  };

  const startRound = useCallback(() => startRoundRef.current?.(), []);

  const handleTap = useCallback((light: Light) => {
    if (tapped) return;
    setTapped(true);
    if (light === "red") {
      handleResultRef.current?.("false-start");
    } else {
      const ms = Date.now() - startTimeRef.current;
      handleResultRef.current?.("success", ms);
    }
  }, [tapped]);

  const feedbackColor =
    feedback?.outcome === "success"     ? "var(--color-senior-success)" :
    feedback?.outcome === "false-start" ? "var(--color-senior-danger)"  :
    "var(--color-senior-warning)";

  return (
    <div className="flex min-h-dvh flex-col">
      <TestProgressBar current={round} total={cfg.reactionRounds} label="③ 신호 반응 검사 · 3단계" />

      {phase === "guide" && (
        <div className="flex flex-1 flex-col justify-between px-6 py-4">
          <SpeechGuide text={`초록불이 켜지면 즉시 눌러주세요. 빨간불에는 누르지 마세요. 총 ${cfg.reactionRounds}번 반복합니다.`} />
          <button onClick={startRound} className="btn-senior btn-senior-primary w-full" style={{ fontSize: "1.375rem" }}>
            시작하기
          </button>
        </div>
      )}

      {(phase === "red" || phase === "green") && (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
          <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            {phase === "red" ? "🔴 기다려주세요..." : "🟢 지금 누르세요!"}
          </p>

          <div
            style={{
              display:         "flex",
              flexDirection:   "column",
              alignItems:      "center",
              gap:             "16px",
              padding:         "24px 32px",
              borderRadius:    "20px",
              backgroundColor: "#222",
            }}
          >
            {(["red", "yellow", "green"] as const).map((color) => {
              const isActive =
                (color === "red"   && phase === "red") ||
                (color === "green" && phase === "green");
              const baseColor = color === "red" ? "#e53935" : color === "yellow" ? "#f5c518" : "#4caf50";
              return (
                <button
                  key={color}
                  onClick={() => handleTap(color === "green" ? "green" : "red")}
                  disabled={tapped}
                  aria-label={color === "green" ? "초록불 누르기" : "신호등"}
                  style={{
                    width:           "100px",
                    height:          "100px",
                    borderRadius:    "50%",
                    border:          "none",
                    backgroundColor: isActive ? baseColor : "rgba(255,255,255,0.1)",
                    boxShadow:       isActive ? `0 0 40px ${baseColor}cc` : "none",
                    cursor:          color === "green" && phase === "green" ? "pointer" : "default",
                    transition:      "all 0.2s",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {phase === "feedback" && feedback && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span style={{ fontSize: "4rem" }}>
            {feedback.outcome === "success" ? "✅" : feedback.outcome === "false-start" ? "🚫" : "⏰"}
          </span>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, color: feedbackColor }}>
            {feedback.outcome === "success"     ? "잘 하셨어요!" :
             feedback.outcome === "false-start" ? "빨간불에 누르셨어요!" :
             "조금 더 빠르게!"}
          </p>
          {feedback.outcome === "success" && feedback.ms != null && (
            <p style={{ fontSize: "1.25rem", color: "var(--color-senior-text-muted)" }}>
              반응 시간: {feedback.ms}ms
            </p>
          )}
        </div>
      )}
    </div>
  );
}
