"use client";

import type { CategoryInterpretation, ChartConfig } from "@/lib/types/diagnostic";

interface Props {
  scores: Record<string, number>;
  interpretations: Record<string, CategoryInterpretation>;
  maxScore: number;
  axisLabels: NonNullable<ChartConfig["axisLabels"]>;
}

export function MatrixChart({ scores, interpretations, maxScore, axisLabels }: Props) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      {/* 축 라벨 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-foreground/50">
        {axisLabels.xLabel} →
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-foreground/50">
        {axisLabels.yLabel} →
      </div>

      {/* 격자 */}
      <div className="absolute inset-8 border border-foreground/10">
        <div className="absolute left-1/2 top-0 h-full w-px bg-foreground/10" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-foreground/10" />

        {/* 각 카테고리 점 */}
        {Object.entries(axisLabels.positions).map(([key, pos]) => {
          const score = scores[key] ?? 0;
          const normalized = maxScore > 0 ? score / maxScore : 0;
          const size = 24 + normalized * 32;
          const color = interpretations[key]?.color ?? "#999";
          const name = interpretations[key]?.name ?? key;

          return (
            <div
              key={key}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${pos.x * 100}%`,
                top: `${(1 - pos.y) * 100}%`,
              }}
            >
              <div
                className="flex items-center justify-center rounded-full text-white text-[10px] font-bold shadow-md"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  opacity: 0.6 + normalized * 0.4,
                }}
              >
                {score}
              </div>
              <span className="mt-1 text-[10px] font-medium text-foreground/70">
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
