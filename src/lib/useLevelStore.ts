import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ALL_TESTS, type TestKey } from "./testNavigation";

export type Level = 1 | 2 | 3;

interface LevelStore {
  level:         Level;
  setLevel:      (l: Level) => void;
  selectedTests: TestKey[];
  toggleTest:    (t: TestKey) => void;
  selectAll:     () => void;
}

export const useLevelStore = create<LevelStore>()(
  persist(
    (set, get) => ({
      level:         2,
      selectedTests: [...ALL_TESTS],

      setLevel: (level) => set({ level }),

      toggleTest: (t) => {
        const current = get().selectedTests;
        const next = current.includes(t)
          ? current.filter((x) => x !== t)
          : [...ALL_TESTS].filter((x) => current.includes(x) || x === t);
        if (next.length > 0) set({ selectedTests: next }); // 최소 1개 선택 유지
      },

      selectAll: () => set({ selectedTests: [...ALL_TESTS] }),
    }),
    {
      name:    "silverdrive-level",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
