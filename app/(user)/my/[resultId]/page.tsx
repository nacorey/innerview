"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { getToolBySlug, getAllTools } from "@/lib/utils/tool-loader";
import { calculateScores } from "@/lib/scoring/engine";
import { detectPattern } from "@/lib/utils/pattern-detect";
import { ResultScreen } from "@/components/diagnostic/ResultScreen";
import type { SplitScore, BurnoutRisk } from "@/lib/types/zone";
import type { DiagnosticToolConfig } from "@/lib/types/diagnostic";
import Link from "next/link";

interface StoredResult {
  id: string;
  toolSlug: string;
  answers?: Record<number, number | Record<string, number>>;
  scores: Record<string, number>;
  subScores?: Record<string, SplitScore>;
  burnoutRisk?: BurnoutRisk[];
  patternType?: string;
}

function recalculate(config: DiagnosticToolConfig, answers: Record<number, number | Record<string, number>>) {
  const result = calculateScores(config, answers);
  let patternType: string | undefined;
  if (config.patternConfig) {
    patternType = detectPattern(config.patternConfig.type, result.scores);
  }
  return { scores: result.scores, subScores: result.subScores, burnoutRisk: result.burnoutRisk, patternType };
}

export default function ResultDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const resultId = params.resultId as string;
  const isDb = searchParams.get("src") === "db";
  const { user } = useAuth();

  const [result, setResult] = useState<StoredResult | null>(null);
  const [toolConfig, setToolConfig] = useState<DiagnosticToolConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 1. DB에서 조회 시도
      if (isDb && user) {
        const supabase = createClient();
        if (supabase) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data } = await (supabase.from("results") as any)
            .select("id, tool_id, answers, scores, sub_scores, pattern_type")
            .eq("id", resultId)
            .single();

          if (data) {
            const tools = getAllTools();
            const tool = tools.find((t) => t.id === data.tool_id);
            if (tool) {
              setToolConfig(tool);
              // answers로 재계산
              if (data.answers && typeof data.answers === "object") {
                const calc = recalculate(tool, data.answers);
                setResult({ id: data.id, toolSlug: tool.slug, answers: data.answers, ...calc });
              } else {
                setResult({
                  id: data.id, toolSlug: tool.slug,
                  scores: data.scores, patternType: data.pattern_type,
                });
              }
              setLoading(false);
              return;
            }
          }
        }
      }

      // 2. localStorage에서 조회
      try {
        const raw = localStorage.getItem("diag_results");
        const results = raw ? JSON.parse(raw) : [];
        const found = results.find((r: { id: string }) => r.id === resultId);
        if (found) {
          const config = getToolBySlug(found.toolSlug);
          setToolConfig(config ?? null);

          if (config && found.answers && Object.keys(found.answers).length > 0) {
            const calc = recalculate(config, found.answers);
            setResult({ id: found.id, toolSlug: found.toolSlug, answers: found.answers, ...calc });
          } else {
            setResult(found);
          }
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }

    load();
  }, [resultId, isDb, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-brand border-t-transparent" />
      </div>
    );
  }

  if (!result || !toolConfig) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground/70">결과를 찾을 수 없습니다</p>
        <Link href="/my" className="mt-4 text-sm text-amber-brand hover:underline">
          마이페이지로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ResultScreen
        config={toolConfig}
        scores={result.scores}
        subScores={result.subScores}
        burnoutRisk={result.burnoutRisk}
        patternType={result.patternType}
      />
      <div className="mx-auto max-w-[720px] px-6 pb-12 flex justify-center gap-3">
        <Link
          href="/my"
          className="rounded-xl border border-edge px-5 py-2.5 text-sm font-medium text-ink-secondary hover:bg-surface-sunken transition-colors"
        >
          마이페이지로
        </Link>
        <Link
          href={`/tools/${result.toolSlug}`}
          className="rounded-xl bg-amber-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-brand/90 transition-colors"
        >
          다시 진단하기
        </Link>
      </div>
    </div>
  );
}
