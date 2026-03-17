export const WORD_POOL = [
  "사과", "바나나", "포도", "딸기", "귤",
  "자동차", "버스", "기차", "자전거", "배",
  "병원", "학교", "시장", "은행", "약국",
  "안경", "우산", "열쇠", "지갑", "신발",
];

export interface MemoryRound {
  targets: string[];    // 기억해야 할 6개
  choices: string[];    // 회상 화면에 나타날 12개 (섞인 순서)
}

export function buildMemoryRound(): MemoryRound {
  const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5);
  const targets  = shuffled.slice(0, 6);
  const fillers  = shuffled.slice(6, 12);
  const choices  = [...targets, ...fillers].sort(() => Math.random() - 0.5);
  return { targets, choices };
}
