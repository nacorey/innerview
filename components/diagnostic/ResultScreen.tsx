"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Target, TrendingUp, TrendingDown,
  MessageCircle, Crown, FileText,
  Printer, Check, Sprout,
} from "lucide-react";
import type { DiagnosticToolConfig, ChartType } from "@/lib/types/diagnostic";
import type { SplitScore, BurnoutRisk } from "@/lib/types/zone";

/* ── Dynamic chart imports ── */
const RadarChartWrapper = dynamic(
  () => import("@/components/charts/RadarChartWrapper").then((m) => m.RadarChartWrapper),
  { ssr: false }
);
const BarChartWrapper = dynamic(
  () => import("@/components/charts/BarChartWrapper").then((m) => m.BarChartWrapper),
  { ssr: false }
);
const LineChartWrapper = dynamic(
  () => import("@/components/charts/LineChartWrapper").then((m) => m.LineChartWrapper),
  { ssr: false }
);
const DonutChartWrapper = dynamic(
  () => import("@/components/charts/DonutChartWrapper").then((m) => m.DonutChartWrapper),
  { ssr: false }
);
const MatrixChart = dynamic(
  () => import("@/components/charts/MatrixChart").then((m) => m.MatrixChart),
  { ssr: false }
);
const GroupedBarChart = dynamic(
  () => import("@/components/charts/GroupedBarChart").then((m) => m.GroupedBarChart),
  { ssr: false }
);
const BurnoutRiskTable = dynamic(
  () => import("@/components/charts/BurnoutRiskTable").then((m) => m.BurnoutRiskTable),
  { ssr: false }
);
const HeatmapChart = dynamic(
  () => import("@/components/charts/HeatmapChart").then((m) => m.HeatmapChart),
  { ssr: false }
);

/* ── Scroll-reveal wrapper ── */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Chart renderer ── */
const defaultChartLabel: Record<string, string> = {
  line: "프로파일",
  radar: "레이더",
  bar: "점수 비교",
  donut: "비율 분석",
  matrix: "매트릭스",
  "grouped-bar": "욕구 vs 행동",
  "burnout-table": "강점 간극 분석",
  heatmap: "강점-태도 매트릭스",
};

function ChartRenderer({
  type,
  scores,
  config,
  subScores,
}: {
  type: ChartType;
  scores: Record<string, number>;
  config: DiagnosticToolConfig;
  subScores?: Record<string, SplitScore>;
}) {
  const { interpretations, chartConfig } = config;
  const maxScore = chartConfig.maxScore;
  switch (type) {
    case "radar":
      return <RadarChartWrapper scores={scores} interpretations={interpretations} maxScore={maxScore} />;
    case "bar":
      return <BarChartWrapper scores={scores} interpretations={interpretations} maxScore={maxScore} />;
    case "line":
      return <LineChartWrapper scores={scores} interpretations={interpretations} maxScore={maxScore} />;
    case "donut":
      return <DonutChartWrapper scores={scores} interpretations={interpretations} />;
    case "matrix":
      if (!chartConfig.axisLabels) return null;
      return (
        <MatrixChart
          scores={scores}
          interpretations={interpretations}
          maxScore={maxScore}
          axisLabels={chartConfig.axisLabels}
        />
      );
    case "grouped-bar":
      if (!subScores) return null;
      return <GroupedBarChart splitScores={subScores} />;
    case "burnout-table":
      if (!subScores) return null;
      return <BurnoutRiskTable splitScores={subScores} />;
    case "heatmap": {
      const hc = chartConfig.heatmapConfig;
      if (!hc) return null;
      return (
        <HeatmapChart
          scores={scores}
          xAxis={hc.xAxis}
          yAxis={hc.yAxis}
          criticalPairs={hc.criticalPairs}
        />
      );
    }
    default:
      return null;
  }
}

/* ── Props ── */
interface Props {
  config: DiagnosticToolConfig;
  scores: Record<string, number>;
  subScores?: Record<string, SplitScore>;
  burnoutRisk?: BurnoutRisk[];
  patternType?: string;
}

