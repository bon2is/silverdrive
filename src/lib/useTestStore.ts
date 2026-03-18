import { create } from "zustand";

export interface TestResults {
  memoryScore:      number;    // 기억력: 맞춘 단어 수
  memoryTotal:      number;    // 기억력: 목표 단어 수 (레벨에 따라 다름)
  trailTime:        number;    // 숫자연결: 완료 시간 ms (0 = 미완료)
  trailErrors:      number;    // 숫자연결: 오탭 횟수
  reactionTimes:    number[];  // 신호반응: 반응 시간 ms
  reactionMistakes: number;    // 신호반응: 빨간불 오탭 횟수
  signAnswers:      boolean[]; // 표지판: 정오답
  hazardAnswers:    boolean[]; // 위험지각: 성공/실패
}

interface TestStore {
  results: TestResults;
  setMemoryScore:      (score: number, total: number) => void;
  setTrailResult:      (time: number, errors: number) => void;
  addReactionTime:     (ms: number) => void;
  addReactionMistake:  () => void;
  addSignAnswer:       (correct: boolean) => void;
  addHazardAnswer:     (hit: boolean) => void;
  reset:               () => void;
}

const emptyResults = (): TestResults => ({
  memoryScore:      0,
  memoryTotal:      6,
  trailTime:        0,
  trailErrors:      0,
  reactionTimes:    [],
  reactionMistakes: 0,
  signAnswers:      [],
  hazardAnswers:    [],
});

export const useTestStore = create<TestStore>((set) => ({
  results: emptyResults(),

  setMemoryScore: (score, total) =>
    set((s) => ({ results: { ...s.results, memoryScore: score, memoryTotal: total } })),

  setTrailResult: (time, errors) =>
    set((s) => ({ results: { ...s.results, trailTime: time, trailErrors: errors } })),

  addReactionTime: (ms) =>
    set((s) => ({ results: { ...s.results, reactionTimes: [...s.results.reactionTimes, ms] } })),

  addReactionMistake: () =>
    set((s) => ({ results: { ...s.results, reactionMistakes: s.results.reactionMistakes + 1 } })),

  addSignAnswer: (correct) =>
    set((s) => ({ results: { ...s.results, signAnswers: [...s.results.signAnswers, correct] } })),

  addHazardAnswer: (hit) =>
    set((s) => ({ results: { ...s.results, hazardAnswers: [...s.results.hazardAnswers, hit] } })),

  reset: () => set({ results: emptyResults() }),
}));
