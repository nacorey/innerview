"use client";

import type { FollowershipResult } from "@/lib/types/zone";

interface Props {
  result: FollowershipResult;
}

const TYPE_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  exemplary: { label: "모범형", emoji: "⭐", color: "#1D9E75" },
  alienated: { label: "소외형", emoji: "🌑", color: "#868e96" },
  passive: { label: "수동형", emoji: "💤", color: "#adb5bd" },
  conformist: { label: "순응형", emoji: "🤝", color: "#2E75B6" },
  pragmatic: { label: "실용형", emoji: "⚖️", color: "#F39C12" },
};

const QUADRANT_LABELS = [
  { label: "소외형", x: "18%", y: "18%" },
  { label: "모범형", x: "72%", y: "18%" },
  { label: "수동형", x: "18%", y: "78%" },
  { label: "순응형", x: "72%", y: "78%" },
];

export function FollowershipQuadrant({ result }: Props) {
  const { activeEngagement, independentThinking, type } = result;
  const typeInfo = TYPE_CONFIG[type] ?? TYPE_CONFIG.pragmatic;

  // Convert scores to percentages (0-60 → 0-100%)
  const xPct = (activeEngagement / 60) * 100;
  const yPct = 100 - (independentThinking / 60) * 100; // Invert Y for screen coords

  return (
    <div>
      {/* Type badge */}
      <div className="text-center mb-4">
        <span className="text-2xl">{typeInfo.emoji}</span>
        <span
          className="ml-2 text-lg font-black font-display"
          style={{ color: typeInfo.color }}
        >
          {typeInfo.label} 팔로워
        </span>
      </div>

      {/* Quadrant chart */}
      <div className="relative mx-auto aspect-square w-full max-w-[340px]">
        {/* Axis labels */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-ink-muted whitespace-nowrap">
          적극적·능동적 참여 →
        </div>
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-ink-muted whitespace-nowrap">
          독립적·비판적 사고 →
        </div>

        {/* Grid */}
        <div className="absolute inset-6 border border-edge rounded-lg overflow-hidden bg-surface-sunken">
          {/* Cross lines */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-edge-subtle" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-edge-subtle" />

          {/* Pragmatic center zone */}
          <div
            className="absolute border border-dashed border-amber-brand/30 bg-amber-brand/5 rounded"
            style={{
              left: `${(20 / 60) * 100}%`,
              top: `${(1 - 40 / 60) * 100}%`,
              width: `${(20 / 60) * 100}%`,
              height: `${(20 / 60) * 100}%`,
            }}
          />

          {/* Quadrant labels */}
          {QUADRANT_LABELS.map(({ label, x, y }) => (
            <div
              key={label}
              className="absolute text-[11px] font-bold text-ink-muted/50"
              style={{ left: x, top: y }}
            >
              {label}
            </div>
          ))}

          {/* User position dot */}
          <div
            className="absolute w-5 h-5 rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              left: `${xPct}%`,
              top: `${yPct}%`,
              backgroundColor: typeInfo.color,
              border: "3px solid white",
            }}
          />
        </div>
      </div>

      {/* Score readout */}
      <div className="flex justify-center gap-6 mt-8 text-sm">
        <div className="text-center">
          <div className="text-ink-muted text-xs">적극적 참여</div>
          <div className="font-black font-display text-lg" style={{ color: "#C55A11" }}>
            {activeEngagement}<span className="text-xs text-ink-muted">/60</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-ink-muted text-xs">독립적 사고</div>
          <div className="font-black font-display text-lg" style={{ color: "#2E75B6" }}>
            {independentThinking}<span className="text-xs text-ink-muted">/60</span>
          </div>
        </div>
      </div>
    </div>
  );
}
