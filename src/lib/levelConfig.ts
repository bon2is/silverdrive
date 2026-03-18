import type { Level } from "./useLevelStore";
import type { SignQuestionType } from "./signs";

export interface LevelConfig {
  label: string;
  emoji: string;
  desc: string;
  // 기억력
  memoryTargets: number;
  memorySec: number;
  memoryChoices: number;
  // 주의력(숫자연결)
  trailMax: number;
  trailCols: number;
  trailRows: number;
  // 신호반응
  reactionRounds: number;
  // 표지판
  signRounds: number;
  signTypes: SignQuestionType[];
  // 위험지각
  hazardRounds: number;
  hazardTimeoutMs: number;
}

export const LEVEL_CONFIGS: Record<Level, LevelConfig> = {
  1: {
    label: "입문",
    emoji: "🌱",
    desc: "쉬운 문제로 천천히 시작해요",
    memoryTargets: 4,
    memorySec: 8,       // 12s → 8s
    memoryChoices: 8,
    trailMax: 6,        // 8 → 6
    trailCols: 3,
    trailRows: 3,       // 9칸에 6개 배치
    reactionRounds: 2,  // 4 → 2
    signRounds: 3,      // 5 → 3
    signTypes: ["name-to-icon"],
    hazardRounds: 2,    // 3 → 2
    hazardTimeoutMs: 4000,
  },
  2: {
    label: "보통",
    emoji: "🚗",
    desc: "일반 운전자 수준으로 도전해요",
    memoryTargets: 6,
    memorySec: 8,       // 10s → 8s
    memoryChoices: 12,
    trailMax: 8,        // 10 → 8
    trailCols: 3,
    trailRows: 3,       // 9칸에 8개 배치
    reactionRounds: 3,  // 5 → 3
    signRounds: 4,      // 7 → 4
    signTypes: ["name-to-icon", "icon-to-name"],
    hazardRounds: 2,    // 4 → 2
    hazardTimeoutMs: 3000,
  },
  3: {
    label: "도전",
    emoji: "🏆",
    desc: "실제 운전적성 수준으로 도전해요",
    memoryTargets: 7,   // 8 → 7
    memorySec: 7,       // 8s → 7s
    memoryChoices: 14,  // 16 → 14
    trailMax: 12,       // 15 → 12
    trailCols: 4,
    trailRows: 4,       // 16칸에 12개 배치
    reactionRounds: 5,  // 7 → 5
    signRounds: 6,      // 10 → 6
    signTypes: ["name-to-icon", "icon-to-name", "situation"],
    hazardRounds: 3,    // 5 → 3
    hazardTimeoutMs: 2500,
  },
};
