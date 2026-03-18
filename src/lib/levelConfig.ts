import type { Level } from "./useLevelStore";
import type { SignQuestionType } from "./signs";

export interface LevelConfig {
  label: string;
  emoji: string;
  desc: string;
  // 기억력
  memoryTargets: number;  // 기억할 단어 수
  memorySec: number;      // 기억 시간(초)
  memoryChoices: number;  // 회상 선택지 총 수
  // 주의력(숫자연결)
  trailMax: number;       // 숫자 최대값
  trailCols: number;      // 그리드 열
  trailRows: number;      // 그리드 행
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
    memorySec: 12,
    memoryChoices: 8,
    trailMax: 8,
    trailCols: 3,
    trailRows: 3,
    reactionRounds: 4,
    signRounds: 5,
    signTypes: ["name-to-icon"],
    hazardRounds: 3,
    hazardTimeoutMs: 4000,
  },
  2: {
    label: "보통",
    emoji: "🚗",
    desc: "일반 운전자 수준으로 도전해요",
    memoryTargets: 6,
    memorySec: 10,
    memoryChoices: 12,
    trailMax: 10,
    trailCols: 3,
    trailRows: 4,
    reactionRounds: 5,
    signRounds: 7,
    signTypes: ["name-to-icon", "icon-to-name"],
    hazardRounds: 4,
    hazardTimeoutMs: 3000,
  },
  3: {
    label: "도전",
    emoji: "🏆",
    desc: "실제 운전적성 수준으로 도전해요",
    memoryTargets: 8,
    memorySec: 8,
    memoryChoices: 16,
    trailMax: 15,
    trailCols: 4,
    trailRows: 4,
    reactionRounds: 7,
    signRounds: 10,
    signTypes: ["name-to-icon", "icon-to-name", "situation"],
    hazardRounds: 5,
    hazardTimeoutMs: 2500,
  },
};
