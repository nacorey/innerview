import type { FlexibilityScore } from "@/lib/types/zone";

/**
 * Leadership flexibility: standard deviation of style scores
 * Lower SD = higher flexibility (uses all styles evenly)
 * SD ≤ 3: high, SD ≤ 5: medium, SD > 5: low (biased toward one style)
 */
export function calculateFlexibility(
  scores: Record<string, number>
): FlexibilityScore {
  const values = Object.values(scores);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const sd = Math.round(Math.sqrt(variance) * 100) / 100;

  return {
    sd,
    level: sd <= 3 ? "high" : sd <= 5 ? "medium" : "low",
  };
}
