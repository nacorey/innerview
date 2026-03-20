import type { Zone, SplitCategoryMap } from "./zone";

export type ScaleType = "likert-4" | "likert-5" | "likert-7" | "rank-4" | "split-likert-5";

export interface DiagnosticToolConfig {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  description: string;
  icon: string;

  questions: Question[];
  scaleType: ScaleType;
  scaleOptions: ScaleOption[];

  categoryMap: Record<string, number[]> | SplitCategoryMap;
  reverseItems?: number[];
  maxScale?: number;

  interpretations: Record<string, CategoryInterpretation>;
  chartConfig: ChartConfig;
  patternConfig?: PatternConfig;

  zone?: Zone;
  zoneLabel?: string;
  zoneOrder?: number;

  isActive: boolean;
  sortOrder: number;
}

export interface Question {
  id: number;
  text: string;
  options?: RankOption[];
}

export interface RankOption {
  text: string;
  channel: string;
}

export interface ScaleOption {
  value: number;
  label: string;
  emoji?: string;
}

export interface CategoryInterpretation {
  name: string;
  fullName: string;
  nameEn: string;
  color: string;
  icon: string;
  description: string;
  highDescription: string;
  lowDescription: string;
  highLabel: string;
  lowLabel: string;
  threshold?: number;
}

export type ChartType = "radar" | "bar" | "line" | "donut" | "matrix" | "grouped-bar" | "burnout-table" | "heatmap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ChartConfig {
  primary: ChartType;
  secondary?: ChartType[];
  maxScore: number;
  labels?: Record<string, string>;
  axisLabels?: {
    xLabel: string;
    yLabel: string;
    positions: Record<string, { x: number; y: number }>;
  };
  // New tool-specific configs (optional, used by respective chart components)
  radarKeys?: string[];
  groupedBarConfig?: {
    groups: string[];
    series: { key: string; label: string; color: string }[];
    maxValue?: number;
  };
  matrixConfig?: Record<string, unknown>;
  barConfig?: Record<string, unknown>;
  heatmapConfig?: {
    title?: string;
    xAxis: string[];
    yAxis: string[];
    criticalPairs: Record<string, string[]>;
  };
}

export interface PatternConfig {
  type: string;
  patterns?: Record<string, PatternDefinition>;
  [key: string]: unknown;
}

export interface PatternDefinition {
  label: string;
  description: string;
  detailDescription: string;
  detectFn?: string;
  communicationStyle?: string;
  leadershipStyle?: string;
  overallSummary?: string;
  strengths?: string[];
  growthAreas?: string[];
}

export interface DiagnosticResult {
  id: string;
  userId: string;
  toolId: string;
  workshopId?: string;
  answers: Record<number, number | Record<string, number>>;
  scores: Record<string, number>;
  subScores?: Record<string, import("./zone").SplitScore>;
  patternType?: string;
  completedAt: string;
}
