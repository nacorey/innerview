/**
 * 에고그램 패턴 자동 판별
 * CP-NP-A-FC-AC 순서의 점수 배열로 패턴을 분석한다.
 */

const CATEGORY_ORDER = ["CP", "NP", "A", "FC", "AC"];

export function detectEgogramPattern(scores: Record<string, number>): string {
  const values = CATEGORY_ORDER.map((k) => scores[k] ?? 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;

  // 평탄형: 편차가 작은 경우
  if (range <= 4) return "평탄형";

  const [cp, np, a, fc, ac] = values;

  // 역N형: NP·FC 높고 CP·A·AC 낮음 (가장 이상적)
  if (np > a && fc > a && np >= cp && fc >= ac) {
    if (a <= np && a <= fc) return "역N형";
  }

  // N형: CP·A·AC 높고 NP·FC 낮음
  if (cp > np && a > np && a > fc && ac > fc) {
    return "N형";
  }

  // V형: A가 가장 낮고 양끝(CP, AC)이 높음
  if (a === min && cp > a && ac > a) {
    return "V형";
  }

  // W형: NP와 FC가 낮고 CP, A, AC가 높음
  if (cp > np && a > np && a > fc && ac > fc && np < a && fc < a) {
    return "W형";
  }

  // M형: NP와 FC가 높고 CP, A, AC가 낮음
  if (np > cp && np > a && fc > a && fc > ac) {
    return "M형";
  }

  // 우상향형: CP→AC로 갈수록 점수 증가
  if (ac > fc && fc >= a && a >= np && np >= cp) {
    return "우상향형";
  }

  // 우하향형: CP→AC로 갈수록 점수 감소
  if (cp >= np && np >= a && a >= fc && fc > ac) {
    return "우하향형";
  }

  // 기본값: 가장 높은 카테고리 기준
  return "혼합형";
}

/**
 * BFI-2 Big Five 패턴 자동 판별
 * 가장 높은 성격 요인 기반으로 패턴을 분류한다.
 */

const BFI_CATEGORY_ORDER = [
  "Extraversion",
  "Agreeableness",
  "Conscientiousness",
  "NegativeEmotionality",
  "OpenMindedness",
];

const BFI_PATTERN_MAP: Record<string, string> = {
  Extraversion: "활동적 외향형",
  Agreeableness: "관계 지향형",
  Conscientiousness: "목표 달성형",
  NegativeEmotionality: "감성 민감형",
  OpenMindedness: "탐구 개방형",
};

export function detectBFIPattern(scores: Record<string, number>): string {
  const values = BFI_CATEGORY_ORDER.map((k) => scores[k] ?? 0);
  const max = Math.max(...values);
  const min = Math.min(...values);

  // 균형형: 편차가 작은 경우
  if (max - min <= 4) return "균형 조화형";

  // 최고점 요인 찾기
  const maxIdx = values.indexOf(max);
  const maxKey = BFI_CATEGORY_ORDER[maxIdx];

  return BFI_PATTERN_MAP[maxKey] ?? "복합 성향형";
}

/**
 * Leadership: dominant style = highest scoring style
 */
export function detectDominantStyle(scores: Record<string, number>): string {
  const entries = Object.entries(scores);
  entries.sort(([, a], [, b]) => b - a);
  return entries[0]?.[0] ?? "";
}

/**
 * Followership: Kelley 5-type quadrant detection
 */
export function detectFollowershipPattern(scores: Record<string, number>): string {
  const x = scores["적극적참여"] ?? 0;
  const y = scores["독립적사고"] ?? 0;
  const mid = 30;

  // Pragmatic center zone (20-40, 20-40) checked first
  if (x >= 20 && x <= 40 && y >= 20 && y <= 40) return "실용형";
  if (x > mid && y > mid) return "모범형";
  if (x <= mid && y > mid) return "소외형";
  if (x > mid && y <= mid) return "순응형";
  return "수동형";
}

/**
 * Attitude: counts warnings for scores ≤ 3
 */
export function detectAttitudeWarnings(scores: Record<string, number>): string {
  const warnings = Object.entries(scores).filter(([, v]) => v <= 3);
  if (warnings.length === 0) return "양호";
  if (warnings.length <= 2) return "주의";
  return "경고";
}

export function detectPattern(
  patternType: string,
  scores: Record<string, number>
): string | undefined {
  switch (patternType) {
    case "egogram":
      return detectEgogramPattern(scores);
    case "bigfive":
      return detectBFIPattern(scores);
    case "dominant-style":
      return detectDominantStyle(scores);
    case "matrix-quadrant":
      return detectFollowershipPattern(scores);
    case "attitude-warning":
      return detectAttitudeWarnings(scores);
    case "burnout-risk":
      // K-WSD burnout patterns are handled by the split scoring engine
      return undefined;
    default:
      return undefined;
  }
}
