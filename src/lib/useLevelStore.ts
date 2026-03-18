import { create } from "zustand";

export type Level = 1 | 2 | 3;

interface LevelStore {
  level: Level;
  setLevel: (l: Level) => void;
}

export const useLevelStore = create<LevelStore>((set) => ({
  level: 2,
  setLevel: (level) => set({ level }),
}));
