import type { DiagnosticToolConfig } from "@/lib/types/diagnostic";

export function calculateScores(
  config: DiagnosticToolConfig,
  answers: Record<number, number | Record<string, number>>
): Record<string, number> {
  switch (config.scaleType) {
    case "likert-4":
    case "likert-5":
      return calculateLikert(config, answers as Record<number, number>);
    case "rank-4":
      return calculateRank(config, answers as Record<number, Record<string, number>>);
  }
}

function calculateLikert(
  config: DiagnosticToolConfig,
  answers: Record<number, number>
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const [category, indices] of Object.entries(config.categoryMap)) {
    scores[category] = indices.reduce((sum, idx) => {
      const raw = answers[idx] ?? 0;
      const isReverse = config.reverseItems?.includes(idx) ?? false;
      const score = isReverse ? (config.maxScale! + 1) - raw : raw;
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
      (sum, qAnswer) => sum + (qAnswer[ch] ?? 0),
      0
    );
  }

  return scores;
}
