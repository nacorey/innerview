"use client";

import type { FlexibilityScore } from "@/lib/types/zone";

interface Props {
  flexibility: FlexibilityScore;
  scores: Record<string, number>;
}

const LEVEL_CONFIG = {
  high: { label: "높은 유연성", color: "#1D9E75", description: "상황에 따라 다양한 스타일을 골고루 활용합니다." },
  medium: { label: "보통 유연성", color: "#F39C12", description: "일부 스타일 선호가 있으나 적응 가능합니다." },
  low: { label: "낮은 유연성", color: "#D85A30", description: "특정 스타일에 편향되어 있습니다. 다른 스타일 개발을 고려해 보세요." },
};

export function FlexibilityGauge({ flexibility, scores }: Props) {
  const config = LEVEL_CONFIG[flexibility.level];
  // Gauge position: SD 0 → 0%, SD 8+ → 100%
  const pct = Math.min((flexibility.sd / 8) * 100, 100);

  return (
    <div>
      {/* Gauge bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-[#1D9E75] via-[#F39C12] to-[#D85A30]">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-md"
          style={{ left: `calc(${pct}% - 8px)`, borderColor: config.color }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-ink-muted mt-1 px-0.5">
        <span>높은 유연성</span>
        <span>낮은 유연성</span>
      </div>

      {/* Result */}
      <div className="mt-4 flex items-center gap-3">
        <div
          className="text-2xl font-black font-display"
          style={{ color: config.color }}
        >
          SD {flexibility.sd}
        </div>
        <div>
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{ color: config.color, backgroundColor: `${config.color}15` }}
          >
            {config.label}
          </span>
          <p className="text-xs text-ink-secondary mt-1">{config.description}</p>
        </div>
      </div>

      {/* Style breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {Object.entries(scores).map(([style, score]) => (
          <div key={style} className="flex items-center gap-2 text-sm">
            <div className="w-full max-w-24 h-2 bg-edge-subtle rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(score / 25) * 100}%`,
                  backgroundColor: config.color,
                }}
              />
            </div>
            <span className="text-ink-secondary text-xs whitespace-nowrap">{style} {score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
