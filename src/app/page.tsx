import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center px-6 py-8">

      {/* 히어로 이미지 */}
      <div
        style={{
          width:        "200px",
          height:       "200px",
          borderRadius: "50%",
          overflow:     "hidden",
          marginBottom: "1.25rem",
          boxShadow:    "0 8px 32px rgba(245,197,24,0.35)",
          border:       "4px solid #f5c518",
          flexShrink:   0,
        }}
      >
        <Image
          src="/app-icon.png"
          alt="실버드라이브 캐릭터"
          width={200}
          height={200}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          priority
        />
      </div>

      {/* 타이틀 */}
      <div className="mb-6 text-center">
        <h1
          className="mb-2 font-black leading-tight no-select"
          style={{ fontSize: "2.25rem", color: "var(--color-senior-primary)" }}
        >
          실버드라이브
        </h1>
        <p
          className="leading-relaxed"
          style={{ fontSize: "1.125rem", color: "var(--color-senior-text-muted)" }}
        >
          운전면허 갱신 인지능력 자가진단 연습
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/test"
        className="btn-senior btn-senior-primary w-full max-w-sm text-center"
        style={{ fontSize: "1.5rem", padding: "1.1rem" }}
      >
        전체 검사 시작하기
      </Link>

      {/* 검사 항목 */}
      <div className="mt-8 w-full max-w-sm space-y-3">
        <p className="font-bold text-center" style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
          검사 항목
        </p>
        {[
          { icon: "🧠", label: "기억력 검사" },
          { icon: "🔢", label: "주의력 검사" },
          { icon: "🚦", label: "신호 반응 검사" },
          { icon: "🪧", label: "표지판 식별 검사" },
          { icon: "⚠️", label: "위험 지각 검사" },
        ].map((t) => (
          <div key={t.label} className="card-senior flex items-center gap-3 py-3">
            <span className="text-2xl">{t.icon}</span>
            <p className="font-bold" style={{ fontSize: "1.0625rem" }}>{t.label}</p>
          </div>
        ))}
      </div>

      <p
        className="mt-6 text-center"
        style={{ fontSize: "0.875rem", color: "var(--color-senior-text-muted)" }}
      >
        모든 테스트는 무료입니다
      </p>
    </main>
  );
}
