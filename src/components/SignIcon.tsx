import type { ReactNode } from "react";
import { SIGNS } from "@/lib/signs";

interface SignIconProps {
  id: string;
  size?: number;
}

const svgMap: Record<string, (size: number) => ReactNode> = {
  "no-entry": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#e53935" stroke="#fff" strokeWidth="3" />
      <rect x="18" y="42" width="64" height="16" rx="4" fill="#fff" />
    </svg>
  ),
  "one-way": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="2" y="2" width="96" height="96" rx="8" fill="#1565c0" />
      <polygon points="20,50 50,20 50,38 80,38 80,62 50,62 50,80" fill="#fff" />
    </svg>
  ),
  "crosswalk": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 96,96 4,96" fill="#fff" stroke="#e53935" strokeWidth="6" />
      <circle cx="50" cy="42" r="8" fill="#333" />
      <line x1="50" y1="50" x2="50" y2="72" stroke="#333" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="58" x2="38" y2="70" stroke="#333" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="58" x2="62" y2="70" stroke="#333" strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
  "traffic-light": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="30" y="8" width="40" height="84" rx="10" fill="#333" />
      <circle cx="50" cy="28" r="12" fill="#e53935" />
      <circle cx="50" cy="50" r="12" fill="#f5c518" />
      <circle cx="50" cy="72" r="12" fill="#4caf50" />
    </svg>
  ),
  "speed-limit": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="10" />
      <text x="50" y="64" textAnchor="middle" fontSize="34" fontWeight="bold" fill="#111">50</text>
    </svg>
  ),
  "no-parking": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#1565c0" />
      <text x="50" y="64" textAnchor="middle" fontSize="44" fontWeight="bold" fill="#fff">P</text>
      <line x1="20" y1="20" x2="80" y2="80" stroke="#e53935" strokeWidth="10" strokeLinecap="round" />
    </svg>
  ),
  "yield": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,96 4,10 96,10" fill="#fff" stroke="#e53935" strokeWidth="8" />
      <text x="50" y="74" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#e53935">양보</text>
    </svg>
  ),
  "school-zone": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 96,96 4,96" fill="#f5c518" stroke="#e53935" strokeWidth="6" />
      {/* 어린이 */}
      <circle cx="50" cy="40" r="7" fill="#333" />
      <line x1="50" y1="47" x2="50" y2="65" stroke="#333" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="53" x2="40" y2="62" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="53" x2="60" y2="62" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      <text x="50" y="90" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e53935">어린이보호</text>
    </svg>
  ),
  "senior-zone": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 96,96 4,96" fill="#f5c518" stroke="#333" strokeWidth="6" />
      {/* 지팡이 노인 */}
      <circle cx="48" cy="38" r="7" fill="#333" />
      <line x1="48" y1="45" x2="44" y2="65" stroke="#333" strokeWidth="5" strokeLinecap="round" />
      <line x1="55" y1="50" x2="62" y2="68" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      <text x="50" y="90" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#333">노인보호</text>
    </svg>
  ),
  "no-uturn": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="8" />
      <path d="M35,65 Q35,30 65,30 Q80,30 80,45 L80,65" stroke="#333" strokeWidth="7" fill="none" strokeLinecap="round" />
      <polygon points="70,60 80,74 90,60" fill="#333" />
      <line x1="20" y1="20" x2="80" y2="80" stroke="#e53935" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  "no-overtaking": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="8" />
      <rect x="20" y="42" width="28" height="16" rx="4" fill="#333" />
      <rect x="52" y="42" width="28" height="16" rx="4" fill="#777" />
      <line x1="20" y1="20" x2="80" y2="80" stroke="#e53935" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  "pedestrian-only": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="2" y="2" width="96" height="96" rx="8" fill="#1565c0" />
      <circle cx="50" cy="28" r="9" fill="#fff" />
      <line x1="50" y1="37" x2="50" y2="65" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <line x1="50" y1="48" x2="36" y2="60" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="48" x2="64" y2="60" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="65" x2="38" y2="82" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="65" x2="62" y2="82" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  "stop": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="#e53935" />
      <text x="50" y="60" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fff">일시</text>
      <text x="50" y="80" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fff">정지</text>
    </svg>
  ),
  "no-left-turn": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e53935" strokeWidth="8" />
      <path d="M65,70 L65,40 Q65,25 50,25 Q35,25 35,40 L35,55" stroke="#333" strokeWidth="7" fill="none" strokeLinecap="round" />
      <polygon points="25,50 35,62 45,50" fill="#333" />
      <line x1="20" y1="20" x2="80" y2="80" stroke="#e53935" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  "roundabout": (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="2" y="2" width="96" height="96" rx="8" fill="#1565c0" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="#fff" strokeWidth="7" />
      <circle cx="50" cy="50" r="10" fill="#fff" />
      <polygon points="50,18 60,30 50,24 40,30" fill="#fff" />
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
