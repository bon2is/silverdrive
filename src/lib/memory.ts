// 6개 카테고리 × 8단어 = 48단어 풀
export const WORD_POOL = [
  // 과일
  "사과", "바나나", "포도", "딸기", "귤", "복숭아", "수박", "참외",
  // 동물
  "강아지", "고양이", "토끼", "소", "말", "닭", "오리", "물고기",
  // 장소
  "병원", "학교", "시장", "은행", "약국", "교회", "공원", "우체국",
  // 물건
  "안경", "우산", "열쇠", "지갑", "신발", "책", "시계", "전화기",
  // 음식
  "밥", "국", "김치", "빵", "라면", "떡", "두부", "생선",
  // 색깔
  "빨강", "파랑", "노랑", "초록", "하양", "검정", "분홍", "보라",
];

export interface MemoryRound {
  targets: string[];  // 기억해야 할 단어들
  choices: string[];  // 회상 화면 선택지 (targets + 필러, 섞인 순서)
}

/**
 * @param targets  기억할 단어 수 (레벨에 따라 4 / 6 / 8)
 * @param total    선택지 총 수 (targets × 2: 8 / 12 / 16)
 */
export function buildMemoryRound(targets: number, total: number): MemoryRound {
  const fillerCount = total - targets;
  const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5);
  const targetWords = shuffled.slice(0, targets);
  const fillers     = shuffled.slice(targets, targets + fillerCount);
  const choices     = [...targetWords, ...fillers].sort(() => Math.random() - 0.5);
  return { targets: targetWords, choices };
}
