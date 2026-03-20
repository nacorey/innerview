"use client";

import type { SplitScore } from "@/lib/types/zone";

interface Props {
  splitScores: Record<string, SplitScore>;
  threshold?: number;
}

const GAP_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  core: { label: "핵심 강점", color: "#1D9E75", bg: "#E6F7F1" },
  latent: { label: "잠재 강점", color: "#2E75B6", bg: "#E8F0FE" },
  effortful: { label: "노력형 (번아웃 주의)", color: "#D85A30", bg: "#FFF0EB" },
  development: { label: "개발 영역", color: "#868e96", bg: "#f8f9fa" },
};

function classifyGap(drive: number, behavioral: number): keyof typeof GAP_LABEL {
  const mid = 11;
  if (drive >= mid && behavioral >= mid) return "core";
  if (drive >= mid && behavioral < mid) return "latent";
  if (drive < mid && behavioral >= mid) return "effortful";
  return "development";
}

export function BurnoutRiskTable({ splitScores }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-ink-tertiary text-xs">
            <th className="text-left font-semibold pb-3 pr-3">강점 영역</th>
            <th className="text-center font-semibold pb-3 px-2">욕구</th>
            <th className="text-center font-semibold pb-3 px-2">행동</th>
            <th className="text-center font-semibold pb-3 px-2">간극</th>
            <th className="text-left font-semibold pb-3 pl-3">판정</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(splitScores).map(([category, score]) => {
            const gap = score.behavioral - score.drive;
            const type = classifyGap(score.drive, score.behavioral);
            const style = GAP_LABEL[type];
            return (
              <tr key={category} className="border-t border-edge-subtle">
                <td className="py-2.5 pr-3 font-bold text-ink">{category}</td>
                <td className="py-2.5 px-2 text-center text-ink-secondary">{score.drive}</td>
                <td className="py-2.5 px-2 text-center text-ink-secondary">{score.behavioral}</td>
                <td className="py-2.5 px-2 text-center font-bold" style={{ color: gap >= 4 ? "#D85A30" : "#495057" }}>
                  {gap > 0 ? `+${gap}` : gap}
                </td>
                <td className="py-2.5 pl-3">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ color: style.color, backgroundColor: style.bg }}
                  >
                    {style.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
