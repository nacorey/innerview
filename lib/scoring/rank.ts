/** 순위 기반 채점 (NLP VAK 등) */
export function sumRank(
  answers: Record<number, Record<string, number>>,
  channel: string
): number {
  return Object.values(answers).reduce(
    (sum, qAnswer) => sum + (qAnswer[channel] ?? 0),
    0
  );
}
