"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpeechGuide } from "@/components/SpeechGuide";
import { useSpeech } from "@/lib/useSpeech";
import { useTestStore } from "@/lib/useTestStore";
import { buildMemoryRound } from "@/lib/memory";

const MEMORIZE_SEC = 10;

type Phase = "guide" | "memorize" | "recall" | "done";

export default function MemoryTestPage() {
  const router         = useRouter();
  const { speak }      = useSpeech();
  const setMemoryScore = useTestStore((s) => s.setMemoryScore);

  const round    = useMemo(() => buildMemoryRound(), []);
  const [phase,  setPhase]    = useState<Phase>("guide");
  const [elapsed, setElapsed] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 기억하기 카운트다운
  const startMemorize = useCallback(() => {
    setPhase("memorize");
    speak("화면의 단어 6개를 잘 기억해주세요");
    const startAt = Date.now();
    intervalRef.current = setInterval(() => {
      const sec = Math.floor((Date.now() - startAt) / 1000);
      setElapsed(sec);
      if (sec >= MEMORIZE_SEC) {
        clearInterval(intervalRef.current!);
        setPhase("recall");
        speak("아까 본 단어를 모두 찾아 눌러주세요");
      }
    }, 500);
  }, [speak]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const toggleWord = (word: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(word) ? next.delete(word) : next.add(word);
      return next;
    });
  };

  const handleConfirm = useCallback(() => {
    const score = round.targets.filter((w) => selected.has(w)).length;
    setMemoryScore(score);
    setPhase("done");
    speak(`${score}개 맞추셨습니다. 잘 하셨어요!`);
    setTimeout(() => router.push("/test/trail"), 2000);
  }, [round.targets, selected, setMemoryScore, speak, router]);

  const remaining = Math.max(MEMORIZE_SEC - elapsed, 0);

  return (
    <div className="flex min-h-dvh flex-col px-6 py-4">
      {/* 헤더 */}
      <div
        className="sticky top-0 z-10 py-3"
        style={{ backgroundColor: "var(--color-senior-bg)" }}
      >
        <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
          ① 기억력 검사 &nbsp;|&nbsp; 총 5단계 중 1단계
        </p>
      </div>

      {/* 안내 */}
      {phase === "guide" && (
        <div className="flex flex-1 flex-col justify-between py-4">
          <SpeechGuide text="화면에 나타나는 단어 6개를 10초 동안 기억해주세요. 이후 기억나는 단어를 모두 선택합니다." />
          <button onClick={startMemorize} className="btn-senior btn-senior-primary w-full" style={{ fontSize: "1.375rem" }}>
            시작하기
          </button>
        </div>
      )}

      {/* 기억하기 */}
      {phase === "memorize" && (
        <div className="flex flex-1 flex-col py-4">
          <div className="mb-4 flex items-center justify-between">
            <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>단어를 기억하세요</p>
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: remaining <= 3 ? "var(--color-senior-danger)" : "var(--color-senior-primary)", transition: "background-color 0.5s" }}
            >
              <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a1a2e" }}>{remaining}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {round.targets.map((word) => (
              <div
                key={word}
                className="card-senior flex items-center justify-center"
                style={{ fontSize: "1.75rem", fontWeight: 900, minHeight: "80px" }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 회상하기 */}
      {phase === "recall" && (
        <div className="flex flex-1 flex-col py-4">
          <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            아까 본 단어를 모두 선택하세요
          </p>
          <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", marginBottom: "1rem" }}>
            선택한 단어: {selected.size}개
          </p>
          <div className="grid grid-cols-3 gap-3 flex-1">
            {round.choices.map((word) => {
              const isSelected = selected.has(word);
              return (
                <button
                  key={word}
                  onClick={() => toggleWord(word)}
                  style={{
                    padding:         "0.75rem 0.5rem",
                    borderRadius:    "0.75rem",
                    border:          `3px solid ${isSelected ? "var(--color-senior-primary)" : "var(--color-senior-border)"}`,
                    backgroundColor: isSelected ? "rgba(245,197,24,0.15)" : "var(--color-senior-surface)",
                    fontSize:        "1.25rem",
                    fontWeight:      700,
                    cursor:          "pointer",
                    minHeight:       "64px",
                    transition:      "all 0.15s",
                  }}
                >
                  {word}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleConfirm}
            className="btn-senior btn-senior-primary mt-4 w-full"
            style={{ fontSize: "1.25rem" }}
          >
            확인 ({selected.size}개 선택)
          </button>
        </div>
      )}

      {/* 완료 */}
      {phase === "done" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <span style={{ fontSize: "4rem" }}>✅</span>
          <p style={{ fontSize: "1.75rem", fontWeight: 700 }}>기억력 검사 완료!</p>
          <p style={{ fontSize: "1.25rem", color: "var(--color-senior-text-muted)" }}>
            {round.targets.filter((w) => selected.has(w)).length} / 6개 기억
          </p>
        </div>
      )}
    </div>
  );
}
