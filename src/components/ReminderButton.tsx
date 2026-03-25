"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sd_reminder_at";
const DELAY_MS    = 7 * 24 * 60 * 60 * 1000; // 7일

type PermState = "unknown" | "default" | "granted" | "denied";

export function ReminderButton() {
  const [permState, setPermState] = useState<PermState>("unknown");
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      setPermState("denied");
      return;
    }
    setPermState(Notification.permission as PermState);
    const storedAt = localStorage.getItem(STORAGE_KEY);
    setScheduled(!!storedAt);
  }, []);

  async function handleClick() {
    if (!("Notification" in window)) return;

    let perm = Notification.permission;
    if (perm === "default") {
      perm = await Notification.requestPermission();
    }
    setPermState(perm as PermState);

    if (perm !== "granted") return;

    const remindAt = Date.now() + DELAY_MS;
    localStorage.setItem(STORAGE_KEY, String(remindAt));
    setScheduled(true);
  }

  // 알림 지원 안 되거나 이미 거부된 경우 숨김
  if (permState === "unknown" || permState === "denied") return null;

  if (scheduled || permState === "granted") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const d = new Date(Number(stored));
      const label = `${d.getMonth() + 1}월 ${d.getDate()}일`;
      return (
        <div
          style={{
            textAlign: "center",
            fontSize:  "0.875rem",
            color:     "var(--color-senior-text-muted)",
            paddingTop: "0.25rem",
          }}
        >
          ✅ {label}에 재연습 알림 예약됨
        </div>
      );
    }
  }

  return (
    <button
      onClick={handleClick}
      className="btn-senior w-full"
      style={{
        fontSize:        "1rem",
        fontWeight:      700,
        backgroundColor: "var(--color-senior-surface)",
        color:           "var(--color-senior-text)",
        border:          "1px solid var(--color-senior-border)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        gap:             "0.5rem",
      }}
    >
      📅 일주일 후 재연습 알림 받기
    </button>
  );
}
