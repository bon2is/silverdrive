"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SpeechGuide } from "@/components/SpeechGuide";
import { useTestStore } from "@/lib/useTestStore";

const TESTS = [
  { icon: "🧠", name: "기억력 검사",        desc: "단어 6개를 기억한 뒤 회상해요",    step: "1단계" },
  { icon: "🔢", name: "주의력 검사",        desc: "숫자 1~10을 순서대로 눌러요",       step: "2단계" },
  { icon: "🚦", name: "신호 반응 검사",     desc: "초록불에만 빠르게 반응해요",        step: "3단계" },
  { icon: "🪧", name: "표지판 식별 검사",   desc: "제시된 표지판을 정확하게 찾아요",   step: "4단계" },
  { icon: "⚠️", name: "위험 지각 검사",    desc: "도로 위 위험 요소를 빠르게 눌러요", step: "5단계" },
];

export default function TestHubPage() {
  const router = useRouter();
  const reset  = useTestStore((s) => s.reset);

  useEffect(() => { reset(); }, [reset]);

  return (
    <main className="flex min-h-dvh flex-col px-6 py-4">
      <SpeechGuide text="총 5가지 검사를 순서대로 진행합니다. 실제 운전 적성검사와 유사한 항목으로 구성되어 있습니다. 준비되셨으면 시작 버튼을 눌러주세요." />

      <h1 className="mb-4 text-center font-black" style={{ fontSize: "1.75rem", color: "var(--color-senior-primary)" }}>
        운전 적성 자가진단
      </h1>

      <div className="mb-8 space-y-3">
        {TESTS.map((t, i) => (
          <div key={i} className="card-senior flex items-center gap-4">
            <span className="text-3xl">{t.icon}</span>
            <div className="flex-1">
              <p className="font-bold" style={{ fontSize: "1.125rem" }}>{t.name}</p>
              <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>{t.desc}</p>
            </div>
            <span className="shrink-0 rounded-full px-3 py-1 text-sm font-bold"
              style={{ backgroundColor: "var(--color-senior-border)", color: "var(--color-senior-primary)" }}>
              {t.step}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/test/memory")}
        className="btn-senior btn-senior-primary w-full"
        style={{ fontSize: "1.375rem" }}
      >
        전체 검사 시작하기
      </button>

      <Link href="/" className="mt-4 block text-center" style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
        ← 홈으로 돌아가기
      </Link>
    </main>
  );
}
