"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import type { SplitScore } from "@/lib/types/zone";

interface Props {
  splitScores: Record<string, SplitScore>;
  colors?: { drive: string; behavioral: string };
}

export function GroupedBarChart({
  splitScores,
  colors = { drive: "#2E75B6", behavioral: "#C55A11" },
}: Props) {
  const data = Object.entries(splitScores).map(([category, score]) => ({
    category,
    "욕구(Drive)": score.drive,
    "행동(Behavioral)": score.behavioral,
    gap: score.behavioral - score.drive,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" vertical={false} />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 12, fontWeight: 700, fill: "#495057" }}
          tickLine={false}
          axisLine={{ stroke: "#dee2e6" }}
        />
        <YAxis
          domain={[0, 15]}
          tick={{ fontSize: 11, fill: "#868e96" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value, name) => [`${value}점`, String(name)]}
          contentStyle={{
            borderRadius: 12,
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontSize: 13,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, fontWeight: 600 }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="욕구(Drive)" fill={colors.drive} radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="행동(Behavioral)" fill={colors.behavioral} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
