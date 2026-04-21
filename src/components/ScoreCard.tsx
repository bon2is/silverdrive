interface ScoreCardProps {
  icon:  string;
  label: string;
  score: number | null; // null = 미실시
  sub?:  string;
}

export function ScoreCard({ icon, label, score, sub }: ScoreCardProps) {
  const skipped = score === null;
  const color =
    skipped         ? "var(--color-senior-text-muted)" :
    score >= 80     ? "var(--color-senior-success)"    :
    score >= 60     ? "var(--color-senior-warning)"    :
                      "var(--color-senior-danger)";

  return (
    <div className="card-senior" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "1.75rem", flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "1.0625rem", fontWeight: 700 }}>{label}</p>
          {sub && !skipped && (
            <p style={{ fontSize: "0.875rem", color: "var(--color-senior-text-muted)" }}>{sub}</p>
          )}
          {skipped && (
            <p style={{ fontSize: "0.875rem", color: "var(--color-senior-text-muted)" }}>미실시</p>
          )}
        </div>
        <p style={{ fontSize: "1.5rem", fontWeight: 900, color, flexShrink: 0 }}>
          {skipped ? "–" : `${score}점`}
        </p>
      </div>
      {/* 점수 바 */}
      <div style={{
        height:          "10px",
        borderRadius:    "99px",
        backgroundColor: "var(--color-senior-border)",
        overflow:        "hidden",
      }}>
        <div style={{
          height:          "100%",
          width:           skipped ? "0%" : `${score}%`,
          borderRadius:    "99px",
          backgroundColor: color,
          transition:      "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}
