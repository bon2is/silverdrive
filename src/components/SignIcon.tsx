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
      <polygon points="50,82 16,22 84,22" fill="#e53935" opacity="0.15" />
      <text x="50" y="74" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#e53935">양보</text>
    </svg>
  ),
};

export function SignIcon({ id, size = 100 }: SignIconProps) {
  const render = svgMap[id];
  if (!render) return null;
  // 한국어 이름을 aria-label로 사용, SVG 자체는 aria-hidden
  const koreanName = SIGNS.find((s) => s.id === id)?.name ?? id;
  return (
    <span role="img" aria-label={koreanName}>
      {render(size)}
    </span>
  );
}
