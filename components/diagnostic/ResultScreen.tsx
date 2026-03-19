"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { DiagnosticToolConfig, ChartType } from "@/lib/types/diagnostic";

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

interface Props {
  config: DiagnosticToolConfig;
  scores: Record<string, number>;
  patternType?: string;
}

function ChartRenderer({ type, scores, config }: { type: ChartType; scores: Record<string, number>; config: DiagnosticToolConfig }) {
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
      return <MatrixChart scores={scores} interpretations={interpretations} maxScore={maxScore} axisLabels={chartConfig.axisLabels} />;
    default:
      return null;
  }
}

export function ResultScreen({ config, scores, patternType }: Props) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setTimeout(() => setAnimate(true), 200); }, []);

  const sortedCategories = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const categoryKeys = Object.keys(config.interpretations);
  const maxCat = sortedCategories[0]?.[0];
  const minCat = sortedCategories[sortedCategories.length - 1]?.[0];
  const maxScore = config.chartConfig.maxScore;

  const chartLabel: Record<string, string> = {
    line: "📈 프로파일",
    radar: "🕸️ 레이더",
    bar: "📊 점수 비교",
    donut: "🍩 비율 분석",
    matrix: "📐 매트릭스",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] from-[40%] to-[#f8f9fa] to-[40%]">
      {/* Header */}
      <div className="text-center pt-12 pb-10 text-white px-6">
        <p className="text-[13px] tracking-[4px] text-white/40 mb-2 uppercase">
          {config.nameEn ?? config.name} Result
        </p>
        <h1
          className="text-[32px] font-black mb-3 transition-all duration-600"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(20px)",
          }}
        >
          나의 {config.name} 결과
        </h1>
        {patternType && (
          <div className="inline-block bg-[#F39C12]/20 border border-[#F39C12]/30 rounded-full px-5 py-1.5 text-sm font-semibold text-[#F39C12]">
            패턴: {patternType}
          </div>
        )}
      </div>

      <div className="max-w-[700px] mx-auto px-5 pb-16">
        {/* Score Cards */}
        <div
          className="grid gap-2.5 -mt-4 mb-8"
          style={{ gridTemplateColumns: `repeat(${Math.min(categoryKeys.length, 5)}, 1fr)` }}
        >
          {categoryKeys.map((cat, i) => {
            const interp = config.interpretations[cat];
            const score = scores[cat] ?? 0;
            return (
              <div
                key={cat}
                className="bg-white rounded-[14px] pt-5 pb-4 px-2 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-500"
                style={{
                  borderTop: `4px solid ${interp.color}`,
                  opacity: animate ? 1 : 0,
                  transform: animate ? "translateY(0)" : "translateY(30px)",
                  transitionDelay: `${100 + i * 80}ms`,
                }}
              >
                <div className="text-2xl mb-1">{interp.icon}</div>
                <div className="text-[28px] font-black" style={{ color: interp.color }}>
                  {score}
                </div>
                <div className="text-[13px] font-bold text-[#343a40] mt-0.5">{interp.name}</div>
                <div className="text-[10px] text-[#868e96] mt-0.5">{interp.fullName}</div>
                <div className="w-4/5 mx-auto mt-2 h-1 bg-[#f1f3f5] rounded-sm">
                  <div
                    className="h-full rounded-sm transition-all duration-1000"
                    style={{
                      width: `${(score / maxScore) * 100}%`,
                      backgroundColor: interp.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        {[config.chartConfig.primary, ...(config.chartConfig.secondary ?? [])].map((chartType, i) => (
          <div key={`${chartType}-${i}`} className="bg-white rounded-[20px] p-7 pt-7 mb-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
            <h3 className="text-base font-extrabold text-[#343a40] mb-1">
              {chartLabel[chartType] ?? chartType}
            </h3>
            {i === 0 && patternType && (
              <p className="text-xs text-[#868e96] mb-4">
                {categoryKeys.length}가지 차원의 분포 ({patternType})
              </p>
            )}
            <ChartRenderer type={chartType} scores={scores} config={config} />
          </div>
        ))}

        {/* Pattern Analysis */}
        {patternType && config.patternConfig?.patterns[patternType] && (
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-[20px] p-7 mb-6 text-white">
            <h3 className="text-base font-extrabold mb-3">
              🔍 패턴 분석: {config.patternConfig.patterns[patternType].label}
            </h3>
            <p className="text-[13px] text-white/50 mb-3">
              {config.patternConfig.patterns[patternType].description}
            </p>
            <p className="text-sm leading-[1.8] text-white/80">
              {config.patternConfig.patterns[patternType].detailDescription}
            </p>
          </div>
        )}

        {/* Strongest / Weakest */}
        {maxCat && minCat && (
          <>
            <h3 className="text-lg font-extrabold text-[#343a40] mb-4">📝 상세 해석</h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { cat: maxCat, label: "가장 높은 차원", sublabel: config.interpretations[maxCat]?.highLabel },
                { cat: minCat, label: "가장 낮은 차원", sublabel: config.interpretations[minCat]?.lowLabel },
              ].map(({ cat, label, sublabel }) => {
                const interp = config.interpretations[cat];
                return (
                  <div
                    key={label}
                    className="rounded-[14px] p-4"
                    style={{
                      background: `${interp.color}10`,
                      border: `1.5px solid ${interp.color}30`,
                    }}
                  >
                    <div className="text-[11px] text-[#868e96] font-semibold mb-1">{label}</div>
                    <div className="text-xl font-black" style={{ color: interp.color }}>
                      {interp.icon} {interp.name} ({scores[cat]}점)
                    </div>
                    <div className="text-xs text-[#495057] mt-1">
                      {interp.fullName} · {sublabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Detailed Interpretations */}
        {categoryKeys.map((cat) => {
          const interp = config.interpretations[cat];
          const score = scores[cat] ?? 0;
          const isHigh = interp.threshold ? score >= interp.threshold : score >= maxScore / 2;
          return (
            <div
              key={cat}
              className="bg-white rounded-2xl p-6 mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              style={{ borderLeft: `5px solid ${interp.color}` }}
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-xl mr-2">{interp.icon}</span>
                  <span className="text-base font-extrabold text-[#343a40]">
                    {interp.name} - {interp.fullName}
                  </span>
                  <span className="text-xs text-[#868e96] ml-2">({interp.nameEn})</span>
                </div>
                <span className="text-xl font-black" style={{ color: interp.color }}>
                  {score}
                  <span className="text-xs font-medium text-[#868e96]">/{maxScore}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-[#f1f3f5] rounded-sm mb-2 overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-[1500ms]"
                  style={{
                    width: `${(score / maxScore) * 100}%`,
                    background: `linear-gradient(90deg, ${interp.color}80, ${interp.color})`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#adb5bd] mb-3 -mt-0.5">
                <span>← {interp.lowLabel}</span>
                <span>{interp.highLabel} →</span>
              </div>

              <p className="text-[13.5px] leading-[1.7] text-[#495057] mb-2">
                {interp.description}
              </p>
              <p className="text-[13px] leading-[1.7] text-[#868e96] bg-[#f8f9fa] rounded-[10px] p-3.5">
                💡 {isHigh ? interp.highDescription : interp.lowDescription}
              </p>
            </div>
          );
        })}

        {/* Insight Sections: Communication, Leadership, Summary */}
        {patternType && config.patternConfig?.patterns[patternType] && (() => {
          const pat = config.patternConfig!.patterns[patternType];
          const hasInsights = pat.communicationStyle || pat.leadershipStyle || pat.overallSummary;
          if (!hasInsights) return null;
          return (
            <>
              {/* Communication Style */}
              {pat.communicationStyle && (
                <div className="bg-white rounded-[20px] p-7 mb-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)]" style={{ borderLeft: "5px solid #3498DB" }}>
                  <h3 className="text-base font-extrabold text-[#343a40] mb-3">💬 소통 스타일</h3>
                  <p className="text-[13.5px] leading-[1.8] text-[#495057]">{pat.communicationStyle}</p>
                </div>
              )}

              {/* Leadership Style */}
              {pat.leadershipStyle && (
                <div className="bg-white rounded-[20px] p-7 mb-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)]" style={{ borderLeft: "5px solid #E67E22" }}>
                  <h3 className="text-base font-extrabold text-[#343a40] mb-3">👑 리더십 스타일</h3>
                  <p className="text-[13.5px] leading-[1.8] text-[#495057]">{pat.leadershipStyle}</p>
                </div>
              )}

              {/* Overall Summary */}
              {pat.overallSummary && (
                <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-[20px] p-7 mb-4 text-white">
                  <h3 className="text-base font-extrabold mb-3">📋 종합 의견</h3>
                  <p className="text-sm leading-[1.9] text-white/85 mb-5">{pat.overallSummary}</p>

                  {/* Strengths */}
                  {pat.strengths && pat.strengths.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[13px] font-bold text-[#2ECC71] mb-2">✅ 강점</h4>
                      <ul className="space-y-1.5">
                        {pat.strengths.map((s: string, i: number) => (
                          <li key={i} className="text-[13px] text-white/75 flex items-start gap-2">
                            <span className="text-[#2ECC71] mt-0.5 shrink-0">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Growth Areas */}
                  {pat.growthAreas && pat.growthAreas.length > 0 && (
                    <div>
                      <h4 className="text-[13px] font-bold text-[#F39C12] mb-2">🌱 성장 포인트</h4>
                      <ul className="space-y-1.5">
                        {pat.growthAreas.map((g: string, i: number) => (
                          <li key={i} className="text-[13px] text-white/75 flex items-start gap-2">
                            <span className="text-[#F39C12] mt-0.5 shrink-0">•</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        })()}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <button
            onClick={() => window.print()}
            className="text-sm font-bold text-white bg-gradient-to-br from-[#3498DB] to-[#2980B9] rounded-[14px] px-8 py-3.5 shadow-[0_4px_16px_rgba(52,152,219,0.3)] transition-all hover:-translate-y-0.5"
          >
            🖨️ PDF 저장 / 인쇄
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 pt-5 border-t border-[#e9ecef]">
          <p className="text-[11px] text-[#adb5bd] leading-relaxed">
            본 진단은 자가진단 도구이며, 전문적인 심리상담을 대체하지 않습니다.<br />
            자기 이해와 성장을 위한 참고 자료로 활용해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
