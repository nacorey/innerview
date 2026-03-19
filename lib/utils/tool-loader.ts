import type { DiagnosticToolConfig } from "@/lib/types/diagnostic";

import taEgogram from "@/data/seed/ta-egogram.json";
import bfi2 from "@/data/seed/bfi2.json";
import nlpVak from "@/data/seed/nlp-vak.json";
import conflictStyle from "@/data/seed/conflict-style.json";

// Supabase 연결 전까지 JSON 시드 파일에서 직접 로딩
const tools = [taEgogram, bfi2, nlpVak, conflictStyle] as unknown as DiagnosticToolConfig[];

export function getAllTools(): DiagnosticToolConfig[] {
  return tools.filter((t) => t.isActive);
}

export function getToolBySlug(slug: string): DiagnosticToolConfig | undefined {
  return tools.find((t) => t.slug === slug && t.isActive);
}
