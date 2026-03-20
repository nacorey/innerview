"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { IntegratedProfile } from "@/components/user/IntegratedProfile";
import { generateIntegratedProfile } from "@/lib/scoring/integrated";
import type { IntegratedProfileResult } from "@/lib/scoring/integrated";
import type { SplitScore } from "@/lib/types/zone";
import Link from "next/link";

interface StoredResult {
  id: string;
  toolSlug: string;
  scores: Record<string, number>;
  subScores?: Record<string, SplitScore>;
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

export default function IntegratedProfilePage() {
  const { isLoading } = useAuth();
  const [profile, setProfile] = useState<IntegratedProfileResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const results = getStoredResults();
    if (results.length === 0) {
      setError("완료된 진단이 없습니다. 2개 이상의 Zone에서 진단을 완료해 주세요.");
      return;
    }

    const toolResults = results.map((r) => ({
      slug: r.toolSlug,
      scores: r.scores,
      subScores: r.subScores,
      patternType: r.patternType,
    }));

    const generated = generateIntegratedProfile(toolResults);
    if (!generated) {
      setError("통합 프로필 생성 조건: 2개 이상의 Zone에서 각 1개 이상 도구를 완료해야 합니다.");
      return;
    }

    setProfile(generated);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <Link href="/my" className="text-sm text-ink-muted hover:text-ink">
          ← 마이페이지
        </Link>
        <h1 className="text-2xl font-black text-ink mt-2">통합 프로필</h1>
        <p className="text-sm text-ink-secondary mt-1">
          3-Zone 프레임워크 기반 도구 간 교차 해석
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-edge p-10 text-center text-ink-muted">
          <p>{error}</p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm text-amber-brand hover:underline"
          >
            진단 시작하기
          </Link>
        </div>
      ) : profile ? (
        <IntegratedProfile profile={profile} />
      ) : null}
    </div>
  );
}
