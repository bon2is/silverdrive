"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SpeechGuide } from "@/components/SpeechGuide";
import { useTestStore } from "@/lib/useTestStore";

const TESTS = [
  { icon: "⚡", name: "자극 반응 테스트", desc: "노란 원이 나타나면 빠르게 눌러요", rounds: "5라운드" },
  { icon: "🚦", name: "표지판 식별 테스트", desc: "제시된 표지판을 정확하게 찾아요", rounds: "5라운드" },
  { icon: "⚠️", name: "위험 지각 테스트",  desc: "도로 위 위험 요소를 빠르게 눌러요", rounds: "3라운드" },
];

export default function TestHubPage() {
  const router = useRouter();
  const reset = useTestStore((s) => s.reset);

  useEffect(() => {
    reset(); // 새 테스트 시작 시 이전 결과 초기화
  }, [reset]);

  return (
    <main className="flex min-h-dvh flex-col px-6 py-4">
      <SpeechGuide
        text="총 3가지 테스트를 순서대로 진행합니다. 준비되셨으면 시작 버튼을 눌러주세요."
      />

      <h1
        className="mb-6 text-center font-black"
        style={{ fontSize: "1.75rem", color: "var(--color-senior-primary)" }}
      >
        운전 적성 자가진단
      </h1>

      <div className="mb-8 space-y-4">
        {TESTS.map((t, i) => (
          <div key={i} className="card-senior flex items-center gap-4">
            <span className="text-4xl">{t.icon}</span>
            <div className="flex-1">
              <p className="font-bold" style={{ fontSize: "1.125rem" }}>{t.name}</p>
              <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>{t.desc}</p>
            </div>
            <span
              className="shrink-0 rounded-full px-3 py-1 text-sm font-bold"
              style={{ backgroundColor: "var(--color-senior-border)", color: "var(--color-senior-primary)" }}
            >
              {t.rounds}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/test/reaction")}
        className="btn-senior btn-senior-primary w-full"
        style={{ fontSize: "1.375rem" }}
      >
        전체 테스트 시작하기
      </button>

      <Link
        href="/"
        className="mt-4 block text-center"
        style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}
      >
        ← 홈으로 돌아가기
      </Link>
    </main>
  );
}
