import type { SplitCategoryMap, SplitScore, BurnoutRisk } from "@/lib/types/zone";

/**
 * K-WSD split scoring: likert-5 but produces drive/behavioral sub-scores per category
 * categoryMap format: { "통찰력": { drive: [0,1,2], behavioral: [3,4,5] } }
 */
export function calculateSplitLikert(
  answers: Record<string, number>,
  categoryMap: SplitCategoryMap,
  reverseItems: number[] = [],
  maxScale: number = 5
): Record<string, SplitScore> {
  const scores: Record<string, SplitScore> = {};

  for (const [category, indices] of Object.entries(categoryMap)) {
    let driveSum = 0;
    let behavioralSum = 0;

    for (const idx of indices.drive) {
      const raw = answers[String(idx)] ?? 0;
      driveSum += reverseItems.includes(idx) ? (maxScale + 1 - raw) : raw;
    }

    for (const idx of indices.behavioral) {
      const raw = answers[String(idx)] ?? 0;
      behavioralSum += reverseItems.includes(idx) ? (maxScale + 1 - raw) : raw;
    }

    scores[category] = {
      drive: driveSum,
      behavioral: behavioralSum,
      total: driveSum + behavioralSum,
    };
  }

  return scores;
}

/**
 * Burnout risk detection: flags categories where behavioral >> drive
 * gap >= threshold*2 → high, gap >= threshold → medium
 */
export function detectBurnoutRisk(
  splitScores: Record<string, SplitScore>,
  threshold: number = 4
): BurnoutRisk[] {
  return Object.entries(splitScores)
    .map(([category, score]) => {
      const gap = score.behavioral - score.drive;
      return {
        category,
        drive: score.drive,
        behavioral: score.behavioral,
        gap,
        risk: (gap >= threshold * 2 ? "high" : gap >= threshold ? "medium" : "low") as BurnoutRisk["risk"],
      };
    })
    .filter((r) => r.risk !== "low");
}
