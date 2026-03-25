"use client";

import { useEffect } from "react";

const REMINDER_KEY = "sd_reminder_at";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then(async (reg) => {
        // 예약된 재연습 알림 체크 — 날짜가 됐으면 로컬 알림 발송
        const storedAt = localStorage.getItem(REMINDER_KEY);
        if (!storedAt) return;
        if (Notification.permission !== "granted") return;
        if (Date.now() < Number(storedAt)) return;

        localStorage.removeItem(REMINDER_KEY);
        await reg.showNotification("실버드라이브 재연습 알림 🚗", {
          body: "일주일이 지났어요! 운전 인지능력 검사를 다시 연습해보세요.",
          icon: "/icons/icon-192x192.svg",
          badge: "/icons/icon-192x192.svg",
          tag:  "sd-reminder",
        });
      })
      .catch((err) => console.warn("SW registration failed:", err));
  }, []);

  return null;
}
