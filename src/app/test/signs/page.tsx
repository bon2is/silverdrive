"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpeechGuide } from "@/components/SpeechGuide";
import { TestProgressBar } from "@/components/TestProgressBar";
import { SignIcon } from "@/components/SignIcon";
import { useTestStore } from "@/lib/useTestStore";
import { useSpeech } from "@/lib/useSpeech";
import { useLevelStore } from "@/lib/useLevelStore";
import { LEVEL_CONFIGS } from "@/lib/levelConfig";
import { SIGNS, buildRound, buildQuestions } from "@/lib/signs";
import { useConfirmLeave } from "@/lib/useConfirmLeave";
import { LeaveConfirmModal } from "@/components/LeaveConfirmModal";

type Phase = "guide" | "question" | "feedback";

export default function SignsTestPage() {
  const router         = useRouter();
  const { speak }      = useSpeech();
  const { showConfirm, confirmLeave, cancelLeave } = useConfirmLeave();
  const addSignAnswer  = useTestStore((s) => s.addSignAnswer);
  const level          = useLevelStore((s) => s.level);
  const cfg            = LEVEL_CONFIGS[level];

  const questions = useMemo(
    () => buildQuestions(cfg.signRounds, cfg.signTypes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [round,    setRound]    = useState(0);
  const [phase,    setPhase]    = useState<Phase>("guide");
  const [choices,  setChoices]  = useState(() => buildRound(questions[0].correctId));
  const [selected, setSelected] = useState<string | null>(null);
  const [correct,  setCorrect]  = useState(false);
  const [locked,   setLocked]   = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  useEffect(() => { return () => clearTimer(); }, []);

  const startRound = useCallback(
    (r: number) => {
      const q    = questions[r];
      const sign = SIGNS.find((s) => s.id === q.correctId)!;
      setPhase("question");
      setSelected(null);
      setLocked(false);
      setChoices(buildRound(q.correctId));

      if (q.type === "name-to-icon") {
        speak(`${sign.name} 표지판을 찾아 눌러주세요`);
      } else if (q.type === "icon-to-name") {
        speak("이 표지판의 이름은 무엇인가요?");
      } else {
        speak(sign.situation);
      }
    },
    [questions, speak]
  );

  const handleChoice = useCallback(
    (id: string) => {
      if (locked || phase !== "question") return;
      setLocked(true);
      const correctId   = questions[round].correctId;
      const correctName = SIGNS.find((s) => s.id === correctId)?.name ?? "";
      const isCorrect   = id === correctId;
      setSelected(id);
      setCorrect(isCorrect);
      addSignAnswer(isCorrect);
      setPhase("feedback");
      speak(isCorrect ? "정답입니다!" : `정답은 ${correctName}입니다.`);

      const next = round + 1;
      timerRef.current = setTimeout(() => {
        if (next >= questions.length) {
          router.push("/test/hazard");
        } else {
          setRound(next);
          startRound(next);
        }
      }, 1200);
    },
    [locked, phase, questions, round, addSignAnswer, speak, router, startRound]
  );

  const q           = questions[round];
  const correctId   = q.correctId;
  const correctSign = SIGNS.find((s) => s.id === correctId)!;

  return (
    <div className="flex min-h-dvh flex-col">
      {showConfirm && <LeaveConfirmModal onConfirm={confirmLeave} onCancel={cancelLeave} />}
      <TestProgressBar current={round} total={questions.length} label="표지판 식별 테스트" />

      {phase === "guide" && (
        <div className="flex flex-1 flex-col justify-between px-6 py-4">
          <SpeechGuide
            text={
              cfg.signTypes.length === 1
                ? `제시된 표지판 이름을 듣고 맞는 표지판을 눌러주세요. 총 ${questions.length}문제입니다.`
                : `표지판 이름 찾기, 이름 맞추기${cfg.signTypes.includes("situation") ? ", 상황 설명 찾기" : ""} 등 다양한 유형의 문제 ${questions.length}개가 나옵니다.`
            }
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

          {/* 문제 유형 뱃지 */}
          <div className="mb-2 flex items-center gap-2">
            <span
              style={{
                fontSize:        "0.75rem",
                fontWeight:      700,
                padding:         "0.2rem 0.6rem",
                borderRadius:    "999px",
                backgroundColor: "var(--color-senior-border)",
                color:           "var(--color-senior-primary)",
              }}
            >
              {q.type === "name-to-icon" ? "이름 → 표지판 찾기"
               : q.type === "icon-to-name" ? "표지판 → 이름 찾기"
               : "상황 설명 → 표지판 찾기"}
            </span>
          </div>

          {/* 문제 영역 */}
          {q.type === "icon-to-name" ? (
            <div
              className="card-senior mb-4 flex flex-col items-center gap-3"
              style={{ minHeight: "8rem" }}
            >
              <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
                이 표지판의 이름은 무엇인가요?
              </p>
              <SignIcon id={correctId} size={110} />
            </div>
          ) : q.type === "situation" ? (
            <div
              className="card-senior mb-4"
              style={{ minHeight: "6rem" }}
            >
              <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", marginBottom: "0.5rem" }}>
                다음 설명에 맞는 표지판은?
              </p>
              <p style={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.4 }}>
                {correctSign.situation}
              </p>
            </div>
          ) : (
            <div
              className="card-senior mb-4 text-center"
              style={{ minHeight: "5rem" }}
            >
              <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", marginBottom: "0.25rem" }}>
                다음 표지판을 찾아주세요
              </p>
              <p style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--color-senior-primary)" }}>
                {correctSign.name}
              </p>
            </div>
          )}

          {/* 보기 그리드 */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {choices.map((sign) => {
              let borderColor = "var(--color-senior-border)";
              if (phase === "feedback") {
                if (sign.id === correctId)      borderColor = "var(--color-senior-success)";
                else if (sign.id === selected)  borderColor = "var(--color-senior-danger)";
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
                    minHeight:       q.type === "icon-to-name" ? "5rem" : "auto",
                  }}
                >
                  {/* icon-to-name: 이름만 표시 */}
                  {q.type === "icon-to-name" ? (
                    <span style={{ fontSize: "1.375rem", fontWeight: 700 }}>{sign.name}</span>
                  ) : (
                    <>
                      <SignIcon id={sign.id} size={80} />
                      <span style={{ fontSize: "1rem", fontWeight: 700 }}>{sign.name}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* 피드백 */}
          {phase === "feedback" && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <span style={{ fontSize: "2rem" }}>{correct ? "✅" : "❌"}</span>
              <p style={{ fontSize: "1.375rem", fontWeight: 700 }}>
                {correct ? "정답입니다!" : `정답은 "${correctSign.name}"`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
