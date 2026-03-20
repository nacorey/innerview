import type { DiagnosticToolConfig } from "@/lib/types/diagnostic";

import taEgogram from "@/data/seed/ta-egogram.json";
import bfi2 from "@/data/seed/bfi2.json";
import nlpVak from "@/data/seed/nlp-vak.json";
import conflictStyle from "@/data/seed/conflict-style.json";
import kwsd from "@/data/seed/kwsd.json";
import leadership from "@/data/seed/leadership.json";
import followership from "@/data/seed/followership.json";
import attitude from "@/data/seed/attitude.json";

/**
 * Normalize snake_case JSON fields to camelCase DiagnosticToolConfig.
 * New seed files use snake_case (DB column names), existing use camelCase.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(raw: any): DiagnosticToolConfig {
  return {
    id: raw.id ?? raw.slug,
    slug: raw.slug,
    name: raw.name,
    nameEn: raw.nameEn ?? raw.name_en,
    description: raw.description,
    icon: raw.icon,
    questions: raw.questions,
    scaleType: raw.scaleType ?? raw.scale_type,
    scaleOptions: raw.scaleOptions ?? raw.scale_options,
    categoryMap: raw.categoryMap ?? raw.category_map,
    reverseItems: raw.reverseItems ?? raw.reverse_items ?? [],
    maxScale: raw.maxScale ?? raw.max_scale,
    interpretations: raw.interpretations,
    chartConfig: raw.chartConfig ?? raw.chart_config ?? {},
    patternConfig: raw.patternConfig ?? raw.pattern_config,
    zone: raw.zone,
    zoneLabel: raw.zoneLabel ?? raw.zone_label,
    zoneOrder: raw.zoneOrder ?? raw.zone_order ?? 0,
    isActive: raw.isActive ?? raw.is_active ?? true,
    sortOrder: raw.sortOrder ?? raw.sort_order ?? 0,
  };
}

// Zone assignments for legacy seed files that don't have zone fields
const ZONE_DEFAULTS: Record<string, { zone: string; zoneLabel: string; zoneOrder: number }> = {
  "bfi2": { zone: "A", zoneLabel: "Being", zoneOrder: 1 },
  "ta-egogram": { zone: "B", zoneLabel: "Relating", zoneOrder: 2 },
  "nlp-vak": { zone: "B", zoneLabel: "Relating", zoneOrder: 1 },
  "conflict-style": { zone: "C", zoneLabel: "Doing", zoneOrder: 1 },
};

// Supabase 연결 전까지 JSON 시드 파일에서 직접 로딩
const tools: DiagnosticToolConfig[] = [
  taEgogram, bfi2, nlpVak, conflictStyle,
  kwsd, leadership, followership, attitude,
].map((raw) => {
  const tool = normalize(raw);
  // Apply zone defaults for legacy tools
  if (!tool.zone && ZONE_DEFAULTS[tool.slug]) {
    const defaults = ZONE_DEFAULTS[tool.slug];
    tool.zone = defaults.zone as DiagnosticToolConfig["zone"];
    tool.zoneLabel = defaults.zoneLabel;
    tool.zoneOrder = defaults.zoneOrder;
  }
  return tool;
});

export function getAllTools(): DiagnosticToolConfig[] {
  return tools.filter((t) => t.isActive);
}

export function getToolBySlug(slug: string): DiagnosticToolConfig | undefined {
  return tools.find((t) => t.slug === slug && t.isActive);
}
