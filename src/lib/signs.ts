export interface Sign {
  id: string;
  name: string;
  situation: string; // 도전 레벨: 상황 설명으로 찾기
}

export type SignQuestionType = "name-to-icon" | "icon-to-name" | "situation";

export interface SignQuestion {
  type: SignQuestionType;
  correctId: string;
}

export const SIGNS: Sign[] = [
  { id: "no-entry",        name: "진입금지",       situation: "차가 들어갈 수 없는 길 앞에 설치된 표지판은?" },
  { id: "no-vehicles",     name: "통행금지",       situation: "모든 차와 사람이 통행할 수 없음을 알리는 표지판은?" },
  { id: "one-way",         name: "일방통행",       situation: "한 방향으로만 통행할 수 있음을 알리는 표지판은?" },
  { id: "crosswalk",       name: "횡단보도",       situation: "보행자가 길을 건너는 곳을 나타내는 표지판은?" },
  { id: "speed-limit",     name: "속도제한",       situation: "이 구간에서 최대로 달릴 수 있는 속도를 제한하는 표지판은?" },
  { id: "no-parking",      name: "주차금지",       situation: "이곳에 차를 세워두면 안 된다는 표지판은?" },
  { id: "yield",           name: "양보",           situation: "다른 차량에게 먼저 지나가도록 해야 하는 표지판은?" },
  { id: "school-zone",     name: "어린이보호구역", situation: "학교 앞에서 어린이 안전을 위해 서행해야 하는 구역을 알리는 표지판은?" },
  { id: "senior-zone",     name: "노인보호구역",   situation: "어르신이 많이 다니는 곳에서 주의운전해야 하는 구역 표지판은?" },
  { id: "no-uturn",        name: "유턴금지",       situation: "U자로 돌아서 반대 방향으로 가면 안 된다는 표지판은?" },
  { id: "no-overtaking",   name: "추월금지",       situation: "앞차를 앞질러 지나가면 안 된다는 표지판은?" },
  { id: "pedestrian-only", name: "보행자전용도로", situation: "차량은 통행할 수 없고 사람만 다닐 수 있는 길을 알리는 표지판은?" },
  { id: "stop",            name: "일시정지",       situation: "교차로 등에서 반드시 잠깐 멈춰야 한다는 표지판은?" },
  { id: "no-left-turn",    name: "좌회전금지",     situation: "왼쪽 방향으로 꺾어 가면 안 된다는 표지판은?" },
  { id: "roundabout",      name: "회전교차로",     situation: "둥글게 돌아서 원하는 방향으로 나가는 교차로를 알리는 표지판은?" },
  { id: "slippery",        name: "미끄러운도로",   situation: "도로가 미끄러울 수 있으니 속도를 줄여야 함을 알리는 표지판은?" },
  { id: "uphill",          name: "오르막경사",     situation: "앞쪽 도로가 오르막길임을 미리 알리는 표지판은?" },
  { id: "no-right-turn",   name: "우회전금지",     situation: "오른쪽 방향으로 꺾어 가면 안 된다는 표지판은?" },
];

/** 정답 1개 + 랜덤 오답 3개 반환 (섞인 순서) */
export function buildRound(correctId: string): Sign[] {
  const correct = SIGNS.find((s) => s.id === correctId)!;
  const wrongs  = SIGNS.filter((s) => s.id !== correctId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [...wrongs, correct].sort(() => Math.random() - 0.5);
}

/** count 개의 문제를, 지정된 types를 순환하며 생성 */
export function buildQuestions(count: number, types: SignQuestionType[]): SignQuestion[] {
  const shuffled = [...SIGNS].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((sign, i) => ({
    type: types[i % types.length],
    correctId: sign.id,
  }));
}
