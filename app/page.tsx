import Link from "next/link";
import { getAllTools } from "@/lib/utils/tool-loader";
import { ZONE_CONFIG } from "@/lib/types/zone";
import type { Zone } from "@/lib/types/zone";
import type { DiagnosticToolConfig } from "@/lib/types/diagnostic";

const ZONE_ORDER: Zone[] = ["A", "B", "C", "M"];

const ZONE_COLORS: Record<Zone, { border: string; bg: string; text: string; accent: string }> = {
  A: { border: "border-purple-200", bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-600" },
  B: { border: "border-teal-200", bg: "bg-teal-50", text: "text-teal-700", accent: "bg-teal-600" },
  C: { border: "border-orange-200", bg: "bg-orange-50", text: "text-orange-700", accent: "bg-orange-600" },
  M: { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-600" },
};

function ToolCard({ tool }: { tool: DiagnosticToolConfig }) {
  const questionCount = tool.questions.length;
  const estimatedMin = Math.ceil(questionCount * 0.3);
  const categoryCount = Object.keys(tool.interpretations).filter((k) => !k.startsWith("_")).length;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-edge bg-surface-raised p-4 transition-all hover:border-amber-brand/30 hover:shadow-[0_4px_20px_rgba(243,156,18,0.06)]"
    >
      <span className="text-3xl shrink-0">{tool.icon}</span>
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-bold text-ink group-hover:text-amber-brand transition-colors">
          {tool.name}
        </h4>
        {tool.nameEn && (
          <p className="text-[11px] text-ink-tertiary font-display">{tool.nameEn}</p>
        )}
        <p className="mt-1 text-xs text-ink-secondary line-clamp-2">{tool.description}</p>
        <div className="mt-2 flex gap-3 text-[11px] text-ink-muted font-display">
          <span>{questionCount}문항</span>
          <span>~{estimatedMin}분</span>
          <span>{categoryCount}차원</span>
        </div>
      </div>
      <span className="text-ink-muted/40 group-hover:text-amber-brand transition-colors shrink-0">→</span>
    </Link>
  );
}

export default function Home() {
  const tools = getAllTools();

  // Group tools by zone
  const zoneGroups: Record<Zone, DiagnosticToolConfig[]> = { A: [], B: [], C: [], M: [] };
  for (const tool of tools) {
    const zone = (tool.zone ?? "C") as Zone;
    zoneGroups[zone].push(tool);
  }
  // Sort within zones by zoneOrder
  for (const zone of ZONE_ORDER) {
    zoneGroups[zone].sort((a, b) => (a.zoneOrder ?? 0) - (b.zoneOrder ?? 0));
  }

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative bg-surface-dark grain">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-ink-inverse">
            InnerView
          </h1>
          <p className="mt-3 text-sm text-ink-muted tracking-[6px] uppercase font-display">
            나를 들여다보는 시간
          </p>
          <p className="mt-5 text-lg text-ink-inverse/60">
            BEAM 프레임워크로 나를 더 깊이 이해하세요
          </p>
          <div className="mt-6 flex justify-center gap-3 text-xs">
            {ZONE_ORDER.map((z) => {
              const info = ZONE_CONFIG[z];
              return (
                <span key={z} className="rounded-full border border-ink-inverse/20 px-3 py-1 text-ink-inverse/60">
                  <strong className="text-ink-inverse/80">{info.beam}</strong> {info.labelKo} — {info.questionKo}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Zone-grouped tool cards */}
      <section className="mx-auto max-w-4xl px-6 py-14 space-y-10">
        {ZONE_ORDER.map((zone) => {
          const info = ZONE_CONFIG[zone];
          const colors = ZONE_COLORS[zone];
          const zoneTools = zoneGroups[zone];
          if (zoneTools.length === 0) return null;

          return (
            <div key={zone}>
              {/* Zone header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-lg ${colors.accent} flex items-center justify-center`}>
                  <span className="text-white text-sm font-black font-display">{info.beam}</span>
                </div>
                <div>
                  <h2 className={`text-lg font-black ${colors.text}`}>
                    {info.beam}: {info.label} — {info.labelKo}
                  </h2>
                  <p className="text-xs text-ink-muted">{info.questionKo}</p>
                </div>
              </div>

              {/* Tool cards in this zone */}
              <div className={`rounded-2xl ${colors.bg} ${colors.border} border p-4 space-y-3`}>
                {zoneTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Integrated Profile CTA */}
        <div className="rounded-2xl border-2 border-dashed border-edge p-8 text-center">
          <h3 className="text-lg font-black text-ink">📊 통합 프로필</h3>
          <p className="text-sm text-ink-secondary mt-2">
            2개 이상의 Zone에서 진단을 완료하면 도구 간 교차 해석이 생성됩니다
          </p>
          <Link
            href="/my/integrated"
            className="mt-4 inline-block rounded-xl bg-surface-dark text-ink-inverse text-sm font-bold px-6 py-2.5 hover:bg-surface-dark-2 transition-colors"
          >
            통합 프로필 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
