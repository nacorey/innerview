"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { CategoryInterpretation } from "@/lib/types/diagnostic";

interface Props {
  scores: Record<string, number>;
  interpretations: Record<string, CategoryInterpretation>;
  maxScore: number;
}

export function LineChartWrapper({ scores, interpretations, maxScore }: Props) {
  const keys = Object.keys(scores);
  const data = keys.map((key) => ({
    category: interpretations[key]?.name ?? key,
    value: scores[key],
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 14, fontWeight: 700, fill: "#495057" }}
          tickLine={false}
          axisLine={{ stroke: "#dee2e6" }}
        />
        <YAxis
          domain={[0, maxScore]}
          tick={{ fontSize: 11, fill: "#868e96" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value) => [`${value}점`, "점수"]}
          contentStyle={{
            borderRadius: 12,
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontSize: 13,
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#F39C12"
          strokeWidth={3}
          dot={(props: Record<string, unknown>) => {
            const idx = props.index as number;
            const cat = keys[idx];
            const color = interpretations[cat]?.color ?? "#F39C12";
            return (
              <circle
                key={idx}
                cx={props.cx as number}
                cy={props.cy as number}
                r={7}
                fill={color}
                stroke="#fff"
                strokeWidth={3}
              />
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
