/**
 * Integrated Profile Engine
 * Loads cross-zone-interpretation.json and generates cross-tool analysis
 * when a user has completed tools across 2+ zones.
 */

import type {
  CrossPattern, BurnoutRisk, AttitudeWarning,
  InfluenceProfile, SplitScore,
} from "@/lib/types/zone";
import { calculateInfluenceProfile } from "./influence";

// Static import of cross-zone interpretation rules
import crossZoneRules from "@/data/seed/cross-zone-interpretation.json";

// ─── Types for tool results ───
interface ToolResult {
  slug: string;
  scores: Record<string, number>;
  subScores?: Record<string, SplitScore>;
  patternType?: string;
}

interface ZoneResults {
  A: ToolResult[];   // BFI-2, K-WSD
  B: ToolResult[];   // NLP VAK, TA Egogram
  C: ToolResult[];   // Conflict Style, Leadership, Followership
  M: ToolResult[];   // Attitude
}

export interface PredictionResult {
  rule: string;
  predicted: string;
  confidence: string;
  matched: boolean;
  coaching: string;
}

export interface InconsistencyResult {
  id: string;
  zones: string;
  interpretation: string;
  coachingQuestion: string;
}

export interface IntegratedProfileResult {
  predictions: PredictionResult[];
  inconsistencies: InconsistencyResult[];
  crossPatterns: CrossPattern[];
  attitudeWarnings: AttitudeWarning[];
  burnoutAlerts: { id: string; severity: string; message: string; action: string }[];
  influenceProfile?: InfluenceProfile;
  completedZones: string[];
}

// ─── Helpers ───

function getToolResult(results: ToolResult[], slug: string): ToolResult | undefined {
  return results.find((r) => r.slug === slug);
}

function getHighestCategory(scores: Record<string, number>): string {
  const entries = Object.entries(scores);
  entries.sort(([, a], [, b]) => b - a);
  return entries[0]?.[0] ?? "";
}

function getTop2Categories(scores: Record<string, number>): string[] {
  const entries = Object.entries(scores);
  entries.sort(([, a], [, b]) => b - a);
  return entries.slice(0, 2).map(([k]) => k);
}

// ─── Zone A → Zone B Predictions ───

function evaluateZoneAToB(zoneA: ToolResult[], zoneB: ToolResult[]): PredictionResult[] {
  const results: PredictionResult[] = [];
  const bfi = getToolResult(zoneA, "bfi2");
  const kwsd = getToolResult(zoneA, "kwsd");
  const ta = getToolResult(zoneB, "ta-egogram");

  if (!ta) return results;

  const taHighest = getHighestCategory(ta.scores);
  const rules = crossZoneRules.zoneA_to_zoneB_predictions;

  // BFI → TA predictions
  if (bfi) {
    const bfiScores = bfi.scores;
    // Normalize BFI scores to 1-5 scale (60 items / 12 per factor)
    const norm = (key: string) => (bfiScores[key] ?? 0) / 12;

    for (const rule of rules.bfi_to_ta) {
      let matched = false;
      const ruleStr = rule.if;

      if (ruleStr.includes("extraversion >= 3.5") && norm("Extraversion") >= 3.5) {
        matched = taHighest === "FC" || taHighest === "NP";
      } else if (ruleStr.includes("agreeableness >= 3.5") && norm("Agreeableness") >= 3.5) {
        matched = taHighest === "NP";
      } else if (ruleStr.includes("agreeableness <= 2.5") && norm("Agreeableness") <= 2.5) {
        matched = taHighest === "CP" || taHighest === "A";
      } else if (ruleStr.includes("conscientiousness >= 3.5") && norm("Conscientiousness") >= 3.5) {
        matched = taHighest === "CP" || taHighest === "A";
      } else if (ruleStr.includes("negativeEmotionality >= 3.5") && norm("NegativeEmotionality") >= 3.5) {
        matched = taHighest === "AC";
      } else if (ruleStr.includes("openMindedness >= 3.5") && norm("OpenMindedness") >= 3.5) {
        matched = taHighest === "FC";
      } else {
        continue; // condition not met, skip
      }

      results.push({
        rule: `BFI ${rule.if} → TA ${rule.then}`,
        predicted: rule.then,
        confidence: rule.confidence,
        matched,
        coaching: matched ? rule.coachingOnMatch : rule.coachingOnMismatch,
      });
    }
  }

  // K-WSD → TA predictions
  if (kwsd) {
    for (const rule of rules.kwsd_to_ta) {
      const ruleStr = rule.if;
      const match = ruleStr.match(/(\S+)\.total >= (\d+)/);
      if (!match) continue;

      const [, category, threshold] = match;
      const total = kwsd.subScores?.[category]?.total ?? kwsd.scores[category] ?? 0;
      if (total < Number(threshold)) continue;

      const expected = rule.then.replace(/[↑↓]/g, "").replace(/ and\/or /g, ",").replace(/ and /g, ",").split(",").map((s) => s.trim());
      const matched = expected.some((e) => taHighest.includes(e));

      results.push({
        rule: `K-WSD ${rule.if} → TA ${rule.then}`,
        predicted: rule.then,
        confidence: rule.confidence,
        matched,
        coaching: matched ? "예측과 일치: 강점이 소통에서도 일관되게 발현" : "예측 불일치: 강점과 소통 패턴의 차이를 탐색하세요",
      });
    }
  }

  return results;
}

