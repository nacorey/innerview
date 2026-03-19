export type ScaleType = "likert-4" | "likert-5" | "rank-4";

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

  categoryMap: Record<string, number[]>;
  reverseItems?: number[];
  maxScale?: number;

  interpretations: Record<string, CategoryInterpretation>;
  chartConfig: ChartConfig;
  patternConfig?: PatternConfig;

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

export type ChartType = "radar" | "bar" | "line" | "donut" | "matrix";

export interface ChartConfig {
  primary: ChartType;
  secondary?: ChartType[];
  maxScore: number;
  axisLabels?: {
    xLabel: string;
    yLabel: string;
    positions: Record<string, { x: number; y: number }>;
  };
}

export interface PatternConfig {
  type: "egogram" | "custom";
  patterns: Record<string, PatternDefinition>;
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
  patternType?: string;
  completedAt: string;
}
