"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { getToolBySlug } from "@/lib/utils/tool-loader";
import Link from "next/link";

export default function AdminToolEditPage() {
  const params = useParams();
  const id = params.id as string;
  const config = getToolBySlug(id);
  const [jsonText, setJsonText] = useState(
    config ? JSON.stringify(config, null, 2) : ""
  );
  const [error, setError] = useState<string | null>(null);

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-foreground/50">도구를 찾을 수 없습니다</p>
        <Link href="/admin/tools" className="mt-4 text-sm text-coral-brand hover:underline">
          목록으로
        </Link>
      </div>
    );
  }

  const handleValidate = () => {
    try {
      JSON.parse(jsonText);
      setError(null);
      alert("JSON 유효성 검사 통과");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleSave = () => {
    try {
      JSON.parse(jsonText);
      setError(null);
      // Supabase 연결 후 DB 업데이트 추가
      alert("Supabase 연결 후 저장됩니다");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/tools" className="text-foreground/40 hover:text-foreground">
              ← 도구 목록
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold">
            <span className="mr-2">{config.icon}</span>
            {config.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleValidate}
            className="rounded-lg border border-foreground/10 px-4 py-2 text-sm text-foreground/60 hover:bg-foreground/5"
          >
            검증
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-coral-brand px-4 py-2 text-sm font-medium text-white hover:bg-coral-brand/90"
          >
            저장
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-foreground/10 p-4">
          <div className="text-xs text-foreground/40">Slug</div>
          <div className="mt-1 font-mono text-sm">{config.slug}</div>
        </div>
        <div className="rounded-xl border border-foreground/10 p-4">
          <div className="text-xs text-foreground/40">문항 수</div>
          <div className="mt-1 text-sm font-bold">{config.questions.length}</div>
        </div>
        <div className="rounded-xl border border-foreground/10 p-4">
          <div className="text-xs text-foreground/40">척도</div>
          <div className="mt-1 text-sm">{config.scaleType}</div>
        </div>
      </div>

      {/* JSON 편집기 */}
      <div>
        <h2 className="mb-2 font-bold">JSON 설정</h2>
        {error && (
          <div className="mb-2 rounded-lg bg-red-danger/10 p-3 text-sm text-red-danger">
            {error}
          </div>
        )}
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="h-[500px] w-full rounded-xl border border-foreground/10 bg-foreground/5 p-4 font-mono text-xs leading-relaxed focus:border-coral-brand/30 focus:outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
