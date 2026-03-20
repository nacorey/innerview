import type { DiagnosticToolConfig } from "@/lib/types/diagnostic";
import type { SplitCategoryMap, SplitScore, BurnoutRisk } from "@/lib/types/zone";
import { calculateSplitLikert, detectBurnoutRisk } from "./split";

export interface ScoreResult {
  scores: Record<string, number>;
  subScores?: Record<string, SplitScore>;
  burnoutRisk?: BurnoutRisk[];
}

export function calculateScores(
  config: DiagnosticToolConfig,
  answers: Record<number, number | Record<string, number>>
): ScoreResult {
  switch (config.scaleType) {
    case "likert-4":
    case "likert-5":
    case "likert-7":
      return {
        scores: calculateLikert(config, answers as Record<number, number>),
      };

    case "split-likert-5": {
      const splitScores = calculateSplitLikert(
        answers as Record<string, number>,
        config.categoryMap as SplitCategoryMap,
        config.reverseItems ?? [],
        config.maxScale ?? 5
      );
      return {
        scores: Object.fromEntries(
          Object.entries(splitScores).map(([k, v]) => [k, v.total])
        ),
        subScores: splitScores,
        burnoutRisk: detectBurnoutRisk(splitScores),
      };
    }

    case "rank-4":
      return {
        scores: calculateRank(config, answers as Record<number, Record<string, number>>),
      };

    default:
      return { scores: {} };
  }
}

function calculateLikert(
  config: DiagnosticToolConfig,
  answers: Record<number, number>
): Record<string, number> {
  const scores: Record<string, number> = {};
  const maxScale = config.maxScale ?? 5;

  for (const [category, indices] of Object.entries(config.categoryMap)) {
    // split-likert categoryMap has { drive: [], behavioral: [] } — skip those here
    if (!Array.isArray(indices)) continue;

    scores[category] = (indices as number[]).reduce((sum: number, idx: number) => {
      const raw = answers[idx] ?? 0;
      const isReverse = config.reverseItems?.includes(idx) ?? false;
      const score = isReverse ? (maxScale + 1) - raw : raw;
      return sum + score;
    }, 0);
  }

  return scores;
}

function calculateRank(
  config: DiagnosticToolConfig,
  answers: Record<number, Record<string, number>>
): Record<string, number> {
  const channels = Object.keys(config.categoryMap);
  const scores: Record<string, number> = {};

  for (const ch of channels) {
    scores[ch] = Object.values(answers).reduce(
      (sum: number, qAnswer: Record<string, number>) => sum + (qAnswer[ch] ?? 0),
      0
    );
  }

  return scores;
}
