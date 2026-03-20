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

  // 봉우리/골짜기 판별 (양옆보다 높으면 봉우리, 낮으면 골짜기)
  const npIsPeak = np > cp && np > a;
  const fcIsPeak = fc > a && fc > ac;
  const aIsValley = a < np && a < fc;
  const cpIsValley = cp < np;
  const acIsValley = ac < fc;

  // M형: CP↓ NP↑ A↓ FC↑ AC↓ — 봉우리 2개(NP,FC) + 골짜기 3개(CP,A,AC)
  // 세 골짜기 모두 뚜렷해야 함
  if (npIsPeak && fcIsPeak && aIsValley && cpIsValley && acIsValley) {
    const avgPeak = (np + fc) / 2;
    const avgValley = (cp + a + ac) / 3;
    // 봉우리와 골짜기 차이가 뚜렷하면 M형
    if (avgPeak - avgValley >= 3) return "M형";
  }

  // 역N형: NP·FC가 높고 완만한 물결. M형보다 CP나 AC가 상대적으로 높음
  if (npIsPeak && fcIsPeak && aIsValley) {
    return "역N형";
  }

  // W형: NP와 FC가 골짜기, CP·A·AC가 봉우리 (M형의 반전)
  if (cp > np && a > np && a > fc && ac > fc && np < a && fc < a) {
    return "W형";
  }

  // N형: CP·A·AC 높고 NP·FC 낮음
  if (cp > np && a > np && a > fc && ac > fc) {
    return "N형";
  }

  // 산형(역V형): A가 정점, 양쪽으로 내려감 (CP↗NP↗A↘FC↘AC)
  if (a === max && a > np && a > fc && np >= cp && fc >= ac) {
    return "산형";
  }

  // A가 높은 N형: A가 최고점이면서 NP·FC가 골짜기 (CP↗NP↓A↑FC↓AC↗)
  if (a === max && np < a && fc < a && (cp > np || ac > fc)) {
    return "A가 높은 N형";
  }

  // V형: A가 가장 낮고 양끝(CP, AC)이 높음
  if (a === min && cp > a + 2 && ac > a + 2) {
    return "V형";
  }

  // 우상향형: CP→AC로 갈수록 점수 증가
  if (ac > fc && fc >= a && a >= np && np >= cp) {
    return "우상향형";
  }

  // 우하향형: CP→AC로 갈수록 점수 감소
  if (cp >= np && np >= a && a >= fc && fc > ac) {
    return "우하향형";
  }

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
 * Returns English ID for lookup in interpretations._types
 */
export function detectFollowershipPattern(scores: Record<string, number>): string {
  const x = scores["적극적참여"] ?? 0;
  const y = scores["독립적사고"] ?? 0;
  const mid = 30;

  // Pragmatic center zone (20-40, 20-40) checked first (highest priority)
  if (x >= 20 && x <= 40 && y >= 20 && y <= 40) return "pragmatic";
  if (x > mid && y > mid) return "exemplary";
  if (x <= mid && y > mid) return "alienated";
  if (x > mid && y <= mid) return "conformist";
  return "passive";
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
