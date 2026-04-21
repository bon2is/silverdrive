"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpeechGuide } from "@/components/SpeechGuide";
import { useSpeech } from "@/lib/useSpeech";
import { useTestStore } from "@/lib/useTestStore";
import { useLevelStore } from "@/lib/useLevelStore";
import { LEVEL_CONFIGS } from "@/lib/levelConfig";
import { getNextTestPath } from "@/lib/testNavigation";
import { useConfirmLeave } from "@/lib/useConfirmLeave";
import { LeaveConfirmModal } from "@/components/LeaveConfirmModal";

function buildPositions(total: number, cols: number, rows: number): { x: number; y: number }[] {
  const cells  = Array.from({ length: cols * rows }, (_, i) => i);
  const picked = cells.sort(() => Math.random() - 0.5).slice(0, total);
  return picked.map((idx) => {
    const col   = idx % cols;
    const row   = Math.floor(idx / cols);
    const cellW = 100 / cols;
    const cellH = 82 / rows;
    return {
      x: cellW * col + cellW * (0.2 + Math.random() * 0.6),
      y: 18 + cellH * row + cellH * (0.1 + Math.random() * 0.6),
    };
  });
}

function speedLabel(ms: number, max: number): { text: string; color: string } {
  // max 기준으로 상대 속도 평가
  const ratio = ms / (max * 3000); // max 숫자 × 3초 = 기준
  if (ratio < 0.4) return { text: "매우 빠름 ⚡", color: "var(--color-senior-success)" };
  if (ratio < 0.65) return { text: "빠름 👍",   color: "var(--color-senior-primary)" };
  if (ratio < 1.0)  return { text: "보통 😊",   color: "var(--color-senior-text-muted)" };
  return               { text: "천천히 😌",     color: "#f59e0b" };
}

type Phase = "guide" | "test" | "done";

