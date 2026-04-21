"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SpeechGuide } from "@/components/SpeechGuide";
import { useTestStore } from "@/lib/useTestStore";
import { useLevelStore, type Level } from "@/lib/useLevelStore";
import { LEVEL_CONFIGS } from "@/lib/levelConfig";
import { showBottomBanner, removeBanner } from "@/lib/useAdMob";

const TESTS = [
  { icon: "🧠", name: "기억력 검사",       step: "1단계" },
  { icon: "🔢", name: "주의력 검사",       step: "2단계" },
  { icon: "🚦", name: "신호 반응 검사",    step: "3단계" },
  { icon: "🪧", name: "표지판 식별 검사",  step: "4단계" },
  { icon: "⚠️", name: "위험 지각 검사",   step: "5단계" },
];

const LEVELS: Level[] = [1, 2, 3];

export default function TestHubPage() {
  const router    = useRouter();
  const reset     = useTestStore((s) => s.reset);
  const level     = useLevelStore((s) => s.level);
  const setLevel  = useLevelStore((s) => s.setLevel);
  const cfg       = LEVEL_CONFIGS[level];

  useEffect(() => { reset(); }, [reset]);

  useEffect(() => {
    showBottomBanner();
    return () => { removeBanner(); };
  }, []);

  const testDescs = [
    `단어 ${cfg.memoryTargets}개를 ${cfg.memorySec}초간 기억한 뒤 회상해요`,
    `숫자 1~${cfg.trailMax}을 순서대로 눌러요`,
    `초록불에만 빠르게 반응해요 (${cfg.reactionRounds}회)`,
    `표지판 문제 ${cfg.signRounds}개 (${cfg.signTypes.length}가지 유형)`,
    `도로 위 위험 요소를 빠르게 눌러요 (${cfg.hazardRounds}회)`,
  ];

  return (
    <main className="flex min-h-dvh flex-col px-6 py-4">
      <SpeechGuide text="총 5가지 검사를 순서대로 진행합니다. 난이도를 선택한 뒤 시작 버튼을 눌러주세요." />

      <h1 className="mb-5 text-center font-black" style={{ fontSize: "1.75rem", color: "var(--color-senior-primary)" }}>
        운전 적성 자가진단
      </h1>

      {/* 레벨 선택 */}
      <div className="mb-5">
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-senior-text-muted)", marginBottom: "0.75rem" }}>
          난이도 선택
        </p>
        <div className="grid grid-cols-3 gap-3">
          {LEVELS.map((lv) => {
            const c = LEVEL_CONFIGS[lv];
            const selected = lv === level;
            return (
              <button
                key={lv}
                onClick={() => setLevel(lv)}
                style={{
                  display:         "flex",
                  flexDirection:   "column",
                  alignItems:      "center",
                  gap:             "0.25rem",
                  padding:         "0.875rem 0.5rem",
                  borderRadius:    "0.75rem",
                  border:          `3px solid ${selected ? "var(--color-senior-primary)" : "var(--color-senior-border)"}`,
                  backgroundColor: selected ? "rgba(245,197,24,0.15)" : "var(--color-senior-surface)",
                  cursor:          "pointer",
                  transition:      "all 0.15s",
                }}
              >
                <span style={{ fontSize: "1.75rem" }}>{c.emoji}</span>
                <span style={{ fontSize: "1.125rem", fontWeight: 900, color: selected ? "var(--color-senior-primary)" : "var(--color-senior-text)" }}>
                  {c.label}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-senior-text-muted)", textAlign: "center", lineHeight: 1.3 }}>
                  {c.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => router.push("/test/memory")}
        className="btn-senior btn-senior-primary w-full mb-5"
        style={{ fontSize: "1.375rem" }}
      >
        전체 검사 시작하기
      </button>

      <div className="mb-6 space-y-3">
        {TESTS.map((t, i) => (
          <div key={i} className="card-senior flex items-center gap-4">
            <span className="text-3xl">{t.icon}</span>
            <div className="flex-1">
              <p className="font-bold" style={{ fontSize: "1.125rem" }}>{t.name}</p>
              <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>{testDescs[i]}</p>
            </div>
            <span className="shrink-0 rounded-full px-3 py-1 text-sm font-bold"
              style={{ backgroundColor: "var(--color-senior-border)", color: "var(--color-senior-primary)" }}>
              {t.step}
            </span>
          </div>
        ))}
      </div>

      <Link href="/" className="mt-2 block text-center" style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
        ← 홈으로 돌아가기
      </Link>
    </main>
  );
}
