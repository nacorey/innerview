/** 역채점 포함 합산 (BFI-2 등) */
export function sumWithReverse(
  answers: Record<number, number>,
  indices: number[],
  reverseItems: number[],
  maxScale: number
): number {
  return indices.reduce((sum, idx) => {
    const raw = answers[idx] ?? 0;
    const score = reverseItems.includes(idx) ? maxScale + 1 - raw : raw;
    return sum + score;
  }, 0);
}
