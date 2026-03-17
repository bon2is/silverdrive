export interface Sign {
  id: string;
  name: string;
}

export const SIGNS: Sign[] = [
  { id: "no-entry",     name: "진입금지" },
  { id: "one-way",      name: "일방통행" },
  { id: "crosswalk",    name: "횡단보도" },
  { id: "traffic-light",name: "신호등" },
  { id: "speed-limit",  name: "속도제한" },
  { id: "no-parking",   name: "주차금지" },
  { id: "yield",        name: "양보" },
];

/** 정답 1개 + 랜덤 오답 3개 반환 (섞인 순서) */
export function buildRound(correctId: string): Sign[] {
  const correct = SIGNS.find((s) => s.id === correctId)!;
  const wrongs = SIGNS.filter((s) => s.id !== correctId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [...wrongs, correct].sort(() => Math.random() - 0.5);
}

/** 5라운드 순서 생성 (겹치지 않게) */
export function buildQuestions(): string[] {
  return [...SIGNS].sort(() => Math.random() - 0.5).slice(0, 5).map((s) => s.id);
}
