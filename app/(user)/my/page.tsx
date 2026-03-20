"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { getAllTools } from "@/lib/utils/tool-loader";
import { calculateScores } from "@/lib/scoring/engine";
import { detectPattern } from "@/lib/utils/pattern-detect";
import Link from "next/link";
import { useState, useEffect } from "react";

interface StoredResult {
  id: string;
  toolSlug: string;
  toolName: string;
  toolIcon: string;
  answers?: Record<number, number | Record<string, number>>;
  scores: Record<string, number>;
  patternType?: string;
  completedAt: string;
  source: "local" | "db";
}

function getLocalResults(): StoredResult[] {
  try {
    const raw = localStorage.getItem("diag_results");
    const results = raw ? JSON.parse(raw) : [];
    return results.map((r: Record<string, unknown>) => ({ ...r, source: "local" }));
  } catch {
    return [];
  }
}

async function getDbResults(userId: string): Promise<StoredResult[]> {
  const supabase = createClient();
  if (!supabase) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("results") as any)
    .select("id, tool_id, answers, scores, sub_scores, pattern_type, completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error || !data) return [];

  const tools = getAllTools();

  return (data as Record<string, unknown>[]).map((row) => {
    const tool = tools.find((t) => t.id === row.tool_id);
    const toolSlug = tool?.slug ?? "";
    const toolConfig = tool;

    // answers가 있으면 현재 로직으로 재계산
    let scores = row.scores as Record<string, number>;
    let patternType = row.pattern_type as string | undefined;

    if (toolConfig && row.answers && typeof row.answers === "object") {
      const answers = row.answers as Record<number, number | Record<string, number>>;
      const recalculated = calculateScores(toolConfig, answers);
      scores = recalculated.scores;
      if (toolConfig.patternConfig) {
        patternType = detectPattern(toolConfig.patternConfig.type, scores);
      }
    }

    return {
      id: row.id as string,
      toolSlug,
      toolName: tool?.name ?? "알 수 없는 도구",
      toolIcon: tool?.icon ?? "📋",
      answers: row.answers as Record<number, number | Record<string, number>>,
      scores,
      patternType,
      completedAt: row.completed_at as string,
      source: "db" as const,
    };
  });
}

export default function MyPage() {
  const { user, profile, isLoading } = useAuth();
  const [results, setResults] = useState<StoredResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user) {
        // 로그인: DB 우선, localStorage 병합 (중복 제거)
        const dbResults = await getDbResults(user.id);
        const localResults = getLocalResults();
        const dbIds = new Set(dbResults.map((r) => r.completedAt));
        const uniqueLocal = localResults.filter((r) => !dbIds.has(r.completedAt));
        setResults([...dbResults, ...uniqueLocal]);
      } else {
        setResults(getLocalResults());
      }
      setLoading(false);
    }
    if (!isLoading) load();
  }, [user, isLoading]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* 프로필 */}
      <div className="flex items-center gap-4 rounded-xl border border-foreground/10 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-brand/10 text-2xl font-bold text-teal-brand">
          {profile?.display_name?.[0] ?? user?.email?.[0] ?? "G"}
        </div>
        <div>
          <h1 className="text-xl font-bold">
            {profile?.display_name ?? user?.email ?? "게스트"}
          </h1>
          <p className="text-sm text-foreground/50">
            {user ? user.email : "로그인하면 결과가 영구 저장됩니다"}
          </p>
        </div>
      </div>

      {/* 진단 이력 */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">진단 이력</h2>

        {results.length === 0 ? (
          <div className="rounded-xl border border-foreground/10 p-10 text-center text-foreground/40">
            <p>아직 완료된 진단이 없습니다</p>
            <Link
              href="/"
              className="mt-3 inline-block text-sm text-amber-brand hover:underline"
            >
              진단 시작하기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => {
              const topScore = Object.entries(result.scores).sort(
                ([, a], [, b]) => b - a
              )[0];
              return (
                <Link
                  key={result.id}
                  href={`/my/${result.id}${result.source === "db" ? "?src=db" : ""}`}
                  className="flex items-center gap-4 rounded-xl border border-foreground/10 p-4 transition-colors hover:bg-foreground/5"
                >
                  <span className="text-3xl">{result.toolIcon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{result.toolName}</div>
                    <div className="flex items-center gap-3 text-xs text-foreground/50">
                      <span>
                        {new Date(result.completedAt).toLocaleDateString("ko-KR")}
                      </span>
                      {result.patternType && (
                        <span className="rounded-full bg-amber-brand/10 px-2 py-0.5 text-amber-brand">
                          {result.patternType}
                        </span>
                      )}
                      {topScore && (
                        <span>
                          최고: {topScore[0]} ({topScore[1]}점)
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-foreground/30">→</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
