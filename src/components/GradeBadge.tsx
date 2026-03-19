import { Grade } from "@/lib/gradeCalculator";

const GRADE_CONFIG: Record<Grade, {
  emoji:   string;
  label:   string;
  color:   string;
  bg:      string;
  tag:     string;
  message: string;
}> = {
  safe: {
    emoji:   "🎉",
    label:   "합격 가능",
    color:   "var(--color-senior-success)",
    bg:      "rgba(76,175,80,0.12)",
    tag:     "실제 검사도 자신 있어요!",
    message: "5가지 인지능력 모두 우수합니다. 이대로 면허 갱신에 도전해보세요.",
  },
  caution: {
    emoji:   "📝",
    label:   "연습 필요",
    color:   "var(--color-senior-warning)",
    bg:      "rgba(255,152,0,0.12)",
    tag:     "조금만 더 연습하면 합격해요!",
    message: "일부 항목을 더 연습하면 충분히 합격할 수 있습니다.",
  },
  danger: {
    emoji:   "💪",
    label:   "집중 연습",
    color:   "var(--color-senior-danger)",
    bg:      "rgba(244,67,54,0.12)",
    tag:     "반복 연습으로 꼭 합격해요!",
    message: "아직 시간이 있습니다. 아래 약한 항목을 집중적으로 연습해보세요.",
  },
};

interface GradeBadgeProps {
  grade: Grade;
  total: number;
}

export function GradeBadge({ grade, total }: GradeBadgeProps) {
  const cfg = GRADE_CONFIG[grade];
  return (
    <div style={{
      textAlign:    "center",
      padding:      "1.5rem 1rem",
      borderRadius: "1rem",
      background:   cfg.bg,
      border:       `2px solid ${cfg.color}`,
    }}>
      <div style={{ fontSize: "4rem", lineHeight: 1 }}>{cfg.emoji}</div>
      <p style={{ fontSize: "1rem", fontWeight: 700, color: cfg.color, marginTop: "0.75rem" }}>
        {cfg.tag}
      </p>
      <p style={{ fontSize: "2.5rem", fontWeight: 900, color: cfg.color, marginTop: "0.25rem", lineHeight: 1.1 }}>
        {total}점 · {cfg.label}
      </p>
      <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", marginTop: "0.75rem", lineHeight: 1.6 }}>
        {cfg.message}
      </p>
    </div>
  );
}
