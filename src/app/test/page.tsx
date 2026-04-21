"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SpeechGuide } from "@/components/SpeechGuide";
import { useTestStore } from "@/lib/useTestStore";
import { useLevelStore, type Level } from "@/lib/useLevelStore";
import { LEVEL_CONFIGS } from "@/lib/levelConfig";
import { showBottomBanner } from "@/lib/useAdMob";
import { ALL_TESTS, type TestKey, getFirstTestPath } from "@/lib/testNavigation";

const TEST_META: Record<TestKey, { icon: string; name: string; step: string }> = {
  memory:   { icon: "🧠", name: "기억력 검사",      step: "1단계" },
  trail:    { icon: "🔢", name: "주의력 검사",      step: "2단계" },
  reaction: { icon: "🚦", name: "신호 반응 검사",   step: "3단계" },
  signs:    { icon: "🪧", name: "표지판 식별 검사", step: "4단계" },
  hazard:   { icon: "⚠️", name: "위험 지각 검사",  step: "5단계" },
};

const LEVELS: Level[] = [1, 2, 3];

export default function TestHubPage() {
  const router          = useRouter();
  const reset           = useTestStore((s) => s.reset);
  const level           = useLevelStore((s) => s.level);
  const setLevel        = useLevelStore((s) => s.setLevel);
  const selectedTests   = useLevelStore((s) => s.selectedTests);
  const toggleTest      = useLevelStore((s) => s.toggleTest);
  const selectAll       = useLevelStore((s) => s.selectAll);
  const cfg             = LEVEL_CONFIGS[level];
  const allSelected     = selectedTests.length === ALL_TESTS.length;

  useEffect(() => { reset(); }, [reset]);

  // 배너를 show만 하고 cleanup에서 remove하지 않음 → 테스트 진행 중 배너 지속
  useEffect(() => { showBottomBanner(); }, []);

  const testDescs: Record<TestKey, string> = {
    memory:   `단어 ${cfg.memoryTargets}개를 ${cfg.memorySec}초간 기억한 뒤 회상해요`,
    trail:    `숫자 1~${cfg.trailMax}을 순서대로 눌러요`,
    reaction: `초록불에만 빠르게 반응해요 (${cfg.reactionRounds}회)`,
    signs:    `표지판 문제 ${cfg.signRounds}개 (${cfg.signTypes.length}가지 유형)`,
    hazard:   `도로 위 위험 요소를 빠르게 눌러요 (${cfg.hazardRounds}회)`,
  };

  function handleStart() {
    router.push(getFirstTestPath(selectedTests));
  }

  return (
    <main className="flex min-h-dvh flex-col px-6 py-4">
      <SpeechGuide text="검사를 선택하고 시작 버튼을 눌러주세요." />

      <h1 className="mb-5 text-center font-black" style={{ fontSize: "1.75rem", color: "var(--color-senior-primary)" }}>
        운전 적성 자가진단
      </h1>

      {/* 난이도 선택 */}
      <div className="mb-5">
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-senior-text-muted)", marginBottom: "0.75rem" }}>
          난이도 선택
        </p>
        <div className="grid grid-cols-3 gap-3">
          {LEVELS.map((lv) => {
            const c = LEVEL_CONFIGS[lv];
            const sel = lv === level;
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
                  border:          `3px solid ${sel ? "var(--color-senior-primary)" : "var(--color-senior-border)"}`,
                  backgroundColor: sel ? "rgba(245,197,24,0.15)" : "var(--color-senior-surface)",
                  cursor:          "pointer",
                  transition:      "all 0.15s",
                }}
              >
                <span style={{ fontSize: "1.75rem" }}>{c.emoji}</span>
                <span style={{ fontSize: "1.125rem", fontWeight: 900, color: sel ? "var(--color-senior-primary)" : "var(--color-senior-text)" }}>
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

      {/* 검사 선택 */}
      <div className="mb-5">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-senior-text-muted)" }}>
            검사 선택 <span style={{ fontWeight: 400, fontSize: "0.875rem" }}>({selectedTests.length}/5)</span>
          </p>
          <button
            onClick={allSelected ? undefined : selectAll}
            style={{
              fontSize:   "0.875rem",
              fontWeight: 700,
              color:      allSelected ? "var(--color-senior-text-muted)" : "var(--color-senior-primary)",
              background: "none",
              border:     "none",
              cursor:     allSelected ? "default" : "pointer",
              padding:    "0.25rem 0",
            }}
          >
            {allSelected ? "전체 선택됨" : "전체 선택"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {ALL_TESTS.map((key) => {
            const t   = TEST_META[key];
            const on  = selectedTests.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleTest(key)}
                style={{
                  display:         "flex",
                  alignItems:      "center",
                  gap:             "0.875rem",
                  padding:         "0.875rem 1rem",
                  borderRadius:    "0.875rem",
                  border:          `2px solid ${on ? "var(--color-senior-primary)" : "var(--color-senior-border)"}`,
                  backgroundColor: on ? "rgba(245,197,24,0.12)" : "var(--color-senior-surface)",
                  cursor:          "pointer",
                  textAlign:       "left",
                  transition:      "all 0.15s",
                }}
              >
                {/* 체크 표시 */}
                <span style={{
                  width:           "26px",
                  height:          "26px",
                  borderRadius:    "50%",
                  border:          `2px solid ${on ? "var(--color-senior-primary)" : "var(--color-senior-border)"}`,
                  backgroundColor: on ? "var(--color-senior-primary)" : "transparent",
                  flexShrink:      0,
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  fontSize:        "0.875rem",
                  color:           "#1a1a2e",
                  fontWeight:      900,
                }}>
                  {on ? "✓" : ""}
                </span>
                <span style={{ fontSize: "1.75rem", flexShrink: 0 }}>{t.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "1.0625rem", fontWeight: 700, color: on ? "var(--color-senior-text)" : "var(--color-senior-text-muted)" }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-senior-text-muted)", lineHeight: 1.4 }}>
                    {testDescs[key]}
                  </p>
                </div>
                <span style={{
                  flexShrink:      0,
                  borderRadius:    "999px",
                  padding:         "0.2rem 0.625rem",
                  fontSize:        "0.8125rem",
                  fontWeight:      700,
                  backgroundColor: on ? "var(--color-senior-border)" : "transparent",
                  color:           "var(--color-senior-primary)",
                  border:          on ? "none" : `1px solid var(--color-senior-border)`,
                }}>
                  {t.step}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={handleStart}
        disabled={selectedTests.length === 0}
        className="btn-senior btn-senior-primary w-full mb-5"
        style={{ fontSize: "1.375rem", opacity: selectedTests.length === 0 ? 0.5 : 1 }}
      >
        {selectedTests.length === ALL_TESTS.length
          ? "전체 검사 시작하기"
          : `선택한 ${selectedTests.length}개 검사 시작하기`}
      </button>

      <Link href="/" className="mt-2 block text-center" style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
        ← 홈으로 돌아가기
      </Link>
    </main>
  );
}
