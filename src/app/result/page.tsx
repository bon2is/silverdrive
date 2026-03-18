"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTestStore } from "@/lib/useTestStore";
import { calcScore } from "@/lib/gradeCalculator";
import { GradeBadge } from "@/components/GradeBadge";
import { ScoreCard } from "@/components/ScoreCard";
import { ShareButton } from "@/components/ShareButton";
import { AdBanner } from "@/components/AdBanner";
import { useSpeech } from "@/lib/useSpeech";

const GRADE_LABEL: Record<string, string> = {
  safe:    "안전",
  caution: "주의",
  danger:  "노력 필요",
};

function fmtMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}초` : `${ms}ms`;
}

export default function ResultPage() {
  const results = useTestStore((s) => s.results);
  const { speak } = useSpeech();
  const score = calcScore(results);

  // 평균 반응속도 계산 (표시용)
  const avgReaction = results.reactionTimes.length > 0
    ? Math.round(results.reactionTimes.reduce((a, b) => a + b, 0) / results.reactionTimes.length)
    : 0;

  useEffect(() => {
    speak(`검사 결과입니다. 종합 ${score.total}점, ${GRADE_LABEL[score.grade]} 등급입니다.`);
  }, [score.grade, score.total, speak]);

  return (
    <main className="flex min-h-dvh flex-col px-6 py-8 gap-6">
      {/* 등급 배지 */}
      <GradeBadge grade={score.grade} total={score.total} />

      {/* 구분선 */}
      <hr style={{ borderColor: "var(--color-senior-border)" }} />

      {/* 항목별 점수 */}
      <div className="space-y-3">
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-senior-text-muted)" }}>
          항목별 결과
        </p>
        <ScoreCard
          icon="🧠"
          label="기억력 검사"
          score={score.memory}
          sub={`단어 ${results.memoryScore}/${results.memoryTotal}개 정답`}
        />
        <ScoreCard
          icon="🔢"
          label="주의력 검사"
          score={score.trail}
          sub={
            results.trailTime === 0
              ? "미완료"
              : `${(results.trailTime / 1000).toFixed(1)}초 · 오류 ${results.trailErrors}회`
          }
        />
        <ScoreCard
          icon="🚦"
          label="신호 반응 검사"
          score={score.reaction}
          sub={`평균 ${fmtMs(avgReaction)} · 오탭 ${results.reactionMistakes}회`}
        />
        <ScoreCard
          icon="🪧"
          label="표지판 식별 검사"
          score={score.signs}
          sub={`${results.signAnswers.filter(Boolean).length}/${results.signAnswers.length}문제 정답`}
        />
        <ScoreCard
          icon="⚠️"
          label="위험 지각 검사"
          score={score.hazard}
          sub={`${results.hazardAnswers.filter(Boolean).length}/${results.hazardAnswers.length}회 인식`}
        />
      </div>

      {/* 액션 버튼 */}
      <div className="space-y-3">
        <ShareButton grade={score.grade} total={score.total} />
        <Link
          href="/test"
          className="btn-senior btn-senior-primary w-full text-center"
          style={{ fontSize: "1.25rem" }}
        >
          다시 연습하기
        </Link>
      </div>

      {/* 광고 */}
      <div className="flex justify-center pb-4">
        <AdBanner variant="banner" />
      </div>
    </main>
  );
}
