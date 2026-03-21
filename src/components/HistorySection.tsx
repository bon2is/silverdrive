"use client";

import { useState } from "react";
import { loadHistory, updateLatestNickname, type TestRecord } from "@/lib/testHistory";
import { loginWithKakaoAndGetNickname } from "@/lib/kakaoSdk";

const GRADE_LABEL: Record<string, string> = {
  safe:    "안전",
  caution: "주의",
  danger:  "노력 필요",
};
const GRADE_COLOR: Record<string, string> = {
  safe:    "#4caf50",
  caution: "#f5c518",
  danger:  "#e53935",
};
const GRADE_EMOJI: Record<string, string> = {
  safe: "🟢", caution: "🟡", danger: "🔴",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays < 7)  return `${diffDays}일 전`;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m}월 ${day}일`;
}

type LoginState = "idle" | "loading" | "done" | "error";

export function HistorySection() {
  // lazy initializer: 첫 렌더 시 localStorage에서 읽기 (SSR 안전)
  const [history, setHistory]     = useState<TestRecord[]>(() => loadHistory());
  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [expanded, setExpanded]   = useState(false);

  if (history.length < 2) return null; // 첫 회차는 섹션 미표시 (비교 대상 없음)

  const SHOW_MAX  = expanded ? history.length : 4;
  const latest    = history[0];
  const hasNickname = !!latest.kakaoNickname;

  async function handleKakaoLogin() {
    setLoginState("loading");
    const nickname = await loginWithKakaoAndGetNickname();
    if (nickname) {
      updateLatestNickname(nickname);
      setHistory(loadHistory());
      setLoginState("done");
    } else {
      setLoginState("error");
      setTimeout(() => setLoginState("idle"), 3000);
    }
  }

  return (
    <div
      style={{
        borderRadius: "1rem",
        border:       "1px solid var(--color-senior-border)",
        padding:      "1.25rem",
        background:   "var(--color-senior-surface)",
      }}
    >
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <p style={{ fontSize: "1.125rem", fontWeight: 700 }}>
          📊 내 검사 기록
        </p>
        {hasNickname && (
          <span style={{ fontSize: "0.875rem", color: "var(--color-senior-text-muted)" }}>
            {latest.kakaoNickname}님
          </span>
        )}
      </div>

      {/* 기록 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {history.slice(0, SHOW_MAX).map((record, i) => (
          <div
            key={i}
            style={{
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "space-between",
              padding:         "0.625rem 0.875rem",
              borderRadius:    "0.625rem",
              background:      i === 0 ? "rgba(254,229,0,0.08)" : "transparent",
              border:          i === 0 ? "1px solid rgba(254,229,0,0.3)" : "1px solid transparent",
            }}
          >
            <span style={{ fontSize: "0.9375rem", color: "var(--color-senior-text-muted)", minWidth: "4rem" }}>
              {i === 0 ? "🆕 " : ""}{formatDate(record.date)}
            </span>
            <span style={{ fontSize: "1.125rem", fontWeight: 900, flex: 1, textAlign: "center" }}>
              {record.total}점
            </span>
            <span
              style={{
                fontSize:        "0.875rem",
                fontWeight:      700,
                color:           GRADE_COLOR[record.grade] ?? "#888",
                minWidth:        "5rem",
                textAlign:       "right",
              }}
            >
              {GRADE_EMOJI[record.grade]} {GRADE_LABEL[record.grade] ?? record.grade}
            </span>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {history.length > 4 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            marginTop:  "0.75rem",
            width:      "100%",
            fontSize:   "0.9375rem",
            color:      "var(--color-senior-text-muted)",
            background: "none",
            border:     "none",
            cursor:     "pointer",
            padding:    "0.25rem",
          }}
        >
          {expanded ? "▲ 접기" : `▼ 전체 기록 보기 (${history.length}회)`}
        </button>
      )}

      {/* 카카오로 이름 저장 (선택) */}
      {!hasNickname && (
        <div style={{ marginTop: "1rem", borderTop: "1px solid var(--color-senior-border)", paddingTop: "1rem" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-senior-text-muted)", marginBottom: "0.625rem", textAlign: "center" }}>
            카카오로 로그인하면 이름을 기록에 남길 수 있어요 <br />
            <span style={{ fontSize: "0.8125rem" }}>(선택사항 · 기록은 이 기기에만 저장됩니다)</span>
          </p>
          <button
            onClick={handleKakaoLogin}
            disabled={loginState === "loading" || loginState === "done"}
            style={{
              width:           "100%",
              padding:         "0.75rem",
              borderRadius:    "0.625rem",
              border:          "none",
              backgroundColor: loginState === "error" ? "#e53935" : "#FEE500",
              color:           loginState === "error" ? "#fff" : "#191600",
              fontSize:        "1rem",
              fontWeight:      700,
              cursor:          loginState === "loading" ? "wait" : "pointer",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              gap:             "0.5rem",
              opacity:         loginState === "loading" ? 0.7 : 1,
            }}
          >
            {loginState === "loading" && "⏳ 로그인 중..."}
            {loginState === "error"   && "❌ 로그인 실패 (잠시 후 다시 시도해주세요)"}
            {loginState === "done"    && "✅ 저장됐어요!"}
            {loginState === "idle"    && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/kakao-logo.svg" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
                카카오로 이름 저장하기 (선택)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
