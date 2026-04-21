"use client";

import { useState } from "react";

const STARS = [1, 2, 3, 4, 5];

interface Props {
  grade: string;
  total: number;
}

export function FeedbackButton({ grade, total }: Props) {
  const [open,      setOpen]      = useState(false);
  const [rating,    setRating]    = useState(0);
  const [hover,     setHover]     = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function handleRate(star: number) {
    setRating(star);
  }

  function handleSubmit() {
    if (rating === 0) return;
    // GA4 이벤트
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag?.("event", "feedback_rating", {
        rating,
        grade,
        total_score: total,
      });
    } catch { /* GA4 없으면 무시 */ }
    // localStorage 기록
    try {
      const prev = JSON.parse(localStorage.getItem("silverdrive_feedback") ?? "[]");
      prev.push({ rating, grade, total, at: new Date().toISOString() });
      localStorage.setItem("silverdrive_feedback", JSON.stringify(prev.slice(-20)));
    } catch { /* 무시 */ }
    setSubmitted(true);
  }

  if (submitted) return null; // 제출 후 버튼 숨김

  return (
    <>
      {/* 피드백 열기 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="btn-senior w-full"
        style={{
          fontSize:        "1rem",
          fontWeight:      700,
          backgroundColor: "var(--color-senior-surface)",
          color:           "var(--color-senior-text-muted)",
          border:          "1px solid var(--color-senior-border)",
        }}
      >
        💬 앱이 도움이 됐나요? 평가해주세요
      </button>

      {/* 모달 */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position:        "fixed",
            inset:           0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            zIndex:          1000,
            padding:         "1.5rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width:           "100%",
              maxWidth:        "360px",
              backgroundColor: "var(--color-senior-surface)",
              borderRadius:    "1.25rem",
              padding:         "1.75rem 1.5rem",
              display:         "flex",
              flexDirection:   "column",
              gap:             "1.25rem",
              boxShadow:       "0 8px 40px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.375rem", fontWeight: 900 }}>이 앱이 도움이 됐나요?</p>
              <p style={{ fontSize: "1rem", color: "var(--color-senior-text-muted)", marginTop: "0.375rem" }}>
                별점을 눌러 평가해주세요
              </p>
            </div>

            {/* 별점 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
              {STARS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleRate(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    fontSize:   "2.5rem",
                    lineHeight: 1,
                    background: "none",
                    border:     "none",
                    cursor:     "pointer",
                    padding:    "0.25rem",
                    filter:     s <= (hover || rating) ? "none" : "grayscale(1) opacity(0.35)",
                    transition: "filter 0.1s, transform 0.1s",
                    transform:  s <= (hover || rating) ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p style={{ textAlign: "center", fontSize: "1rem", color: "var(--color-senior-primary)", fontWeight: 700 }}>
                {rating === 5 ? "정말 감사합니다! 🎉" :
                 rating >= 3 ? "소중한 의견 감사해요 😊" :
                 "개선할게요! 감사합니다 🙏"}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="btn-senior btn-senior-primary w-full"
              style={{
                fontSize:  "1.125rem",
                fontWeight: 700,
                opacity:    rating === 0 ? 0.4 : 1,
              }}
            >
              평가 보내기
            </button>

            <button
              onClick={() => setOpen(false)}
              style={{
                fontSize:   "0.9375rem",
                color:      "var(--color-senior-text-muted)",
                background: "none",
                border:     "none",
                cursor:     "pointer",
                textAlign:  "center",
              }}
            >
              나중에 할게요
            </button>
          </div>
        </div>
      )}
    </>
  );
}