export default function TrailTestPage() {
  const router         = useRouter();
  const { speak }      = useSpeech();
  const setTrailResult = useTestStore((s) => s.setTrailResult);
  const level          = useLevelStore((s) => s.level);
  const selectedTests  = useLevelStore((s) => s.selectedTests);
  const cfg            = LEVEL_CONFIGS[level];
  const { showConfirm, confirmLeave, cancelLeave } = useConfirmLeave();

  const [phase,     setPhase]     = useState<Phase>("guide");
  const [next,      setNext]      = useState(1);
  const [errors,    setErrors]    = useState(0);
  const [wrongMsg,  setWrongMsg]  = useState("");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [positions] = useState(() => buildPositions(cfg.trailMax, cfg.trailCols, cfg.trailRows));

  const startTimeRef = useRef<number>(0);
  const msgTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (msgTimerRef.current) clearTimeout(msgTimerRef.current); }, []);

  const startTest = useCallback(() => {
    speak(`1번부터 ${cfg.trailMax}번까지 순서대로 눌러주세요`);
    startTimeRef.current = Date.now();
    setPhase("test");
  }, [speak, cfg.trailMax]);

  const handleTap = useCallback((num: number) => {
    if (num === next) {
      if (next === cfg.trailMax) {
        const elapsed = Date.now() - startTimeRef.current;
        setElapsedMs(elapsed);
        setTrailResult(elapsed, errors);
        setPhase("done");
        speak(`숫자 연결 완료! ${(elapsed / 1000).toFixed(1)}초 걸렸습니다.`);
        setTimeout(() => router.push(getNextTestPath("trail", selectedTests)), 3000);
      } else {
        setNext(num + 1);
      }
    } else {
      setErrors((e) => e + 1);
      setWrongMsg(`${next}번을 먼저 눌러주세요`);
      speak(`${next}번을 먼저 눌러주세요`);
      if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
      msgTimerRef.current = setTimeout(() => setWrongMsg(""), 1800);
    }
  }, [next, errors, cfg.trailMax, setTrailResult, speak, router, selectedTests]);

  const numSize = cfg.trailMax <= 8 ? "1.625rem" : cfg.trailMax <= 10 ? "1.5rem" : "1.125rem";
  const btnSize = cfg.trailMax <= 10 ? "70px" : "58px";
  const speed   = speedLabel(elapsedMs, cfg.trailMax);

  return (
    <div className="flex min-h-dvh flex-col">
      {showConfirm && <LeaveConfirmModal onConfirm={confirmLeave} onCancel={cancelLeave} />}

      <div className="sticky top-0 z-10 px-4 py-3" style={{ backgroundColor: "var(--color-senior-bg)" }}>
        <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
          ② 주의력 검사 (숫자 연결) &nbsp;|&nbsp; 2단계
        </p>
        {phase === "test" && (
          <p style={{ fontSize: "1.125rem", fontWeight: 700, marginTop: "0.25rem" }}>
            다음 숫자:{" "}
            <span style={{ color: "var(--color-senior-primary)", fontSize: "1.5rem" }}>{next}</span>
            &nbsp;&nbsp;오탭: {errors}회
          </p>
        )}
      </div>

      {phase === "guide" && (
        <div className="flex flex-1 flex-col justify-between px-6 py-4">
          <SpeechGuide text={`화면에 흩어진 숫자 1번부터 ${cfg.trailMax}번까지 순서대로 눌러주세요. 빠를수록 좋습니다.`} />
          <button onClick={startTest} className="btn-senior btn-senior-primary w-full" style={{ fontSize: "1.375rem" }}>
            시작하기
          </button>
        </div>
      )}

      {phase === "test" && (
        <div className="relative flex-1" style={{ backgroundColor: "#0f1923" }}>
          {wrongMsg && (
            <div
              className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-xl px-5 py-3 text-center"
              style={{ backgroundColor: "var(--color-senior-danger)", fontSize: "1.125rem", fontWeight: 700, whiteSpace: "nowrap" }}
            >
              {wrongMsg}
            </div>
          )}

          {positions.map((pos, i) => {
            const num       = i + 1;
            const done      = num < next;
            const isCurrent = num === next;
            return (
              <button
                key={num}
                onClick={() => handleTap(num)}
                disabled={done}
                aria-label={`${num}번`}
                style={{
                  position:        "absolute",
                  left:            `${pos.x}%`,
                  top:             `${pos.y}%`,
                  transform:       "translate(-50%, -50%)",
                  width:           btnSize,
                  height:          btnSize,
                  borderRadius:    "50%",
                  border:          isCurrent ? "4px solid #fff" : "2px solid rgba(255,255,255,0.2)",
                  backgroundColor: done
                    ? "rgba(76,175,80,0.4)"
                    : isCurrent
                    ? "var(--color-senior-primary)"
                    : "var(--color-senior-surface)",
                  fontSize:        numSize,
                  fontWeight:      900,
                  color:           done ? "#4caf50" : isCurrent ? "#1a1a2e" : "#fff",
                  cursor:          done ? "default" : "pointer",
                  boxShadow:       isCurrent ? "0 0 20px rgba(245,197,24,0.8)" : "none",
                  transition:      "all 0.15s",
                }}
              >
                {num}
              </button>
            );
          })}
        </div>
      )}

      {phase === "done" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
          <span style={{ fontSize: "4rem" }}>✅</span>
          <p style={{ fontSize: "1.75rem", fontWeight: 700 }}>숫자 연결 완료!</p>

          {/* 속도 결과 카드 */}
          <div
            className="card-senior w-full text-center"
            style={{ padding: "1.5rem" }}
          >
            <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", marginBottom: "0.5rem" }}>
              완료 시간
            </p>
            <p style={{ fontSize: "3rem", fontWeight: 900, color: "var(--color-senior-primary)", lineHeight: 1 }}>
              {(elapsedMs / 1000).toFixed(2)}
              <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>초</span>
            </p>
            <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", margin: "0.25rem 0 0.75rem" }}>
              ({elapsedMs.toLocaleString()} ms)
            </p>
            <p style={{ fontSize: "1.375rem", fontWeight: 700, color: speed.color }}>
              {speed.text}
            </p>
          </div>

          <p style={{ fontSize: "1.125rem", color: "var(--color-senior-text-muted)" }}>
            오탭: {errors}회
          </p>
        </div>
      )}
    </div>
  );
}
