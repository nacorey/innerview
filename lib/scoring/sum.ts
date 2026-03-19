/** 단순 합산 채점 (likert-4 등 역채점 없는 경우) */
export function sumScore(answers: Record<number, number>, indices: number[]): number {
  return indices.reduce((sum, idx) => sum + (answers[idx] ?? 0), 0);
}
