interface ScoreCardProps {
  icon:  string;
  label: string;
  score: number;
  sub?:  string;
}

export function ScoreCard({ icon, label, score, sub }: ScoreCardProps) {
  const color =
    score >= 80 ? "var(--color-senior-success)" :
    score >= 60 ? "var(--color-senior-warning)" :
    "var(--color-senior-danger)";

  return (
    <div className="card-senior flex items-center gap-4">
      <span style={{ fontSize: "2rem", flexShrink: 0 }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: "1.0625rem", fontWeight: 700 }}>{label}</p>
        {sub && (
          <p style={{ fontSize: "0.9rem", color: "var(--color-senior-text-muted)" }}>{sub}</p>
        )}
      </div>
      <p style={{ fontSize: "1.625rem", fontWeight: 900, color, flexShrink: 0 }}>{score}점</p>
    </div>
  );
}
