import Link from "next/link";
import { getAllTools } from "@/lib/utils/tool-loader";

export default function Home() {
  const tools = getAllTools();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-brand/10 to-teal-brand/10 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            InnerView
          </h1>
          <p className="mt-2 text-sm text-foreground/40 tracking-widest">나를 들여다보는 시간</p>
          <p className="mt-4 text-lg text-foreground/70">
            데이터 기반 자기진단으로 나를 더 깊이 이해하세요
          </p>
        </div>
      </section>

      {/* 도구 카드 목록 */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">진단 도구</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const questionCount = tool.questions.length;
            const estimatedMin = Math.ceil(questionCount * 0.3);
            const categoryCount = Object.keys(tool.interpretations).length;

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group rounded-xl border border-foreground/10 p-6 transition-all hover:border-amber-brand/30 hover:shadow-lg hover:shadow-amber-brand/5"
              >
                <span className="text-4xl">{tool.icon}</span>
                <h3 className="mt-3 text-lg font-bold group-hover:text-amber-brand">
                  {tool.name}
                </h3>
                {tool.nameEn && (
                  <p className="text-xs text-foreground/40">{tool.nameEn}</p>
                )}
                <p className="mt-2 text-sm text-foreground/60 line-clamp-2">
                  {tool.description}
                </p>
                <div className="mt-4 flex gap-4 text-xs text-foreground/40">
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