// ─── Zone B → Zone C Predictions ───

function evaluateZoneBToC(zoneB: ToolResult[], zoneC: ToolResult[]): PredictionResult[] {
  const results: PredictionResult[] = [];
  const ta = getToolResult(zoneB, "ta-egogram");
  if (!ta) return results;

  const taHighest = getHighestCategory(ta.scores);
  const rules = crossZoneRules.zoneB_to_zoneC_predictions;

  const leadership = getToolResult(zoneC, "leadership");
  if (leadership) {
    const leaderHighest = getHighestCategory(leadership.scores);
    for (const rule of rules.ta_to_leadership) {
      if (!rule.if.includes(`${taHighest} is highest`)) continue;
      const matched = rule.then === leaderHighest.toLowerCase() ||
        (rule.then === "directing" && leaderHighest === "지시형") ||
        (rule.then === "supporting" && leaderHighest === "지원형") ||
        (rule.then === "coaching" && leaderHighest === "코칭형") ||
        (rule.then === "delegating" && leaderHighest === "위임형");

      results.push({
        rule: `TA ${rule.if} → 리더십 ${rule.then}`,
        predicted: rule.then,
        confidence: rule.confidence,
        matched,
        coaching: matched ? "자아상태와 리더십 스타일이 일관됨" : "소통 패턴과 리더십이 다른 상황에서 발현됨",
      });
    }
  }

  return results;
}

// ─── Inconsistency Pattern Detection ───

function detectInconsistencies(zones: ZoneResults): InconsistencyResult[] {
  const results: InconsistencyResult[] = [];
  const patterns = crossZoneRules.inconsistencyPatterns.patterns;

  const bfi = getToolResult(zones.A, "bfi2");
  const kwsd = getToolResult(zones.A, "kwsd");
  const ta = getToolResult(zones.B, "ta-egogram");
  const tki = getToolResult(zones.C, "conflict-style");
  const followership = getToolResult(zones.C, "followership");
  const attitude = getToolResult(zones.M, "attitude");

  for (const p of patterns) {
    let conditionMet = false;

    switch (p.id) {
      case "extravert_low_connection":
        if (bfi && kwsd) {
          const extNorm = (bfi.scores["Extraversion"] ?? 0) / 12;
          const connTotal = kwsd.subScores?.["연결력"]?.total ?? kwsd.scores["연결력"] ?? 0;
          conditionMet = extNorm >= 3.5 && connTotal <= 18;
        }
        break;
      case "drive_high_avoid":
        if (kwsd && tki) {
          const driveTotal = kwsd.subScores?.["추진력"]?.total ?? kwsd.scores["추진력"] ?? 0;
          const tkiHighest = getHighestCategory(tki.scores);
          conditionMet = driveTotal >= 25 && tkiHighest === "회피";
        }
        break;
      case "np_high_competing":
        if (ta && tki) {
          const taHighest = getHighestCategory(ta.scores);
          const tkiHighest = getHighestCategory(tki.scores);
          conditionMet = taHighest === "NP" && tkiHighest === "경쟁";
        }
        break;
      case "conscientious_conformist":
        if (bfi && followership) {
          const consNorm = (bfi.scores["Conscientiousness"] ?? 0) / 12;
          conditionMet = consNorm >= 3.5 && followership.patternType === "순응형";
        }
        break;
      case "openness_passive_follower":
        if (bfi && followership) {
          const openNorm = (bfi.scores["OpenMindedness"] ?? 0) / 12;
          conditionMet = openNorm >= 3.5 && followership.patternType === "수동형";
        }
        break;
      case "insight_no_courage":
        if (kwsd && attitude) {
          const insightTotal = kwsd.subScores?.["통찰력"]?.total ?? kwsd.scores["통찰력"] ?? 0;
          conditionMet = insightTotal >= 25 && (attitude.scores["용기"] ?? 5) <= 3;
        }
        break;
    }

    if (conditionMet) {
      results.push({
        id: p.id,
        zones: p.zones,
        interpretation: p.interpretation,
        coachingQuestion: p.coachingQuestion,
      });
    }
  }

  return results;
}

