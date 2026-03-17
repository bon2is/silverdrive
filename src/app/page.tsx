import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      {/* Logo / Title */}
      <div className="mb-10 text-center">
        <div className="mb-4 text-6xl">🚗</div>
        <h1
          className="mb-3 font-black leading-tight no-select"
          style={{ fontSize: "2.25rem", color: "var(--color-senior-primary)" }}
        >
          실버드라이브
        </h1>
        <p
          className="leading-relaxed"
          style={{ fontSize: "1.25rem", color: "var(--color-senior-text-muted)" }}
        >
          운전면허 갱신 인지능력 자가진단
          <br />
          연습 서비스
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/test"
        className="btn-senior btn-senior-primary mb-6 w-full max-w-sm text-center"
      >
        테스트 시작하기
      </Link>

      {/* Info cards */}
      <div className="w-full max-w-sm space-y-4">
        <div className="card-senior flex items-start gap-4">
          <span className="text-3xl">⚡</span>
          <div>
            <p className="font-bold" style={{ fontSize: "1.125rem" }}>
              자극 반응 테스트
            </p>
            <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
              화면에 나타나는 도형을 빠르게 클릭
            </p>
          </div>
        </div>
        <div className="card-senior flex items-start gap-4">
          <span className="text-3xl">🚦</span>
          <div>
            <p className="font-bold" style={{ fontSize: "1.125rem" }}>
              표지판 식별 테스트
            </p>
            <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
              도로 표지판을 정확하게 구분
            </p>
          </div>
        </div>
        <div className="card-senior flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="font-bold" style={{ fontSize: "1.125rem" }}>
              위험 지각 테스트
            </p>
            <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
              도로 위 위험 요소를 빠르게 인지
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm flex justify-center">
        <AdBanner />
      </div>

      <p
        className="mt-6 text-center"
        style={{ fontSize: "0.9rem", color: "var(--color-senior-text-muted)" }}
      >
        모든 테스트는 무료입니다
      </p>
    </main>
  );
}
