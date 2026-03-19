"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { CategoryInterpretation } from "@/lib/types/diagnostic";

interface Props {
  scores: Record<string, number>;
  interpretations: Record<string, CategoryInterpretation>;
}

export function DonutChartWrapper({ scores, interpretations }: Props) {
  const data = Object.entries(scores).map(([key, value]) => ({
    name: interpretations[key]?.name ?? key,
    value,
    color: interpretations[key]?.color ?? "#999",
  }));

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ name, value }) =>
            `${name} ${total > 0 ? Math.round((value / total) * 100) : 0}%`
          }
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}점`, ""]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
