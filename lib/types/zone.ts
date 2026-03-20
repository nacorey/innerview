// === BEAM Framework Types ===
// B=Being, E=Engaging, A=Acting, M=Mindset

export type Zone = 'A' | 'B' | 'C' | 'M';

export interface ZoneInfo {
  zone: Zone;
  beam: string;         // BEAM letter: 'B' | 'E' | 'A' | 'M'
  label: string;        // 'Being' | 'Engaging' | 'Acting' | 'Mindset'
  labelKo: string;      // '존재' | '소통' | '행동' | '마인드셋'
  question: string;     // 'Who am I?' | 'How do I engage?' | ...
  questionKo: string;   // '나는 누구인가?' | ...
  color: string;        // Tailwind color class
}

export const ZONE_CONFIG: Record<Zone, ZoneInfo> = {
  A: { zone: 'A', beam: 'B', label: 'Being', labelKo: '존재', question: 'Who am I?', questionKo: '나는 누구인가?', color: 'purple' },
  B: { zone: 'B', beam: 'E', label: 'Engaging', labelKo: '소통', question: 'How do I engage?', questionKo: '어떻게 소통하는가?', color: 'teal' },
  C: { zone: 'C', beam: 'A', label: 'Acting', labelKo: '행동', question: 'How do I act?', questionKo: '어떻게 행동하는가?', color: 'coral' },
  M: { zone: 'M', beam: 'M', label: 'Mindset', labelKo: '마인드셋', question: 'What is my inner ground?', questionKo: '나의 마음 기반은?', color: 'amber' },
};

// K-WSD drive/behavioral split scoring
export interface SplitScore {
  drive: number;
  behavioral: number;
  total: number;
}

export interface SplitCategoryMap {
  [category: string]: {
    drive: number[];       // question indices for drive items
    behavioral: number[];  // question indices for behavioral items
  };
}

// Integrated Profile
export interface CrossPattern {
  name: string;           // e.g., "전략적 리더"
  layers: string;         // e.g., "L1 개방성↑ + L2 통찰력 + L5 협력"
  description: string;
  coachingTip: string;
}

export interface BurnoutRisk {
  category: string;
  drive: number;
  behavioral: number;
  gap: number;
  risk: 'low' | 'medium' | 'high';
}

export interface AttitudeWarning {
  attitude: string;
  type: 'facilitating' | 'protective';
  score: number;
  affectedStrengths: string[];
  impact: string;
}

export type InfluenceProfile = 'partner' | 'supporter' | 'commander' | 'observer';

export type FollowershipType = 'exemplary' | 'alienated' | 'passive' | 'conformist' | 'pragmatic';

export type FlexibilityLevel = 'high' | 'medium' | 'low';

export interface FlexibilityScore {
  sd: number;
  level: FlexibilityLevel;
}

export interface FollowershipResult {
  activeEngagement: number;     // X축: 0-60
  independentThinking: number;  // Y축: 0-60
  type: FollowershipType;
}

export interface IntegratedProfile {
  id: string;
  userId: string;
  workshopId?: string;
  zoneAResults: { toolSlug: string; resultId: string; completedAt: string }[];
  zoneBResults: { toolSlug: string; resultId: string; completedAt: string }[];
  zoneCResults: { toolSlug: string; resultId: string; completedAt: string }[];
  moderatorResultId?: string;
  crossPatterns: CrossPattern[];
  influenceProfile?: InfluenceProfile;
  followershipResult?: FollowershipResult;
  leadershipFlexibility?: FlexibilityScore;
  burnoutRisk: BurnoutRisk[];
  attitudeWarnings: AttitudeWarning[];
  generatedAt: string;
}
