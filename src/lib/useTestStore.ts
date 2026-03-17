import { create } from "zustand";

interface TestResults {
  reactionTimes: number[]; // ms, 최대 5개
  signAnswers: boolean[];   // 정오답, 최대 5개
  hazardAnswers: boolean[]; // 성공/실패, 최대 3개
}

interface TestStore {
  results: TestResults;
  addReactionTime: (ms: number) => void;
  addSignAnswer: (correct: boolean) => void;
  addHazardAnswer: (hit: boolean) => void;
  reset: () => void;
}

const initial: TestResults = {
  reactionTimes: [],
  signAnswers: [],
  hazardAnswers: [],
};

export const useTestStore = create<TestStore>((set) => ({
  results: initial,
  addReactionTime: (ms) =>
    set((s) => ({
      results: {
        ...s.results,
        reactionTimes: [...s.results.reactionTimes, ms],
      },
    })),
  addSignAnswer: (correct) =>
    set((s) => ({
      results: {
        ...s.results,
        signAnswers: [...s.results.signAnswers, correct],
      },
    })),
  addHazardAnswer: (hit) =>
    set((s) => ({
      results: {
        ...s.results,
        hazardAnswers: [...s.results.hazardAnswers, hit],
      },
    })),
  reset: () => set({ results: { reactionTimes: [], signAnswers: [], hazardAnswers: [] } }),
}));
