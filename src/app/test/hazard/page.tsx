"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpeechGuide } from "@/components/SpeechGuide";
import { TestProgressBar } from "@/components/TestProgressBar";
import { useTestStore } from "@/lib/useTestStore";
import { useSpeech } from "@/lib/useSpeech";
import { useLevelStore } from "@/lib/useLevelStore";
import { LEVEL_CONFIGS } from "@/lib/levelConfig";

const APPEAR_MIN    = 1000;
const APPEAR_MAX    = 2000;
const HIT_RADIUS_PX = 60;

type Phase = "guide" | "waiting" | "active" | "feedback";

export default function HazardTestPage() {
  const router          = useRouter();
  const { speak }       = useSpeech();
  const addHazardAnswer = useTestStore((s) => s.addHazardAnswer);
  const level           = useLevelStore((s) => s.level);
  const cfg             = LEVEL_CONFIGS[level];

  const [round,      setRound]      = useState(0);
  const [phase,      setPhase]      = useState<Phase>("guide");
  const [hazardPos,  setHazardPos]  = useState({ x: 50, y: 50 });
  const [feedbackOk, setFeedbackOk] = useState(false);
  const [tapped,     setTapped]     = useState(false);

  const sceneRef       = useRef<HTMLDivElement>(null);
  const delayTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundRef       = useRef(0);

  const clearTimers = useCallback(() => {
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
  }, []);

  useEffect(() => { roundRef.current = round; }, [round]);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleResultRef = useRef<((hit: boolean) => void) | undefined>(undefined);
  handleResultRef.current = (hit: boolean) => {
    clearTimers();
    addHazardAnswer(hit);
    setFeedbackOk(hit);
    setPhase("feedback");
    speak(hit ? "잘 피하셨어요!" : "위험 요소를 놓쳤어요!");

    const nextRound = roundRef.current + 1;
    activeTimerRef.current = setTimeout(() => {
      if (nextRound >= cfg.hazardRounds) {
        router.push("/result-loading");
      } else {
        setRound(nextRound);
        startRoundRef.current?.();
      }
    }, 1000);
  };

  const startRoundRef = useRef<(() => void) | undefined>(undefined);
  startRoundRef.current = () => {
    setPhase("waiting");
    setTapped(false);
    const delay = APPEAR_MIN + Math.random() * (APPEAR_MAX - APPEAR_MIN);
    delayTimerRef.current = setTimeout(() => {
      setHazardPos({ x: 20 + Math.random() * 60, y: 25 + Math.random() * 50 });
      setPhase("active");
      activeTimerRef.current = setTimeout(
        () => handleResultRef.current?.(false),
        cfg.hazardTimeoutMs
      );
    }, delay);
  };

  const startRound = useCallback(() => startRoundRef.current?.(), []);

  const handleSceneTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (tapped || phase !== "active" || !sceneRef.current) return;
      const rect    = sceneRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const tapX    = clientX - rect.left;
      const tapY    = clientY - rect.top;
      const hazardX = (hazardPos.x / 100) * rect.width;
      const hazardY = (hazardPos.y / 100) * rect.height;
      const dist    = Math.hypot(tapX - hazardX, tapY - hazardY);
      if (dist <= HIT_RADIUS_PX) {
        setTapped(true);
        handleResultRef.current?.(true);
      }
    },
    [tapped, phase, hazardPos]
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <TestProgressBar current={round} total={cfg.hazardRounds} label="위험 지각 테스트" />

      {phase === "guide" && (
        <div className="flex flex-1 flex-col justify-between px-6 py-4">
          <SpeechGuide text={`도로에 위험 요소가 나타나면 바로 눌러주세요. 총 ${cfg.hazardRounds}번 반복합니다.`} />
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
        <div
          ref={sceneRef}
          className="relative flex-1 select-none overflow-hidden"
          style={{ backgroundColor: "#4a5568", cursor: "crosshair" }}
          onClick={handleSceneTap}
          onTouchStart={handleSceneTap}
        >
          {/* 도로 */}
          <div style={{ position: "absolute", left: "20%", right: "20%", top: 0, bottom: 0, backgroundColor: "#374151" }} />
          {/* 중앙 점선 */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                position:        "absolute",
                left:            "calc(50% - 4px)",
                top:             `${i * 10}%`,
                width:           "8px",
                height:          "6%",
                backgroundColor: "#f5c518",
                borderRadius:    "4px",
              }}
            />
          ))}
          {phase === "waiting" && (
            <p style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", fontSize: "1.25rem", color: "#fff", whiteSpace: "nowrap" }}>
              잠깐 기다려주세요...
            </p>
          )}
          {phase === "active" && (
            <div
              role="img"
              aria-label="위험 요소"
              style={{
                position:  "absolute",
                left:      `${hazardPos.x}%`,
                top:       `${hazardPos.y}%`,
                transform: "translate(-50%, -50%)",
                fontSize:  "4rem",
                userSelect:"none",
                filter:    "drop-shadow(0 0 8px rgba(255,50,50,0.9))",
                animation: "pulse 0.5s ease-in-out infinite alternate",
              }}
            >
              🚶
            </div>
          )}
        </div>
      )}

      {phase === "feedback" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <span style={{ fontSize: "4rem" }}>{feedbackOk ? "✅" : "⚠️"}</span>
          <p style={{ fontSize: "1.75rem", fontWeight: 700 }}>
            {feedbackOk ? "잘 피하셨어요!" : "위험 요소를 놓쳤어요!"}
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          from { transform: translate(-50%, -50%) scale(1); }
          to   { transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
