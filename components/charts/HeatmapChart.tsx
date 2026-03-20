"use client";

interface Props {
  scores: Record<string, number>;
  xAxis: string[];           // e.g., 6 strengths
  yAxis: string[];           // e.g., 12 attitudes
  criticalPairs: Record<string, string[]>;
  maxValue?: number;
  warningThreshold?: number;
}

export function HeatmapChart({
  scores,
  xAxis,
  yAxis,
  criticalPairs,
  maxValue = 5,
  warningThreshold = 3,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr>
            <th className="p-1.5 text-left text-ink-muted font-semibold w-16" />
            {xAxis.map((x) => (
              <th key={x} className="p-1.5 text-center text-ink font-bold whitespace-nowrap">
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {yAxis.map((attitude) => {
            const attitudeScore = scores[attitude] ?? 0;
            const isWarning = attitudeScore <= warningThreshold;
            return (
              <tr key={attitude} className="border-t border-edge-subtle">
                <td className="p-1.5 font-bold text-ink whitespace-nowrap">
                  {attitude}
                  {isWarning && (
                    <span className="ml-1 text-[9px] text-red-500">⚠</span>
                  )}
                </td>
                {xAxis.map((strength) => {
                  const isCritical = criticalPairs[strength]?.includes(attitude);
                  const score = attitudeScore;
                  const intensity = score / maxValue;

                  let bgColor: string;
                  let textColor: string;
                  if (!isCritical) {
                    bgColor = "#f8f9fa";
                    textColor = "#adb5bd";
                  } else if (score <= 2) {
                    bgColor = `rgba(216, 90, 48, ${0.15 + intensity * 0.25})`;
                    textColor = "#D85A30";
                  } else if (score <= 3) {
                    bgColor = `rgba(243, 156, 18, ${0.1 + intensity * 0.2})`;
                    textColor = "#B87708";
                  } else {
                    bgColor = `rgba(29, 158, 117, ${0.1 + intensity * 0.2})`;
                    textColor = "#1D9E75";
                  }

                  return (
                    <td
                      key={`${attitude}-${strength}`}
                      className="p-1.5 text-center font-bold"
                      style={{ backgroundColor: bgColor, color: textColor }}
                    >
                      {isCritical ? score : "·"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-ink-muted">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500/20" /> 부족 (≤2)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-500/20" /> 주의 (3)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-teal-500/20" /> 양호 (4-5)
        </span>
        <span className="flex items-center gap-1">
          · = 비핵심
        </span>
      </div>
    </div>
  );
}
