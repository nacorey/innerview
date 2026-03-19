import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";

  // Supabase 연결 후 실제 데이터 조회
  // 현재는 빈 CSV 반환
  const headers: Record<string, string> = {
    csv: "text/csv; charset=utf-8",
  };

  const csvHeader = "참가자,도구,워크숍,완료일시,점수,패턴\n";
  const bom = "\uFEFF"; // UTF-8 BOM (Excel 한글 깨짐 방지)

  return new NextResponse(bom + csvHeader, {
    headers: {
      "Content-Type": headers[format] ?? "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="results.${format}"`,
    },
  });
}
