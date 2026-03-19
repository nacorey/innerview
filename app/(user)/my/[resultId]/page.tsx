"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getToolBySlug } from "@/lib/utils/tool-loader";
import { ResultScreen } from "@/components/diagnostic/ResultScreen";
import Link from "next/link";

interface StoredResult {
  id: string;
  toolSlug: string;
  toolName: string;
  toolIcon: string;
  scores: Record<string, number>;
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

  return (
    <div>
      <ResultScreen config={config} scores={result.scores} patternType={result.patternType} />
      <div className="mx-auto max-w-3xl px-4 pb-12 flex justify-center gap-3">
        <Link
          href="/my"
          className="rounded-lg border border-foreground/10 px-5 py-2.5 text-sm font-medium text-foreground/60 hover:bg-foreground/5"
        >
          마이페이지로
        </Link>
        <Link
          href={`/tools/${result.toolSlug}`}
          className="rounded-lg bg-amber-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-brand/90"
        >
          다시 진단하기
        </Link>
      </div>
    </div>
  );
}
