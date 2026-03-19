"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminWorkshopDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/workshops" className="text-sm text-foreground/40 hover:text-foreground">
          ← 워크숍 목록
        </Link>
        <h1 className="mt-2 text-2xl font-bold">워크숍 상세</h1>
        <p className="mt-1 text-sm text-foreground/50">ID: {id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 참가자 */}
        <div className="rounded-xl border border-foreground/10 p-6">
          <h3 className="font-bold mb-4">참가자 목록</h3>
          <div className="py-8 text-center text-sm text-foreground/30">
            Supabase 연결 후 참가자가 표시됩니다
          </div>
        </div>

        {/* 결과 집계 */}
        <div className="rounded-xl border border-foreground/10 p-6">
          <h3 className="font-bold mb-4">진단 결과 집계</h3>
          <div className="py-8 text-center text-sm text-foreground/30">
            Supabase 연결 후 결과가 표시됩니다
          </div>
        </div>
      </div>
    </div>
  );
}