// ─── Cross-Zone Pattern Matching (weighted) ───

function matchCrossZonePatterns(zones: ZoneResults): CrossPattern[] {
  const matched: CrossPattern[] = [];
  const patterns = crossZoneRules.crossZonePatterns.patterns;

  const bfi = getToolResult(zones.A, "bfi2");
  const kwsd = getToolResult(zones.A, "kwsd");
  const ta = getToolResult(zones.B, "ta-egogram");
  const leadership = getToolResult(zones.C, "leadership");
  const attitude = getToolResult(zones.M, "attitude");

  for (const pattern of patterns) {
    let weight = 0;
    const conditions = pattern.conditions;

    // Zone A checks
    if (bfi && conditions.zoneA?.bfi) {
      const bfiStr = conditions.zoneA.bfi;
      const norm = (key: string) => (bfi.scores[key] ?? 0) / 12;

      if (bfiStr.includes("openMindedness >= 3.5") && norm("OpenMindedness") >= 3.5) weight += 2;
      if (bfiStr.includes("agreeableness >= 3.5") && norm("Agreeableness") >= 3.5) weight += 2;
      if (bfiStr.includes("conscientiousness >= 3.5") && norm("Conscientiousness") >= 3.5) weight += 1;
      if (bfiStr.includes("extraversion <= 2.5") && norm("Extraversion") <= 2.5) weight += 1;
    }

    if (kwsd && conditions.zoneA?.kwsd) {
      const kwsdStr = conditions.zoneA.kwsd;
      const top2 = getTop2Categories(
        Object.fromEntries(
          Object.entries(kwsd.subScores ?? kwsd.scores).map(([k, v]) => [k, typeof v === "number" ? v : v.total])
        )
      );
      const kwsdMatch = kwsdStr.match(/(\S+) in top2/);
      if (kwsdMatch) {
        const targets = kwsdMatch[1].split(" or ");
        if (targets.some((t) => top2.includes(t))) weight += 2;
      }
    }

    // Zone B checks
    if (ta && conditions.zoneB?.ta) {
      const taStr = conditions.zoneB.ta;
      const taHighest = getHighestCategory(ta.scores);
      if (taStr.includes(`${taHighest} is highest`)) weight += 2;
      // Partial match for "2nd" checks
      const top2TA = getTop2Categories(ta.scores);
      if (taStr.includes("or 2nd") && top2TA.some((t) => taStr.includes(t))) weight += 1;
    }

    // Zone C checks
    if (leadership && conditions.zoneC?.leadership) {
      const leaderHighest = getHighestCategory(leadership.scores);
      const leaderStr = conditions.zoneC.leadership;
      if (leaderStr.includes(leaderHighest) || leaderStr.includes("is highest")) {
        const styleMap: Record<string, string> = { "지시형": "directing", "코칭형": "coaching", "지원형": "supporting", "위임형": "delegating" };
        if (leaderStr.includes(styleMap[leaderHighest] ?? "")) weight += 1;
      }
    }

    // Moderator checks
    if (attitude && conditions.moderator) {
      const mod = conditions.moderator as unknown as Record<string, string[] | undefined>;
      const required = mod.required;
      if (required) {
        const allMet = required.every((req: string) => {
          const m = req.match(/(\S+) >= (\d+)/);
          if (!m) return true;
          return (attitude.scores[m[1]] ?? 0) >= Number(m[2]);
        });
        if (allMet) weight += 1;
      }
    }

    if (weight >= pattern.weight_threshold) {
      matched.push({
        name: pattern.name,
        layers: `${pattern.emoji} ${pattern.id}`,
        description: pattern.description,
        coachingTip: pattern.coaching.join(" / "),
      });
    }
  }

  return matched;
}

// ─── Strength-Attitude Conflict Detection ───

function detectAttitudeConflicts(zones: ZoneResults): AttitudeWarning[] {
  const warnings: AttitudeWarning[] = [];
  const kwsd = getToolResult(zones.A, "kwsd");
  const attitude = getToolResult(zones.M, "attitude");
  if (!kwsd || !attitude) return warnings;

  const matrix = crossZoneRules.strengthAttitudeMatrix.mapping as Record<
    string,
    { facilitating: { attitude: string; critical: boolean; impact: string }[]; protective: { attitude: string; critical: boolean; impact: string }[] }
  >;

  // Get top 2 strengths
  const strengthScores = Object.fromEntries(
    Object.entries(kwsd.subScores ?? kwsd.scores).map(([k, v]) => [k, typeof v === "number" ? v : v.total])
  );
  const top2Strengths = getTop2Categories(strengthScores);

  for (const strength of top2Strengths) {
    const mapping = matrix[strength];
    if (!mapping) continue;

    for (const attType of ["facilitating", "protective"] as const) {
      for (const entry of mapping[attType]) {
        if (!entry.critical) continue;
        const attScore = attitude.scores[entry.attitude] ?? 5;
        if (attScore <= 3) {
          warnings.push({
            attitude: entry.attitude,
            type: attType,
            score: attScore,
            affectedStrengths: [strength],
            impact: entry.impact,
          });
        }
      }
    }
  }

  return warnings;
}

