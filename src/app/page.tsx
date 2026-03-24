import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { UtmBanner } from "@/components/UtmBanner";

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

      {/* UTM 맞춤 배너 (카카오 공유 진입자) */}
      <Suspense>
        <UtmBanner />
      </Suspense>

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

      {/* SEO 설명 섹션 — 검색엔진이 읽는 텍스트 콘텐츠 */}
      <section
        className="mt-10 w-full max-w-sm"
        aria-label="서비스 안내"
      >
        <h2
          className="font-bold mb-3 text-center"
          style={{ fontSize: "1.125rem", color: "var(--color-senior-text-muted)" }}
        >
          실버드라이브란?
        </h2>
        <div
          className="card-senior"
          style={{ fontSize: "1rem", lineHeight: "1.8", color: "var(--color-senior-text-muted)" }}
        >
          <p>
            만 75세 이상 운전자는 운전면허 갱신 시 <strong>인지능력 적성검사</strong>를 받아야 합니다.
            실버드라이브는 실제 도로교통공단 검사와 동일한 5가지 항목을 <strong>무료</strong>로 미리 연습할 수 있는 서비스입니다.
          </p>
          <p className="mt-2">
            부모님·조부모님께 링크를 보내드리거나, 함께 연습해 보세요.
          </p>
        </div>

        <h2
          className="font-bold mt-6 mb-3 text-center"
          style={{ fontSize: "1.125rem", color: "var(--color-senior-text-muted)" }}
        >
          자주 묻는 질문
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "75세 적성검사, 어렵지 않나요?",
              a: "실버드라이브에서 미리 연습하면 시험 유형에 익숙해질 수 있습니다. 반복 연습으로 자신감을 키워보세요.",
            },
            {
              q: "실제 시험과 같은 방식인가요?",
              a: "도로교통공단 인지능력 자가진단 검사 항목(기억력·주의력·반응속도·표지판·위험지각)과 동일하게 구성되어 있습니다.",
            },
            {
              q: "회원가입이 필요한가요?",
              a: "아니요. 회원가입 없이 바로 시작할 수 있으며, 모든 검사는 무료입니다.",
            },
          ].map((item) => (
            <details key={item.q} className="card-senior">
              <summary
                className="font-bold cursor-pointer"
                style={{ fontSize: "1rem" }}
              >
                {item.q}
              </summary>
              <p className="mt-2" style={{ fontSize: "0.9375rem", lineHeight: "1.7" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
