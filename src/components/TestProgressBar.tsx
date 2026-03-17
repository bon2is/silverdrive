interface TestProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export function TestProgressBar({ current, total, label }: TestProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div
      className="sticky top-0 z-10 w-full px-4 py-3"
      style={{ backgroundColor: "var(--color-senior-bg)" }}
    >
      <div className="mb-1 flex items-center justify-between">
        <span style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)" }}>
          {label}
        </span>
        <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-senior-primary)" }}>
          {current} / {total}
        </span>
      </div>
      <div
        className="h-3 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--color-senior-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: "var(--color-senior-primary)",
          }}
        />
      </div>
    </div>
  );
}
