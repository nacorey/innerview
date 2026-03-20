"use client";

import { useParams } from "next/navigation";
import { getToolBySlug } from "@/lib/utils/tool-loader";
import { DiagnosticRunner } from "@/components/diagnostic/DiagnosticRunner";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function saveResultToLocal(
  config: { slug: string; name: string; icon: string },
  result: {
    answers: Record<number, number | Record<string, number>>;
    scores: Record<string, number>;
    subScores?: Record<string, { drive: number; behavioral: number; total: number }>;
    patternType?: string;
    completedAt: string;
  }
) {
  try {
    const raw = localStorage.getItem("diag_results");
    const results = raw ? JSON.parse(raw) : [];
    results.unshift({
      id: crypto.randomUUID(),
      toolSlug: config.slug,
      toolName: config.name,
      toolIcon: config.icon,
      answers: result.answers,
      scores: result.scores,
      subScores: result.subScores,
      patternType: result.patternType,
      completedAt: result.completedAt,
    });
    localStorage.setItem("diag_results", JSON.stringify(results));
  } catch {
    // 저장 실패 무시
  }
}

async function saveResultToSupabase(
  userId: string,
  toolId: string,
  result: {
    answers: Record<number, number | Record<string, number>>;
    scores: Record<string, number>;
    subScores?: Record<string, { drive: number; behavioral: number; total: number }>;
    patternType?: string;
    completedAt: string;
  }
) {
  const supabase = createClient();
  if (!supabase) return;

  const row = {
    user_id: userId,
    tool_id: toolId,
    answers: result.answers as unknown as import("@/lib/types/database").Json,
    scores: result.scores as unknown as import("@/lib/types/database").Json,
    sub_scores: (result.subScores ?? null) as unknown as import("@/lib/types/database").Json,
    pattern_type: result.patternType ?? null,
    completed_at: result.completedAt,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("results") as any).insert(row);

  if (error) {
    console.error("Supabase 저장 실패:", error.message);
  }
}

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug as string;
  const config = getToolBySlug(slug);
  const { user } = useAuth();

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground/70">도구를 찾을 수 없습니다</p>
        <Link href="/" className="mt-4 text-sm text-amber-brand hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <DiagnosticRunner
      config={config}
      userId={user?.id}
      onComplete={(result) => {
        // 1. localStorage (항상)
        saveResultToLocal(config, result);

        // 2. Supabase (로그인 시)
        if (user) {
          saveResultToSupabase(user.id, config.id, result);
        }
      }}
    />
  );
}
