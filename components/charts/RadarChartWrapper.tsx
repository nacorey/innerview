"use client";

import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip,
} from "recharts";
import type { CategoryInterpretation } from "@/lib/types/diagnostic";

interface Props {
  scores: Record<string, number>;
  interpretations: Record<string, CategoryInterpretation>;
  maxScore: number;
}

export function RadarChartWrapper({ scores, interpretations, maxScore }: Props) {
  const data = Object.entries(scores).map(([key, value]) => ({
    category: interpretations[key]?.name ?? key,
    value,
    fullMark: maxScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid stroke="#e9ecef" />
        <PolarAngleAxis
          dataKey="category"
          tick={(props: Record<string, unknown>) => {
            const cat = (props.payload as { value: string }).value;
            const key = Object.entries(interpretations).find(([, v]) => v.name === cat)?.[0];
            const color = key ? interpretations[key].color : "#495057";
            return (
              <text
                x={props.x as number}
                y={props.y as number}
                textAnchor="middle"
                style={{ fontSize: 13, fontWeight: 700, fill: color }}
              >
                {cat}
              </text>
            );
          }}
        />
        <PolarRadiusAxis domain={[0, maxScore]} tick={{ fontSize: 10, fill: "#adb5bd" }} />
        <Radar dataKey="value" stroke="#F39C12" fill="#F39C12" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}
