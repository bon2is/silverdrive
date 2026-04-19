interface LeaveConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LeaveConfirmModal({ onConfirm, onCancel }: LeaveConfirmModalProps) {
  return (
    <div
      style={{
        position:        "fixed",
        inset:           0,
        backgroundColor: "rgba(0,0,0,0.65)",
        zIndex:          9999,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "1.5rem",
      }}
    >
      <div
        className="card-senior"
        style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <div className="text-center">
          <span style={{ fontSize: "3rem" }}>🚪</span>
          <p style={{ fontSize: "1.5rem", fontWeight: 900, marginTop: "0.75rem" }}>
            검사를 그만하시겠어요?
          </p>
          <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>
            지금까지의 결과는 저장되지 않습니다
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={onCancel}
            style={{
              padding:         "1.1rem",
              borderRadius:    "0.75rem",
              border:          "none",
              backgroundColor: "var(--color-senior-primary)",
              color:           "#000",
              fontSize:        "1.25rem",
              fontWeight:      700,
              cursor:          "pointer",
            }}
          >
            계속하기
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding:         "1.1rem",
              borderRadius:    "0.75rem",
              border:          "3px solid var(--color-senior-border)",
              backgroundColor: "var(--color-senior-surface)",
              color:           "var(--color-senior-text-muted)",
              fontSize:        "1.125rem",
              fontWeight:      700,
              cursor:          "pointer",
            }}
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
