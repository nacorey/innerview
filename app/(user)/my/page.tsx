"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { useState, useEffect } from "react";

interface StoredResult {
  id: string;
  toolSlug: string;
  toolName: string;
  toolIcon: string;
  scores: Record<string, number>;
  patternType?: string;
  completedAt: string;
}

function getStoredResults(): StoredResult[] {
  try {
    const raw = localStorage.getItem("diag_results");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function MyPage() {
  const { user, profile, isLoading } = useAuth();
  const [results, setResults] = useState<StoredResult[]>([]);

  useEffect(() => {
    setResults(getStoredResults());
  }, []);

  if (isLoading) {
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
                  href={`/my/${result.id}`}
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
