"use client";

import { useParams } from "next/navigation";
import { getToolBySlug } from "@/lib/utils/tool-loader";
import { DiagnosticRunner } from "@/components/diagnostic/DiagnosticRunner";
import Link from "next/link";

function saveResultToLocal(
  config: { slug: string; name: string; icon: string },
  result: { scores: Record<string, number>; patternType?: string; completedAt: string }
) {
  try {
    const raw = localStorage.getItem("diag_results");
    const results = raw ? JSON.parse(raw) : [];
    results.unshift({
      id: crypto.randomUUID(),
      toolSlug: config.slug,
      toolName: config.name,
      toolIcon: config.icon,
      scores: result.scores,
      patternType: result.patternType,
      completedAt: result.completedAt,
    });
    localStorage.setItem("diag_results", JSON.stringify(results));
  } catch {
    // 저장 실패 무시
  }
}

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug as string;
  const config = getToolBySlug(slug);

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
      onComplete={(result) => {
        saveResultToLocal(config, result);
      }}
    />
  );
}