// ─── Burnout Composite Detection ───

function detectBurnoutAlerts(zones: ZoneResults): { id: string; severity: string; message: string; action: string }[] {
  const alerts: { id: string; severity: string; message: string; action: string }[] = [];
  const rules = crossZoneRules.burnoutDetection.rules;

  const kwsd = getToolResult(zones.A, "kwsd");
  const ta = getToolResult(zones.B, "ta-egogram");
  const attitude = getToolResult(zones.M, "attitude");
  const followership = getToolResult(zones.C, "followership");

  for (const rule of rules) {
    let conditionMet = false;

    switch (rule.id) {
      case "effortful_low_positivity":
        if (kwsd && attitude) {
          const hasEffortful = Object.values(kwsd.subScores ?? {}).some(
            (s: SplitScore) => s.behavioral - s.drive >= 4
          );
          conditionMet = hasEffortful && (attitude.scores["긍정"] ?? 5) <= 3;
        }
        break;
      case "high_np_low_boundary":
        if (ta && kwsd) {
          const taHighest = getHighestCategory(ta.scores);
          const connGap = (kwsd.subScores?.["연결력"]?.behavioral ?? 0) - (kwsd.subScores?.["연결력"]?.drive ?? 0);
          conditionMet = taHighest === "NP" && connGap >= 4;
        }
        break;
      case "passive_follower_low_confidence":
        if (followership && attitude) {
          conditionMet = followership.patternType === "수동형" && (attitude.scores["자신감"] ?? 5) <= 2;
        }
        break;
      case "high_conscientiousness_effortful":
        if (kwsd) {
          const bfi = getToolResult(zones.A, "bfi2");
          if (bfi) {
            const consNorm = (bfi.scores["Conscientiousness"] ?? 0) / 12;
            const driveGap = (kwsd.subScores?.["추진력"]?.behavioral ?? 0) - (kwsd.subScores?.["추진력"]?.drive ?? 0);
            conditionMet = consNorm >= 4.0 && driveGap >= 4;
          }
        }
        break;
    }

    if (conditionMet) {
      alerts.push({
        id: rule.id,
        severity: rule.severity,
        message: rule.message,
        action: rule.action,
      });
    }
  }

  return alerts;
}

// ─── Main Export ───

export function generateIntegratedProfile(
  toolResults: ToolResult[]
): IntegratedProfileResult | null {
  // Organize results by zone
  const zones: ZoneResults = { A: [], B: [], C: [], M: [] };
  const zoneMap: Record<string, keyof ZoneResults> = {
    "bfi2": "A", "kwsd": "A",
    "nlp-vak": "B", "ta-egogram": "B",
    "conflict-style": "C", "leadership": "C", "followership": "C",
    "attitude": "M",
  };

  for (const result of toolResults) {
    const zone = zoneMap[result.slug];
    if (zone) zones[zone].push(result);
  }

  // Check minimum: 2+ zones must have results
  const completedZones = (Object.keys(zones) as (keyof ZoneResults)[])
    .filter((z) => zones[z].length > 0);
  if (completedZones.length < 2) return null;

  // Run all analyses
  const predictions = [
    ...evaluateZoneAToB(zones.A, zones.B),
    ...evaluateZoneBToC(zones.B, zones.C),
  ];
  const inconsistencies = detectInconsistencies(zones);
  const crossPatterns = matchCrossZonePatterns(zones);
  const attitudeWarnings = detectAttitudeConflicts(zones);
  const burnoutAlerts = detectBurnoutAlerts(zones);

  // Influence profile (requires both leadership + followership)
  let influenceProfile: InfluenceProfile | undefined;
  const leadership = getToolResult(zones.C, "leadership");
  const followership = getToolResult(zones.C, "followership");
  if (leadership && followership) {
    influenceProfile = calculateInfluenceProfile(
      leadership.scores,
      followership.patternType ?? "passive"
    );
  }

  return {
    predictions,
    inconsistencies,
    crossPatterns,
    attitudeWarnings,
    burnoutAlerts,
    influenceProfile,
    completedZones,
  };
}
