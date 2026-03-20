"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getToolBySlug } from "@/lib/utils/tool-loader";
import { calculateScores } from "@/lib/scoring/engine";
import { detectPattern } from "@/lib/utils/pattern-detect";
import { ResultScreen } from "@/components/diagnostic/ResultScreen";
import type { SplitScore, BurnoutRisk } from "@/lib/types/zone";
import Link from "next/link";

interface StoredResult {
  id: string;
  toolSlug: string;
  toolName: string;
  toolIcon: string;
  answers?: Record<number, number | Record<string, number>>;
  scores: Record<string, number>;
  subScores?: Record<string, SplitScore>;
  burnoutRisk?: BurnoutRisk[];
  patternType?: string;
  completedAt: string;
}

export default function ResultDetailPage() {
  const params = useParams();
  const resultId = params.resultId as string;
  const [result, setResult] = useState<StoredResult | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("diag_results");
      const results: StoredResult[] = raw ? JSON.parse(raw) : [];
      const found = results.find((r) => r.id === resultId);
      setResult(found ?? null);
    } catch {
      setResult(null);
    }
  }, [resultId]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground/70">결과를 찾을 수 없습니다</p>
        <Link href="/my" className="mt-4 text-sm text-amber-brand hover:underline">
          마이페이지로 돌아가기
        </Link>
      </div>
    );
  }

  const config = getToolBySlug(result.toolSlug);
  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground/70">도구 정보를 찾을 수 없습니다</p>
        <Link href="/my" className="mt-4 text-sm text-amber-brand hover:underline">
          마이페이지로 돌아가기
        </Link>
      </div>
    );
  }

  // answers가 있으면 현재 로직으로 재계산, 없으면 저장된 값 사용 (하위 호환)
  let scores = result.scores;
  let subScores = result.subScores;
  let burnoutRisk = result.burnoutRisk;
  let patternType = result.patternType;

  if (result.answers && Object.keys(result.answers).length > 0) {
    const recalculated = calculateScores(config, result.answers);
    scores = recalculated.scores;
    subScores = recalculated.subScores;
    burnoutRisk = recalculated.burnoutRisk;

    if (config.patternConfig) {
      patternType = detectPattern(config.patternConfig.type, scores);
    }
  }

  return (
    <div>
      <ResultScreen
        config={config}
        scores={scores}
        subScores={subScores}
        burnoutRisk={burnoutRisk}
        patternType={patternType}
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
