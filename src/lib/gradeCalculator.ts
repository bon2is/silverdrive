import { TestResults } from "./useTestStore";

export type Grade = "safe" | "caution" | "danger";

export interface ScoreBreakdown {
  memory:   number; // 0~100
  trail:    number; // 0~100
  reaction: number; // 0~100
  signs:    number; // 0~100
  hazard:   number; // 0~100
  total:    number; // 0~100 (단순 평균)
  grade:    Grade;
}

function calcMemory(r: TestResults): number {
  if (r.memoryTotal === 0) return 0;
  return Math.round((r.memoryScore / r.memoryTotal) * 100);
}

function calcTrail(r: TestResults): number {
  if (r.trailTime === 0) return 0;
  const secs = r.trailTime / 1000;
  // 30초 이하=100, 120초=0, 선형 감소
  const base = Math.max(0, Math.round(100 - ((secs - 30) / 90) * 100));
  return Math.max(0, base - r.trailErrors * 10);
}

function calcReaction(r: TestResults): number {
  if (r.reactionTimes.length === 0) return 0;
  const avg = r.reactionTimes.reduce((a, b) => a + b, 0) / r.reactionTimes.length;
  let base: number;
  if      (avg < 500)  base = 100;
  else if (avg < 800)  base = 85;
  else if (avg < 1200) base = 65;
  else if (avg < 1500) base = 40;
  else                 base = 20;
  return Math.max(0, base - r.reactionMistakes * 15);
}

function calcSigns(r: TestResults): number {
  if (r.signAnswers.length === 0) return 0;
  return Math.round((r.signAnswers.filter(Boolean).length / r.signAnswers.length) * 100);
}

function calcHazard(r: TestResults): number {
  if (r.hazardAnswers.length === 0) return 0;
  return Math.round((r.hazardAnswers.filter(Boolean).length / r.hazardAnswers.length) * 100);
}

export function calcScore(results: TestResults): ScoreBreakdown {
  const memory   = calcMemory(results);
  const trail    = calcTrail(results);
  const reaction = calcReaction(results);
  const signs    = calcSigns(results);
  const hazard   = calcHazard(results);
  const total    = Math.round((memory + trail + reaction + signs + hazard) / 5);

  const grade: Grade =
    total >= 80 ? "safe" :
    total >= 60 ? "caution" :
    "danger";

  return { memory, trail, reaction, signs, hazard, total, grade };
}
