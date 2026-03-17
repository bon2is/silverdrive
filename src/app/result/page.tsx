// Phase 4에서 결과 리포트로 교체됩니다.
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";

export default function ResultPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <span style={{ fontSize: "4rem" }}>🎉</span>
      <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--color-senior-primary)" }}>
        테스트 완료!
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--color-senior-text-muted)" }}>
        결과 리포트는 Phase 4에서 완성됩니다.
      </p>
      <AdBanner variant="banner" />
      <Link href="/test" className="btn-senior btn-senior-primary">
        다시 연습하기
      </Link>
    </div>
  );
}
