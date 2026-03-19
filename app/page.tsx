import Link from "next/link";
import { getAllTools } from "@/lib/utils/tool-loader";

export default function Home() {
  const tools = getAllTools();

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
            데이터 기반 자기진단으로 나를 더 깊이 이해하세요
          </p>
        </div>
      </section>

      {/* 도구 카드 목록 */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl font-black text-ink mb-8">진단 도구</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const questionCount = tool.questions.length;
            const estimatedMin = Math.ceil(questionCount * 0.3);
            const categoryCount = Object.keys(tool.interpretations).length;

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group rounded-2xl border border-edge bg-surface-raised p-6 transition-all hover:border-amber-brand/30 hover:shadow-[0_8px_32px_rgba(243,156,18,0.08)]"
              >
                <span className="text-4xl">{tool.icon}</span>
                <h3 className="mt-3 text-lg font-bold text-ink group-hover:text-amber-brand transition-colors">
                  {tool.name}
                </h3>
                {tool.nameEn && (
                  <p className="text-xs text-ink-tertiary font-display">{tool.nameEn}</p>
                )}
                <p className="mt-2 text-sm text-ink-secondary line-clamp-2">
                  {tool.description}
                </p>
                <div className="mt-4 flex gap-4 text-xs text-ink-muted font-display">
                  <span>{questionCount}문항</span>
                  <span>~{estimatedMin}분</span>
                  <span>{categoryCount}차원</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
