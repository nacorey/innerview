"use client";

import { useState } from "react";
import { getAllTools } from "@/lib/utils/tool-loader";
import Link from "next/link";

export default function AdminToolsPage() {
  const tools = getAllTools();
  const [toolStates, setToolStates] = useState<Record<string, boolean>>(
    Object.fromEntries(tools.map((t) => [t.slug, t.isActive]))
  );

  const toggleTool = (slug: string) => {
    setToolStates((prev) => ({ ...prev, [slug]: !prev[slug] }));
    // Supabase 연결 후 DB 업데이트 추가
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">도구 관리</h1>
          <p className="mt-1 text-sm text-foreground/50">진단 도구 ON/OFF 및 순서 관리</p>
        </div>
        <Link
          href="/admin/tools/new"
          className="rounded-lg bg-coral-brand px-4 py-2 text-sm font-medium text-white hover:bg-coral-brand/90"
        >
          + 새 도구
        </Link>
      </div>

      <div className="space-y-3">
        {tools.map((tool, idx) => (
          <div
            key={tool.slug}
            className="flex items-center gap-4 rounded-xl border border-foreground/10 p-4"
          >
            {/* 순서 */}
            <span className="text-sm font-mono text-foreground/30 w-6 text-center">
              {idx + 1}
            </span>

            {/* 아이콘 + 정보 */}
            <span className="text-2xl">{tool.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{tool.name}</div>
              <div className="flex items-center gap-3 text-xs text-foreground/50">
                <span>{tool.questions.length}문항</span>
                <span>{tool.scaleType}</span>
                <span>{Object.keys(tool.interpretations).length}차원</span>
              </div>
            </div>

            {/* ON/OFF 토글 */}
            <button
              onClick={() => toggleTool(tool.slug)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                toolStates[tool.slug] ? "bg-teal-brand" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  toolStates[tool.slug] ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>

            {/* 편집 */}
            <Link
              href={`/admin/tools/${tool.slug}`}
              className="rounded-lg border border-foreground/10 px-3 py-1.5 text-xs text-foreground/50 hover:bg-foreground/5"
            >
              편집
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
