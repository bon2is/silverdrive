import { Grade } from "@/lib/gradeCalculator";

const GRADE_CONFIG: Record<Grade, { emoji: string; label: string; color: string; message: string }> = {
  safe:    { emoji: "🟢", label: "안전",     color: "var(--color-senior-success)", message: "운전 능력이 우수합니다!" },
  caution: { emoji: "🟡", label: "주의",     color: "var(--color-senior-warning)", message: "조금 더 연습하면 좋겠어요." },
  danger:  { emoji: "🔴", label: "노력 필요", color: "var(--color-senior-danger)",  message: "안전을 위해 충분한 연습을 권장합니다." },
};

interface GradeBadgeProps {
  grade: Grade;
  total: number;
}

export function GradeBadge({ grade, total }: GradeBadgeProps) {
  const cfg = GRADE_CONFIG[grade];
  return (
    <div className="text-center">
      <div style={{ fontSize: "5rem", lineHeight: 1 }}>{cfg.emoji}</div>
      <p style={{ fontSize: "2.25rem", fontWeight: 900, color: cfg.color, marginTop: "0.5rem" }}>
        {cfg.label}
      </p>
      <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-senior-text)", marginTop: "0.25rem" }}>
        종합 {total}점
      </p>
      <p style={{ fontSize: "1.125rem", color: "var(--color-senior-text-muted)", marginTop: "0.5rem" }}>
        {cfg.message}
      </p>
    </div>
  );
}
