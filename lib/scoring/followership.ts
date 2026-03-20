import type { FollowershipType, FollowershipResult } from "@/lib/types/zone";

/**
 * Followership quadrant detection (Kelley model)
 * X = 적극적참여 (0-60), Y = 독립적사고 (0-60)
 *
 * Q1 (X↑ Y↑): 모범형(Exemplary)
 * Q2 (X↓ Y↑): 소외형(Alienated)
 * Q3 (X↓ Y↓): 수동형(Passive)
 * Q4 (X↑ Y↓): 순응형(Conformist)
 * Center (20≤X≤40, 20≤Y≤40): 실용형(Pragmatic) — checked first
 */
export function detectFollowershipType(
  activeEngagement: number,
  independentThinking: number
): FollowershipType {
  const mid = 30;
  const pragMin = 20;
  const pragMax = 40;

  // Pragmatic (center zone) overrides quadrants
  if (
    activeEngagement >= pragMin && activeEngagement <= pragMax &&
    independentThinking >= pragMin && independentThinking <= pragMax
  ) {
    return "pragmatic";
  }

  if (activeEngagement > mid && independentThinking > mid) return "exemplary";
  if (activeEngagement <= mid && independentThinking > mid) return "alienated";
  if (activeEngagement > mid && independentThinking <= mid) return "conformist";
  return "passive";
}

/**
 * Build full followership result from category scores
 */
export function buildFollowershipResult(
  scores: Record<string, number>
): FollowershipResult {
  const activeEngagement = scores["적극적참여"] ?? 0;
  const independentThinking = scores["독립적사고"] ?? 0;

  return {
    activeEngagement,
    independentThinking,
    type: detectFollowershipType(activeEngagement, independentThinking),
  };
}
