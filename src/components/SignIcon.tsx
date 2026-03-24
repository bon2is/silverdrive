import type { ReactNode } from "react";
import { SIGNS } from "@/lib/signs";

interface SignIconProps {
  id: string;
  size?: number;
}

const svgMap: Record<string, (size: number) => ReactNode> = {
  /* ── 규제표지 ───────────────────────────────────────────────── */
  "no-entry": (s) => (
    // 진입금지: 원형 빨간 배경 + 흰 가로막대 (규제표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#e53935" stroke="#fff" strokeWidth="3" />
      <rect x="16" y="41" width="68" height="18" rx="3" fill="#fff" />
    </svg>
  ),
  "no-vehicles": (s) => (
    // 통행금지: 원형 흰 배경 + 빨간 테두리 + 중앙 빨간 가로막대
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="10" />
      <rect x="16" y="41" width="68" height="18" rx="3" fill="#e53935" />
    </svg>
  ),
  "one-way": (s) => (
    // 일방통행: 파란 사각형 + 흰 화살표
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="2" y="2" width="96" height="96" rx="8" fill="#1565c0" />
      <polygon points="18,50 50,18 50,36 82,36 82,64 50,64 50,82" fill="#fff" />
    </svg>
  ),
  "crosswalk": (s) => (
    // 횡단보도: 파란 사각형 + 보행자 + 줄무늬 (지시표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="3" y="3" width="94" height="94" rx="8" fill="#1565c0" />
      <circle cx="50" cy="18" r="7" fill="#fff" />
      <line x1="50" y1="25" x2="50" y2="50" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="36" x2="37" y2="48" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="63" y2="48" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="40" y2="67" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="60" y2="67" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <rect x="14" y="74" width="72" height="7" rx="2" fill="#fff" />
      <rect x="14" y="85" width="72" height="7" rx="2" fill="#fff" opacity="0.7" />
    </svg>
  ),
  "speed-limit": (s) => (
    // 속도제한: 원형 흰 배경 + 빨간 테두리 + 숫자 (규제표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="10" />
      <text x="50" y="66" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#111">50</text>
    </svg>
  ),
  "no-parking": (s) => (
    // 주차금지: 파란 원형 + P + 빨간 사선 (규제표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#1565c0" />
      <text x="50" y="66" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#fff">P</text>
      <line x1="22" y1="22" x2="78" y2="78" stroke="#e53935" strokeWidth="10" strokeLinecap="round" />
    </svg>
  ),
  "yield": (s) => (
    // 양보: 역삼각형(아래 꼭짓점) 흰 배경 + 빨간 테두리 (규제표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,97 3,8 97,8" fill="#fff" stroke="#e53935" strokeWidth="8" />
      <text x="50" y="72" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#e53935">양보</text>
    </svg>
  ),
  "school-zone": (s) => (
    // 어린이보호구역: 녹색 사각형 + 어린이 픽토그램 (지시표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="3" y="3" width="94" height="94" rx="8" fill="#2e7d32" stroke="#fff" strokeWidth="2" />
      <circle cx="50" cy="24" r="8" fill="#fff" />
      <line x1="50" y1="32" x2="50" y2="56" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="42" x2="37" y2="54" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="42" x2="63" y2="54" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="56" x2="40" y2="72" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="56" x2="60" y2="72" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <text x="50" y="90" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">어린이보호</text>
    </svg>
  ),
  "senior-zone": (s) => (
    // 노인보호구역: 녹색 사각형 + 지팡이 노인 픽토그램 (지시표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="3" y="3" width="94" height="94" rx="8" fill="#2e7d32" stroke="#fff" strokeWidth="2" />
      <circle cx="47" cy="22" r="8" fill="#fff" />
      <line x1="47" y1="30" x2="43" y2="56" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="47" y1="40" x2="36" y2="52" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="43" y1="56" x2="36" y2="72" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="43" y1="56" x2="52" y2="72" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      {/* 지팡이 */}
      <line x1="55" y1="40" x2="63" y2="72" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <text x="50" y="90" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">노인보호</text>
    </svg>
  ),
  "no-uturn": (s) => (
    // 유턴금지: 흰 원형 + 빨간 테두리 + U자 화살표 + 금지 사선 (규제표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="8" />
      <path d="M28,72 L28,42 Q28,15 53,15 Q78,15 78,42 L78,72"
        stroke="#333" strokeWidth="7" fill="none" strokeLinecap="round" />
      <polygon points="68,65 78,82 88,65" fill="#333" />
      <line x1="18" y1="18" x2="82" y2="82" stroke="#e53935" strokeWidth="9" strokeLinecap="round" />
    </svg>
  ),
  "no-overtaking": (s) => (
    // 추월금지: 흰 원형 + 빨간 테두리 + 차 2대(검정/회색) + 금지 사선 (규제표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="8" />
      <rect x="14" y="40" width="32" height="18" rx="4" fill="#222" />
      <rect x="54" y="40" width="32" height="18" rx="4" fill="#888" />
      <line x1="18" y1="18" x2="82" y2="82" stroke="#e53935" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  "pedestrian-only": (s) => (
    // 보행자전용도로: 파란 원형 + 보행자 (지시표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#1565c0" />
      <circle cx="50" cy="22" r="9" fill="#fff" />
      <line x1="50" y1="31" x2="50" y2="60" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <line x1="50" y1="43" x2="35" y2="56" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="43" x2="65" y2="56" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="60" x2="38" y2="78" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="60" x2="62" y2="78" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  "stop": (s) => (
    // 일시정지: 팔각형 빨간 배경 + 흰 글자 (규제표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="29,4 71,4 96,29 96,71 71,96 29,96 4,71 4,29" fill="#e53935" />
      <text x="50" y="56" textAnchor="middle" fontSize="21" fontWeight="bold" fill="#fff">일시</text>
      <text x="50" y="78" textAnchor="middle" fontSize="21" fontWeight="bold" fill="#fff">정지</text>
    </svg>
  ),
  "no-left-turn": (s) => (
    // 좌회전금지: 흰 원형 + 빨간 테두리 + L자 화살표 + 금지 사선 (규제표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="8" />
      <line x1="65" y1="80" x2="65" y2="32" stroke="#333" strokeWidth="7" strokeLinecap="round" />
      <line x1="65" y1="32" x2="18" y2="32" stroke="#333" strokeWidth="7" strokeLinecap="round" />
      <polygon points="11,32 26,22 26,42" fill="#333" />
      <line x1="18" y1="18" x2="82" y2="82" stroke="#e53935" strokeWidth="9" strokeLinecap="round" />
    </svg>
  ),
  "roundabout": (s) => (
    // 회전교차로: 파란 원형 + 흰 순환 화살표 (지시표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#1565c0" />
      <circle cx="50" cy="50" r="22" fill="none" stroke="#fff" strokeWidth="6" />
      <circle cx="50" cy="50" r="8" fill="#fff" />
      {/* 반시계방향 화살표 3개 */}
      <path d="M50,22 A28,28 0 0,0 22,50" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
      <polygon points="18,44 22,58 32,48" fill="#fff" />
    </svg>
  ),
  /* ── 주의표지 ───────────────────────────────────────────────── */
  "slippery": (s) => (
    // 미끄러운도로: 노란 삼각형 + 빨간 테두리 + 차가 미끄러지는 모양 (주의표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 96,92 4,92" fill="#f5c518" stroke="#e53935" strokeWidth="6" />
      {/* 미끄러지는 차 */}
      <rect x="33" y="52" width="22" height="12" rx="3" fill="#333" />
      <circle cx="37" cy="66" r="4" fill="#333" />
      <circle cx="51" cy="66" r="4" fill="#333" />
      {/* 타이어 자국 물결선 */}
      <path d="M36,46 Q40,42 44,46 Q48,50 52,46 Q56,42 60,46"
        stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  ),
  "uphill": (s) => (
    // 오르막경사: 노란 삼각형 + 빨간 테두리 + 오르막 화살표 (주의표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 96,92 4,92" fill="#f5c518" stroke="#e53935" strokeWidth="6" />
      {/* 오르막 경사 표현: 기울어진 도로 + 화살표 */}
      <line x1="25" y1="75" x2="70" y2="38" stroke="#333" strokeWidth="6" strokeLinecap="round" />
      <polygon points="70,38 58,34 62,46" fill="#333" />
      <line x1="25" y1="75" x2="75" y2="75" stroke="#333" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  "no-right-turn": (s) => (
    // 우회전금지: 흰 원형 + 빨간 테두리 + 우회전 화살표 + 금지 사선 (규제표지)
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="8" />
      <line x1="35" y1="80" x2="35" y2="32" stroke="#333" strokeWidth="7" strokeLinecap="round" />
      <line x1="35" y1="32" x2="82" y2="32" stroke="#333" strokeWidth="7" strokeLinecap="round" />
      <polygon points="89,32 74,22 74,42" fill="#333" />
      <line x1="18" y1="18" x2="82" y2="82" stroke="#e53935" strokeWidth="9" strokeLinecap="round" />
    </svg>
  ),
};

export function SignIcon({ id, size = 100 }: SignIconProps) {
  const render = svgMap[id];
  if (!render) return null;
  const koreanName = SIGNS.find((s) => s.id === id)?.name ?? id;
  return (
    <span role="img" aria-label={koreanName}>
      {render(size)}
    </span>
  );
}
