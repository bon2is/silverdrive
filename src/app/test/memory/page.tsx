"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpeechGuide } from "@/components/SpeechGuide";
import { useSpeech } from "@/lib/useSpeech";
import { useTestStore } from "@/lib/useTestStore";
import { useLevelStore } from "@/lib/useLevelStore";
import { LEVEL_CONFIGS } from "@/lib/levelConfig";
import { buildMemoryRound } from "@/lib/memory";
import { useConfirmLeave } from "@/lib/useConfirmLeave";
import { LeaveConfirmModal } from "@/components/LeaveConfirmModal";

type Phase = "guide" | "memorize" | "recall" | "done";

export default function MemoryTestPage() {
  const router         = useRouter();
  const { showConfirm, confirmLeave, cancelLeave } = useConfirmLeave();
  const { speak }      = useSpeech();
  const setMemoryScore = useTestStore((s) => s.setMemoryScore);
  const level          = useLevelStore((s) => s.level);
  const cfg            = LEVEL_CONFIGS[level];

  const round      = useMemo(() => buildMemoryRound(cfg.memoryTargets, cfg.memoryChoices), [cfg.memoryTargets, cfg.memoryChoices]);
  const [phase,    setPhase]    = useState<Phase>("guide");
  const [elapsed,  setElapsed]  = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startMemorize = useCallback(() => {
    setPhase("memorize");
    speak(`화면의 단어 ${cfg.memoryTargets}개를 잘 기억해주세요`);
    const startAt = Date.now();
    intervalRef.current = setInterval(() => {
      const sec = Math.floor((Date.now() - startAt) / 1000);
      setElapsed(sec);
      if (sec >= cfg.memorySec) {
        clearInterval(intervalRef.current!);
        setPhase("recall");
        speak("아까 본 단어를 모두 찾아 눌러주세요");
      }
    }, 500);
  }, [speak, cfg.memoryTargets, cfg.memorySec]);

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
    setMemoryScore(score, cfg.memoryTargets);
    setPhase("done");
    speak(`${score}개 맞추셨습니다. 잘 하셨어요!`);
    setTimeout(() => router.push("/test/trail"), 2000);
  }, [round.targets, selected, setMemoryScore, cfg.memoryTargets, speak, router]);

  const remaining = Math.max(cfg.memorySec - elapsed, 0);

  // 회상 그리드 열 수: 선택지 수에 따라 조정
  const recallCols = cfg.memoryChoices <= 8 ? 2 : cfg.memoryChoices <= 12 ? 3 : 4;

  return (
    <div className="flex min-h-dvh flex-col px-6 py-4">
      {showConfirm && <LeaveConfirmModal onConfirm={confirmLeave} onCancel={cancelLeave} />}
      <div
        className="sticky top-0 z-10 py-3"
        style={{ backgroundColor: "var(--color-senior-bg)" }}
      >
        <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
          ① 기억력 검사 &nbsp;|&nbsp; 총 5단계 중 1단계
        </p>
      </div>

      {phase === "guide" && (
        <div className="flex flex-1 flex-col justify-between py-4">
          <SpeechGuide
            text={`화면에 나타나는 단어 ${cfg.memoryTargets}개를 ${cfg.memorySec}초 동안 기억해주세요. 이후 기억나는 단어를 모두 선택합니다.`}
          />
          <button onClick={startMemorize} className="btn-senior btn-senior-primary w-full" style={{ fontSize: "1.375rem" }}>
            시작하기
          </button>
        </div>
      )}

      {phase === "memorize" && (
        <div className="flex flex-1 flex-col py-4">
          <div className="mb-4 flex items-center justify-between">
            <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>단어를 기억하세요</p>
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: remaining <= 3 ? "var(--color-senior-danger)" : "var(--color-senior-primary)",
                transition: "background-color 0.5s",
              }}
            >
              <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a1a2e" }}>{remaining}</span>
            </div>
          </div>
          <div
            className="grid gap-3 flex-1"
            style={{ gridTemplateColumns: `repeat(${recallCols}, 1fr)` }}
          >
            {round.targets.map((word) => (
              <div
                key={word}
                className="card-senior flex items-center justify-center"
                style={{ fontSize: "1.625rem", fontWeight: 900, minHeight: "72px" }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === "recall" && (
        <div className="flex flex-1 flex-col py-4">
          <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            아까 본 단어를 모두 선택하세요
          </p>
          <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", marginBottom: "1rem" }}>
            선택한 단어: {selected.size}개 / 정답: {cfg.memoryTargets}개
          </p>
          <div
            className="grid gap-3 flex-1"
            style={{ gridTemplateColumns: `repeat(${recallCols}, 1fr)` }}
          >
            {round.choices.map((word) => {
              const isSelected = selected.has(word);
              return (
                <button
                  key={word}
                  onClick={() => toggleWord(word)}
                  style={{
                    padding:         "0.625rem 0.375rem",
                    borderRadius:    "0.75rem",
                    border:          `3px solid ${isSelected ? "var(--color-senior-primary)" : "var(--color-senior-border)"}`,
                    backgroundColor: isSelected ? "rgba(245,197,24,0.15)" : "var(--color-senior-surface)",
                    fontSize:        cfg.memoryChoices > 12 ? "1rem" : "1.125rem",
                    fontWeight:      700,
                    cursor:          "pointer",
                    minHeight:       "56px",
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

      {phase === "done" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <span style={{ fontSize: "4rem" }}>✅</span>
          <p style={{ fontSize: "1.75rem", fontWeight: 700 }}>기억력 검사 완료!</p>
          <p style={{ fontSize: "1.25rem", color: "var(--color-senior-text-muted)" }}>
            {round.targets.filter((w) => selected.has(w)).length} / {cfg.memoryTargets}개 기억
          </p>
        </div>
      )}
    </div>
  );
}
