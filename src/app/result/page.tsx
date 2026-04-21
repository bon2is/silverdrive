"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTestStore } from "@/lib/useTestStore";
import { calcScore } from "@/lib/gradeCalculator";
import { useLevelStore } from "@/lib/useLevelStore";
import { GradeBadge } from "@/components/GradeBadge";
import { ScoreCard } from "@/components/ScoreCard";
import { ShareButton } from "@/components/ShareButton";
import { ReminderButton } from "@/components/ReminderButton";
import { AdBanner } from "@/components/AdBanner";
import { HistorySection } from "@/components/HistorySection";
import { FeedbackButton } from "@/components/FeedbackButton";
import { useSpeech } from "@/lib/useSpeech";
import { saveTestRecord } from "@/lib/testHistory";
import { showBottomBanner, removeBanner, showRewardAd } from "@/lib/useAdMob";
import { Capacitor } from "@capacitor/core";

const GRADE_LABEL: Record<string, string> = {
  safe:    "안전",
  caution: "주의",
  danger:  "노력 필요",
};

// 점수 60점 미만인 항목에 대한 맞춤 조언
const ADVICE: Record<string, { icon: string; title: string; tip: string }> = {
  memory:   { icon: "🧠", title: "기억력",   tip: "단어를 소리 내어 읽고 눈을 감고 떠올리는 연습을 매일 해보세요." },
  trail:    { icon: "🔢", title: "주의력",   tip: "숫자를 순서대로 빠르게 따라가는 연습이 도움돼요. 신문의 숫자 찾기도 좋아요." },
  reaction: { icon: "🚦", title: "반응속도", tip: "화면에 무언가 나타나면 즉시 누르는 연습을 반복해보세요." },
  signs:    { icon: "🪧", title: "표지판",   tip: "실제 도로 운전 시 표지판을 보며 이름을 말하는 습관을 들여보세요." },
  hazard:   { icon: "⚠️", title: "위험지각", tip: "도로에서 위험 요소를 미리 예측하는 방어 운전 습관이 중요해요." },
};

function fmtMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}초` : `${ms}ms`;
}

const BASE_URL = "https://silverdrive.andxo.com";
const PARENT_URL = `${BASE_URL}?utm_source=kakao&utm_medium=parent`;

const GRADE_EMOJI_MAP: Record<string, string> = {
  safe: "🟢", caution: "🟡", danger: "🔴",
};
const GRADE_LABEL_SHARE: Record<string, string> = {
  safe: "안전 등급", caution: "주의 등급", danger: "집중 연습 등급",
};

export default function ResultPage() {
  const results       = useTestStore((s) => s.results);
  const selectedTests = useLevelStore((s) => s.selectedTests);
  const { speak }     = useSpeech();
  const router        = useRouter();
  const score         = calcScore(results, selectedTests);
  const [copied, setCopied]           = useState(false);
  const [rewardLoading, setRewardLoading] = useState(false);
  const [parentCopied, setParentCopied] = useState(false);

  const handleNativeShare = useCallback(async () => {
    const emoji = GRADE_EMOJI_MAP[score.grade];
    const label = GRADE_LABEL_SHARE[score.grade];
    const resultUrl = `${BASE_URL}?utm_source=kakao&utm_medium=share&utm_campaign=result`;
    const text = [
      `나는 ${label}! 어르신 운전 적성 자가진단`,
      `종합 ${score.total}점 나왔어요 🚗 ${emoji}`,
      ``,
      `75세 갱신 전에 한 번 연습해보세요 👇`,
      ``,
      `🧠 기억력  🔢 주의력  🚦 반응속도`,
      `🪧 표지판  ⚠️ 위험지각`,
      `5가지 검사 무료!`,
      ``,
      `👉 ${resultUrl}`,
      `#운전면허갱신 #75세적성검사 #실버드라이브 #고령운전자`,
    ].join("\n");

    if (navigator.share) {
      try { await navigator.share({ title: "실버드라이브 자가진단", text, url: resultUrl }); }
      catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          await navigator.clipboard.writeText(text).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      }
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [score.grade, score.total]);

  const handleParentShare = useCallback(async () => {
    const text = [
      `어머니/아버지, 75세 운전면허 갱신 전에`,
      `이 연습 한번 해보세요. 무료예요 😊`,
      ``,
      `기억력·주의력·반응속도·표지판·위험지각`,
      `5가지 인지능력 자가진단!`,
      ``,
      `👉 ${PARENT_URL}`,
    ].join("\n");

    if (window.Kakao?.Share) {
      try {
        window.Kakao.Share.sendScrap({ requestUrl: PARENT_URL });
        return;
      } catch { /* 폴백 */ }
    }
    if (navigator.share) {
      try { await navigator.share({ title: "실버드라이브 — 부모님께", text, url: PARENT_URL }); return; }
      catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(text).catch(() => {});
    setParentCopied(true);
    setTimeout(() => setParentCopied(false), 2500);
  }, []);

  const handleRewardRetry = useCallback(async () => {
    setRewardLoading(true);
    try {
      // Remove banner BEFORE showing the reward ad — calling removeBanner() during
      // AdMob's reward-video teardown (from unmount cleanup) races with native threads
      // and crashes the app. Pre-removing here makes the cleanup a safe no-op.
      await removeBanner();
      await showRewardAd();
      router.push("/test");
    } catch {
      await showBottomBanner(); // restore on unexpected error
    } finally {
      setRewardLoading(false);
    }
  }, [router]);

  // 평균 반응속도 계산 (표시용)
  const avgReaction = results.reactionTimes.length > 0
    ? Math.round(results.reactionTimes.reduce((a, b) => a + b, 0) / results.reactionTimes.length)
    : 0;

  // 결과 자동 저장 (최초 1회)
  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current || score.total === 0) return;
    savedRef.current = true;
    saveTestRecord(score.total, score.grade, {
      memory:   score.memory   ?? 0,
      trail:    score.trail    ?? 0,
      reaction: score.reaction ?? 0,
      signs:    score.signs    ?? 0,
      hazard:   score.hazard   ?? 0,
    });
  }, [score]);

  useEffect(() => {
    speak(`검사 결과입니다. 종합 ${score.total}점, ${GRADE_LABEL[score.grade]} 등급입니다.`);
  }, [score.grade, score.total, speak]);

  useEffect(() => {
    removeBanner().then(() => showBottomBanner());
    return () => { removeBanner(); };
  }, []);

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

      {/* 맞춤 조언 — 실시한 검사 중 60점 미만 항목만 표시 */}
      {(() => {
        const weak = (
          [
            ["memory",   score.memory],
            ["trail",    score.trail],
            ["reaction", score.reaction],
            ["signs",    score.signs],
            ["hazard",   score.hazard],
          ] as [string, number | null][]
        ).filter(([, s]) => s !== null && s < 60) as [string, number][];

        if (weak.length === 0) return null;

        return (
          <div style={{
            background:   "var(--color-senior-surface)",
            borderRadius: "1rem",
            padding:      "1.25rem",
            border:       "1px solid var(--color-senior-border)",
          }}>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-senior-warning)", marginBottom: "1rem" }}>
              📋 이렇게 연습해보세요
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {weak.map(([key]) => {
                const a = ADVICE[key];
                return (
                  <div key={key} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: "0.1rem" }}>{a.icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "1rem" }}>{a.title}</p>
                      <p style={{ fontSize: "0.9375rem", color: "var(--color-senior-text-muted)", lineHeight: 1.6 }}>{a.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* 액션 버튼 */}
      <div className="space-y-3">
        <ShareButton grade={score.grade} total={score.total} />
        <button
          onClick={handleNativeShare}
          className="btn-senior w-full"
          style={{
            fontSize:        "1.125rem",
            fontWeight:      700,
            backgroundColor: "var(--color-senior-surface)",
            color:           "var(--color-senior-text)",
            border:          "1px solid var(--color-senior-border)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             "0.5rem",
          }}
        >
          {copied ? "✅ 복사됐어요!" : "🔗 다른 방법으로 공유하기"}
        </button>
        {/* 앱: 광고보고 다시하기만 / 웹: 일반 다시하기만 */}
        {Capacitor.isNativePlatform() ? (
          <button
            onClick={handleRewardRetry}
            disabled={rewardLoading}
            className="btn-senior btn-senior-primary w-full"
            style={{
              fontSize:        "1.25rem",
              fontWeight:      700,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              gap:             "0.5rem",
              opacity:         rewardLoading ? 0.6 : 1,
            }}
          >
            {rewardLoading ? "⏳ 광고 준비 중..." : "📺 광고 보고 다시 연습하기"}
          </button>
        ) : (
          <Link
            href="/test"
            className="btn-senior btn-senior-primary w-full text-center"
            style={{ fontSize: "1.25rem" }}
          >
            다시 연습하기
          </Link>
        )}
        <ReminderButton />
        <FeedbackButton grade={score.grade} total={score.total} />
      </div>

      {/* 부모님께 보내기 섹션 */}
      <div style={{
        borderRadius: "1rem",
        border:       "2px dashed var(--color-senior-border)",
        padding:      "1.25rem",
        textAlign:    "center",
      }}>
        <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          부모님이 걱정되신다면?
        </p>
        <p style={{ fontSize: "0.9375rem", color: "var(--color-senior-text-muted)", marginBottom: "1rem" }}>
          카카오톡으로 바로 전달하세요
        </p>
        <button
          onClick={handleParentShare}
          className="btn-senior w-full"
          style={{
            fontSize:        "1.125rem",
            fontWeight:      900,
            backgroundColor: "#FEE500",
            color:           "#191600",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             "0.5rem",
          }}
        >
          {parentCopied ? "✅ 링크 복사됐어요!" : "👴👵 부모님께 링크 보내기"}
        </button>
      </div>

      {/* 내 검사 기록 (2회차부터 표시, 선택적 카카오 이름 저장) */}
      <HistorySection />

      {/* 광고 */}
      <div className="flex justify-center pb-4">
        <AdBanner variant="banner" />
      </div>
    </main>
  );
}
