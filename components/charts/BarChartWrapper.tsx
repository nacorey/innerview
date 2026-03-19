"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { CategoryInterpretation } from "@/lib/types/diagnostic";

interface Props {
  scores: Record<string, number>;
  interpretations: Record<string, CategoryInterpretation>;
  maxScore: number;
}

export function BarChartWrapper({ scores, interpretations, maxScore }: Props) {
  const data = Object.entries(scores).map(([key, value]) => ({
    category: interpretations[key]?.name ?? key,
    value,
    fullName: interpretations[key]?.fullName ?? key,
    color: interpretations[key]?.color ?? "#F39C12",
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" vertical={false} />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 13, fontWeight: 700, fill: "#495057" }}
          tickLine={false}
          axisLine={{ stroke: "#dee2e6" }}
        />
        <YAxis domain={[0, maxScore]} tick={{ fontSize: 11, fill: "#868e96" }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(value, _name, props) => {
            const fullName = (props as unknown as { payload: { fullName: string } }).payload?.fullName ?? "";
            return [`${value}점 / ${maxScore}점`, fullName];
          }}
          contentStyle={{
            borderRadius: 12,
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