/* ════════════════════════════════════════════════════════════
   ResultScreen
   ════════════════════════════════════════════════════════════ */
export function ResultScreen({ config, scores, subScores, burnoutRisk, patternType }: Props) {
  const sortedCategories = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const categoryKeys = Object.keys(config.interpretations);
  const maxCat = sortedCategories[0]?.[0];
  const minCat = sortedCategories[sortedCategories.length - 1]?.[0];
  const maxScore = config.chartConfig.maxScore;
  const pat = patternType ? config.patternConfig?.patterns?.[patternType] : undefined;

  return (
    <div className="bg-surface">
      {/* ═══ HERO ═══ */}
      <section className="bg-surface-dark grain">
        <div className="max-w-[720px] mx-auto px-6 pt-16 pb-14 text-center">
          <p
            className="text-ink-muted text-[11px] tracking-[5px] uppercase mb-4 font-display"
            style={{ animation: "fadeIn 0.8s ease both" }}
          >
            {config.nameEn ?? config.name} Result
          </p>
          <h1
            className="text-[34px] font-black text-ink-inverse leading-tight mb-5"
            style={{ animation: "fadeInUp 0.8s ease 0.15s both" }}
          >
            나의 {config.name} 결과
          </h1>
          {patternType && (
            <div
              className="inline-flex items-center gap-2 bg-amber-brand/15 border border-amber-brand/25 rounded-full px-6 py-2"
              style={{ animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s both" }}
            >
              <span className="w-2 h-2 rounded-full bg-amber-brand" />
              <span className="text-amber-brand font-bold text-sm font-display">
                {patternType}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ═══ SCORE CARDS ═══ */}
      <section className="max-w-[720px] mx-auto px-6 -mt-8 relative z-10">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${Math.min(categoryKeys.length, 5)}, 1fr)`,
          }}
        >
          {categoryKeys.map((cat, i) => {
            const interp = config.interpretations[cat];
            const score = scores[cat] ?? 0;
            const pct = (score / maxScore) * 100;
            return (
              <Reveal key={cat} delay={i * 100}>
                <div
                  className="bg-surface-raised rounded-2xl pt-4 sm:pt-5 pb-3 sm:pb-4 px-1.5 sm:px-2 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
                  style={{ borderTop: `4px solid ${interp.color}` }}
                >
                  <div className="text-xl sm:text-2xl mb-1">{interp.icon}</div>
                  <div
                    className="text-[24px] sm:text-[30px] font-black font-display leading-none"
                    style={{ color: interp.color }}
                  >
                    {score}
                  </div>
                  <div className="text-[11px] sm:text-[12px] font-bold text-ink mt-1">
                    {interp.name}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-ink-tertiary mt-0.5">
                    {interp.fullName}
                  </div>
                  <div className="w-4/5 mx-auto mt-2.5 h-1.5 bg-edge-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: interp.color,
                        transformOrigin: "left",
                        animation: `scaleIn 1.2s ease ${300 + i * 100}ms both`,
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ═══ CHARTS ═══ */}
      <section className="bg-surface-sunken mt-10">
        <div className="max-w-[720px] mx-auto px-6 py-10">
          {[config.chartConfig.primary, ...(config.chartConfig.secondary ?? [])].map(
            (chartType, i) => (
              <Reveal key={`${chartType}-${i}`} delay={i * 120}>
                <div className="bg-surface-raised rounded-2xl p-7 mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-edge-subtle">
                  <h3 className="text-sm font-bold text-ink mb-1">
                    {config.chartConfig.labels?.[chartType] ?? defaultChartLabel[chartType] ?? chartType}
                  </h3>
                  {i === 0 && patternType && (
                    <p className="text-xs text-ink-tertiary mb-4">
                      {categoryKeys.length}가지 차원의 분포 · {patternType}
                    </p>
                  )}
                  <ChartRenderer type={chartType} scores={scores} config={config} subScores={subScores} />
                </div>
              </Reveal>
            )
          )}
        </div>
      </section>

      {/* ═══ PATTERN ANALYSIS ═══ */}
      {patternType && pat && (
        <section className="bg-surface-dark grain">
          <div className="max-w-[720px] mx-auto px-6 py-10">
            <Reveal>
              <div className="flex items-center gap-2 mb-5">
                <Target className="w-5 h-5 text-amber-brand" />
                <h3 className="text-sm font-bold text-ink-inverse uppercase tracking-wider font-display">
                  패턴 분석
                </h3>
              </div>
              <p className="text-[26px] font-black text-ink-inverse mb-2">{pat.label}</p>
              <p className="text-sm text-ink-inverse/50 mb-5">{pat.description}</p>
              <div className="bg-surface-dark-2/60 rounded-xl p-5 border border-ink-inverse/5">
                <p className="text-[14px] leading-[1.9] text-ink-inverse/75">
                  {pat.detailDescription}
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══ CATEGORY DETAILS ═══ */}
      <section className="max-w-[720px] mx-auto px-6 py-10">
        <Reveal>
          <h3 className="text-lg font-black text-ink mb-5">상세 해석</h3>
        </Reveal>

        {/* Strongest / Weakest */}
        {maxCat && minCat && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                cat: maxCat,
                label: "가장 높은 차원",
                icon: <TrendingUp className="w-4 h-4" />,
              },
              {
                cat: minCat,
                label: "가장 낮은 차원",
                icon: <TrendingDown className="w-4 h-4" />,
              },
            ].map(({ cat, label, icon }, i) => {
              const interp = config.interpretations[cat];
              return (
                <Reveal key={label} delay={i * 120}>
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: `${interp.color}08`,
                      border: `1.5px solid ${interp.color}20`,
                    }}
                  >
                    <div
                      className="flex items-center gap-1.5 mb-2"
                      style={{ color: interp.color }}
                    >
                      {icon}
                      <span className="text-[11px] font-bold uppercase tracking-wide">
                        {label}
                      </span>
                    </div>
                    <div className="text-xl font-black" style={{ color: interp.color }}>
                      {interp.icon} {interp.name}
                    </div>
                    <div className="text-xs text-ink-secondary mt-1">
                      {interp.fullName} · {scores[cat]}점/{maxScore}점
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Per-Category Cards */}
        {categoryKeys.map((cat, i) => {
          const interp = config.interpretations[cat];
          const score = scores[cat] ?? 0;
          const pct = (score / maxScore) * 100;
          const isHigh = interp.threshold
            ? score >= interp.threshold
            : score >= maxScore / 2;
          return (
            <Reveal key={cat} delay={i * 60}>
              <div
                className="bg-surface-raised rounded-2xl p-6 mb-3 border border-edge-subtle"
                style={{ borderLeftWidth: 4, borderLeftColor: interp.color }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{interp.icon}</span>
                    <div>
                      <span className="text-[15px] font-bold text-ink">
                        {interp.name}
                      </span>
                      <span className="text-xs text-ink-tertiary ml-1.5">
                        {interp.fullName}
                      </span>
                      <span className="text-[10px] text-ink-muted ml-1.5 hidden sm:inline">
                        ({interp.nameEn})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-xl font-black font-display"
                      style={{ color: interp.color }}
                    >
                      {score}
                    </span>
                    <span className="text-[11px] text-ink-muted ml-0.5">
                      /{maxScore}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="h-2 bg-surface-sunken rounded-full mb-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${interp.color}90, ${interp.color})`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-ink-muted mb-4">
                  <span>{interp.lowLabel}</span>
                  <span>{interp.highLabel}</span>
                </div>

                <p className="text-[13px] leading-[1.7] text-ink-secondary mb-2">
                  {interp.description}
                </p>
                <div className="text-[13px] leading-[1.7] text-ink-secondary bg-surface-sunken rounded-xl p-4">
                  {isHigh ? interp.highDescription : interp.lowDescription}
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      {/* ═══ INSIGHTS (Communication + Leadership) ═══ */}
      {pat && (pat.communicationStyle || pat.leadershipStyle) && (
        <section className="bg-surface-dark grain">
          <div className="max-w-[720px] mx-auto px-6 py-10">
            {pat.communicationStyle && (
              <Reveal>
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-5 h-5 text-[#60A5FA]" />
                    <h3 className="text-base font-bold text-ink-inverse">소통 스타일</h3>
                  </div>
                  <div className="bg-surface-dark-2/60 rounded-xl p-5 border border-ink-inverse/5">
                    <p className="text-[14px] leading-[1.9] text-ink-inverse/75">
                      {pat.communicationStyle}
                    </p>
                  </div>
                </div>
              </Reveal>
            )}
            {pat.leadershipStyle && (
              <Reveal delay={120}>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-5 h-5 text-amber-brand" />
                    <h3 className="text-base font-bold text-ink-inverse">리더십 스타일</h3>
                  </div>
                  <div className="bg-surface-dark-2/60 rounded-xl p-5 border border-ink-inverse/5">
                    <p className="text-[14px] leading-[1.9] text-ink-inverse/75">
                      {pat.leadershipStyle}
                    </p>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ═══ OVERALL SUMMARY ═══ */}
      {pat?.overallSummary && (
        <section className="bg-gradient-to-br from-amber-brand/8 via-surface to-teal-brand/6">
          <div className="max-w-[720px] mx-auto px-6 py-10">
            <Reveal>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-ink" />
                <h3 className="text-lg font-black text-ink">종합 의견</h3>
              </div>
              <p className="text-[15px] leading-[1.9] text-ink-secondary mb-6">
                {pat.overallSummary}
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-4">
              {pat.strengths && pat.strengths.length > 0 && (
                <Reveal delay={100}>
                  <div className="bg-surface-raised rounded-2xl p-5 border border-edge-subtle h-full">
                    <h4 className="text-sm font-bold text-teal-brand mb-3 flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> 강점
                    </h4>
                    <ul className="space-y-2">
                      {pat.strengths.map((s: string, i: number) => (
                        <li
                          key={i}
                          className="text-[13px] text-ink-secondary flex items-start gap-2"
                        >
                          <span className="text-teal-brand mt-0.5 shrink-0">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
              {pat.growthAreas && pat.growthAreas.length > 0 && (
                <Reveal delay={200}>
                  <div className="bg-surface-raised rounded-2xl p-5 border border-edge-subtle h-full">
                    <h4 className="text-sm font-bold text-amber-brand mb-3 flex items-center gap-1.5">
                      <Sprout className="w-4 h-4" /> 성장 포인트
                    </h4>
                    <ul className="space-y-2">
                      {pat.growthAreas.map((g: string, i: number) => (
                        <li
                          key={i}
                          className="text-[13px] text-ink-secondary flex items-start gap-2"
                        >
                          <span className="text-amber-brand mt-0.5 shrink-0">•</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FOOTER ═══ */}
      <section className="max-w-[720px] mx-auto px-6 py-10 text-center">
        <button
          onClick={() => window.print()}
          className="print:hidden inline-flex items-center gap-2 text-sm font-bold text-ink-inverse bg-surface-dark rounded-xl px-8 py-3.5 hover:bg-surface-dark-2 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          <Printer className="w-4 h-4" />
          PDF 저장 / 인쇄
        </button>
        <div className="mt-8 pt-5 border-t border-edge">
          <p className="text-[11px] text-ink-muted leading-relaxed">
            본 진단은 자가진단 도구이며, 전문적인 심리상담을 대체하지 않습니다.
            <br />
            자기 이해와 성장을 위한 참고 자료로 활용해 주세요.
          </p>
        </div>
      </section>
    </div>
  );
}
