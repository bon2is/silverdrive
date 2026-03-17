"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpeechGuide } from "@/components/SpeechGuide";
import { TestProgressBar } from "@/components/TestProgressBar";
import { SignIcon } from "@/components/SignIcon";
import { useTestStore } from "@/lib/useTestStore";
import { useSpeech } from "@/lib/useSpeech";
import { SIGNS, buildRound, buildQuestions } from "@/lib/signs";

const TOTAL_ROUNDS = 5;

type Phase = "guide" | "question" | "feedback";

export default function SignsTestPage() {
  const router       = useRouter();
  const { speak }    = useSpeech();
  const addSignAnswer = useTestStore((s) => s.addSignAnswer);

  const questions = useMemo(() => buildQuestions(), []);

  const [round,    setRound]    = useState(0);
  const [phase,    setPhase]    = useState<Phase>("guide");
  const [choices,  setChoices]  = useState(() => buildRound(questions[0]));
  const [selected, setSelected] = useState<string | null>(null);
  const [correct,  setCorrect]  = useState(false);
  const [locked,   setLocked]   = useState(false); // 더블탭 방지

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const correctId   = questions[round];
  const correctName = SIGNS.find((s) => s.id === correctId)?.name ?? "";

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const startRound = useCallback(
    (r: number) => {
      setPhase("question");
      setSelected(null);
      setLocked(false);
      setChoices(buildRound(questions[r]));
      const name = SIGNS.find((s) => s.id === questions[r])?.name ?? "";
      speak(`${name} 표지판을 찾아 눌러주세요`);
    },
    [questions, speak]
  );

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleChoice = useCallback(
    (id: string) => {
      if (locked || phase !== "question") return;
      setLocked(true);
      const isCorrect = id === correctId;
      setSelected(id);
      setCorrect(isCorrect);
      addSignAnswer(isCorrect);
      setPhase("feedback");
      speak(isCorrect ? "정답입니다!" : `정답은 ${correctName}입니다.`);

      const next = round + 1;
      timerRef.current = setTimeout(() => {
        if (next >= TOTAL_ROUNDS) {
          router.push("/test/hazard");
        } else {
          setRound(next);
          startRound(next);
        }
      }, 1800);
    },
    [locked, phase, correctId, correctName, addSignAnswer, speak, round, router, startRound]
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <TestProgressBar current={round} total={TOTAL_ROUNDS} label="표지판 식별 테스트" />

      {phase === "guide" && (
        <div className="flex flex-1 flex-col justify-between px-6 py-4">
          <SpeechGuide
            text="제시된 표지판 이름을 잘 듣고, 아래 4개 보기 중 맞는 표지판을 눌러주세요. 총 5문제입니다."
          />
          <button
            onClick={() => startRound(0)}
            className="btn-senior btn-senior-primary w-full"
            style={{ fontSize: "1.375rem" }}
          >
            시작하기
          </button>
        </div>
      )}

      {(phase === "question" || phase === "feedback") && (
        <div className="flex flex-1 flex-col px-4 py-4">
          {/* 문제 */}
          <div
            className="card-senior mb-6 text-center"
            style={{ minHeight: "5rem" }}
          >
            <p style={{ fontSize: "1.125rem", color: "var(--color-senior-text-muted)", marginBottom: "0.25rem" }}>
              다음 표지판을 찾아주세요
            </p>
            <p style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--color-senior-primary)" }}>
              {correctName}
            </p>
          </div>

          {/* 2×2 보기 그리드 */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {choices.map((sign) => {
              let borderColor = "var(--color-senior-border)";
              if (phase === "feedback") {
                if (sign.id === correctId) borderColor = "var(--color-senior-success)";
                else if (sign.id === selected) borderColor = "var(--color-senior-danger)";
              }
              return (
                <button
                  key={sign.id}
                  onClick={() => handleChoice(sign.id)}
                  disabled={locked}
                  aria-label={sign.name}
                  style={{
                    display:         "flex",
                    flexDirection:   "column",
                    alignItems:      "center",
                    justifyContent:  "center",
                    gap:             "0.75rem",
                    padding:         "1rem",
                    borderRadius:    "0.75rem",
                    border:          `3px solid ${borderColor}`,
                    backgroundColor: "var(--color-senior-surface)",
                    cursor:          locked ? "default" : "pointer",
                    transition:      "border-color 0.2s",
                  }}
                >
                  <SignIcon id={sign.id} size={90} />
                  <span style={{ fontSize: "1.125rem", fontWeight: 700 }}>{sign.name}</span>
                </button>
              );
            })}
          </div>

          {/* 피드백 */}
          {phase === "feedback" && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <span style={{ fontSize: "2rem" }}>{correct ? "✅" : "❌"}</span>
              <p style={{ fontSize: "1.375rem", fontWeight: 700 }}>
                {correct ? "정답입니다!" : `정답은 "${correctName}"`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
