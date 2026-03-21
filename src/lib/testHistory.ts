export interface TestRecord {
  date: string; // ISO 날짜 문자열
  total: number;
  grade: string; // 'safe' | 'caution' | 'danger'
  scores: {
    memory: number;
    trail: number;
    reaction: number;
    signs: number;
    hazard: number;
  };
  kakaoNickname?: string;
}

const STORAGE_KEY = "silverdrive_history";
const MAX_RECORDS = 20;

export function saveTestRecord(
  total: number,
  grade: string,
  scores: TestRecord["scores"]
): void {
  const entry: TestRecord = {
    date: new Date().toISOString(),
    total,
    grade,
    scores,
  };
  const history = loadHistory();
  const updated = [entry, ...history].slice(0, MAX_RECORDS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch { /* 저장 공간 부족 시 무시 */ }
}

export function updateLatestNickname(nickname: string): void {
  const history = loadHistory();
  if (history.length === 0) return;
  history[0].kakaoNickname = nickname;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch { /* 무시 */ }
}

export function loadHistory(): TestRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TestRecord[]) : [];
  } catch {
    return [];
  }
}
