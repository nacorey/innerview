"use client";

import { getAllTools } from "@/lib/utils/tool-loader";
import Link from "next/link";

export default function AdminDashboard() {
  const tools = getAllTools();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <p className="mt-1 text-sm text-foreground/50">
          진단 도구 플랫폼 관리
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-foreground/10 p-5">
          <div className="text-sm text-foreground/50">활성 도구</div>
          <div className="mt-1 text-3xl font-bold">{tools.length}</div>
        </div>
        <div className="rounded-xl border border-foreground/10 p-5">
          <div className="text-sm text-foreground/50">총 문항 수</div>
          <div className="mt-1 text-3xl font-bold">
            {tools.reduce((s, t) => s + t.questions.length, 0)}
          </div>
        </div>
        <div className="rounded-xl border border-foreground/10 p-5">
          <div className="text-sm text-foreground/50">총 사용자</div>
          <div className="mt-1 text-3xl font-bold text-foreground/30">—</div>
          <div className="text-xs text-foreground/30">Supabase 연결 후 표시</div>
        </div>
        <div className="rounded-xl border border-foreground/10 p-5">
          <div className="text-sm text-foreground/50">총 진단 완료</div>
          <div className="mt-1 text-3xl font-bold text-foreground/30">—</div>
          <div className="text-xs text-foreground/30">Supabase 연결 후 표시</div>
        </div>
      </div>

      {/* 빠른 링크 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/results"
          className="rounded-xl border border-foreground/10 p-6 transition-colors hover:border-coral-brand/30 hover:bg-coral-brand/5"
        >
          <div className="text-2xl">📊</div>
          <h3 className="mt-2 font-bold">결과/통계</h3>
          <p className="mt-1 text-xs text-foreground/50">참가자 결과 조회 및 통계 분석</p>
        </Link>
        <Link
          href="/admin/tools"
          className="rounded-xl border border-foreground/10 p-6 transition-colors hover:border-coral-brand/30 hover:bg-coral-brand/5"
        >
          <div className="text-2xl">🔧</div>
          <h3 className="mt-2 font-bold">도구 관리</h3>
          <p className="mt-1 text-xs text-foreground/50">진단 도구 ON/OFF 및 순서 관리</p>
        </Link>
        <Link
          href="/admin/workshops"
          className="rounded-xl border border-foreground/10 p-6 transition-colors hover:border-coral-brand/30 hover:bg-coral-brand/5"
        >
          <div className="text-2xl">🎓</div>
          <h3 className="mt-2 font-bold">워크숍 관리</h3>
          <p className="mt-1 text-xs text-foreground/50">워크숍 생성 및 참가자 관리</p>
        </Link>
      </div>
    </div>
  );
}
