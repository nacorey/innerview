"use client";

import { useState } from "react";
import { getAllTools } from "@/lib/utils/tool-loader";
import { BarChartWrapper } from "@/components/charts/BarChartWrapper";

export default function AdminResultsPage() {
  const tools = getAllTools();
  const [selectedTool, setSelectedTool] = useState<string>("all");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">결과 조회 / 통계</h1>
        <p className="mt-1 text-sm text-foreground/50">참가자 진단 결과를 조회하고 통계를 확인합니다</p>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedTool}
          onChange={(e) => setSelectedTool(e.target.value)}
          className="rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm"
        >
          <option value="all">전체 도구</option>
          {tools.map((t) => (
            <option key={t.slug} value={t.slug}>{t.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="참가자 검색..."
          className="rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm"
        />
        <button className="rounded-lg border border-foreground/10 px-3 py-2 text-sm text-foreground/60 hover:bg-foreground/5">
          CSV 내보내기
        </button>
      </div>

      {/* 결과 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-foreground/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10 bg-foreground/5">
              <th className="px-4 py-3 text-left font-medium text-foreground/60">참가자</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/60">도구</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/60">워크숍</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/60">완료일시</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/60">주요 점수</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/60">패턴</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-foreground/30">
                Supabase 연결 후 결과가 표시됩니다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 통계 패널 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-foreground/10 p-6">
          <h3 className="font-bold mb-4">도구별 진단 현황</h3>
          <div className="flex flex-col items-center justify-center py-8 text-foreground/30 text-sm">
            데이터 연결 후 차트 표시
          </div>
        </div>
        <div className="rounded-xl border border-foreground/10 p-6">
          <h3 className="font-bold mb-4">패턴 유형 분포</h3>
          <div className="flex flex-col items-center justify-center py-8 text-foreground/30 text-sm">
            데이터 연결 후 차트 표시
          </div>
        </div>
      </div>
    </div>
  );
}
