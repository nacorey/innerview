"use client";

import { useState } from "react";

interface WorkshopForm {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function AdminWorkshopsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<WorkshopForm>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleCreate = () => {
    // Supabase 연결 후 DB 저장
    alert("Supabase 연결 후 워크숍이 생성됩니다");
    setShowCreate(false);
    setForm({ name: "", description: "", startDate: "", endDate: "" });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">워크숍 관리</h1>
          <p className="mt-1 text-sm text-foreground/50">워크숍 생성 및 참가자 관리</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-coral-brand px-4 py-2 text-sm font-medium text-white hover:bg-coral-brand/90"
        >
          + 새 워크숍
        </button>
      </div>

      {/* 생성 폼 */}
      {showCreate && (
        <div className="rounded-xl border border-coral-brand/20 bg-coral-brand/5 p-6 space-y-4">
          <h3 className="font-bold">새 워크숍 만들기</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-foreground/50 mb-1">워크숍 이름 *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm"
                placeholder="예: 2026 상반기 리더십 워크숍"
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/50 mb-1">설명</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm"
                placeholder="워크숍에 대한 간단한 설명"
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/50 mb-1">시작일</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/50 mb-1">종료일</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!form.name}
              className="rounded-lg bg-coral-brand px-4 py-2 text-sm font-medium text-white hover:bg-coral-brand/90 disabled:opacity-40"
            >
              생성
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="rounded-lg border border-foreground/10 px-4 py-2 text-sm text-foreground/60 hover:bg-foreground/5"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 워크숍 목록 */}
      <div className="rounded-xl border border-foreground/10 p-10 text-center text-foreground/30">
        Supabase 연결 후 워크숍 목록이 표시됩니다
      </div>
    </div>
  );
}
