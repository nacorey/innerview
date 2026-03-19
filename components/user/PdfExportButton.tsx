"use client";

export function PdfExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm font-bold text-white bg-gradient-to-br from-[#3498DB] to-[#2980B9] rounded-[14px] px-8 py-3.5 shadow-[0_4px_16px_rgba(52,152,219,0.3)] transition-all hover:-translate-y-0.5 print:hidden"
    >
      🖨️ PDF 저장 / 인쇄
    </button>
  );
}
