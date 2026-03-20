-- 006_zone_framework.sql
-- 3-Zone Framework: tool grouping + integrated profiles

-- 1) diagnostic_tools에 zone 필드 추가
ALTER TABLE diagnostic_tools
  ADD COLUMN zone TEXT DEFAULT NULL CHECK (zone IN ('A', 'B', 'C', 'M')),
  ADD COLUMN zone_label TEXT DEFAULT NULL,
  ADD COLUMN zone_order INTEGER DEFAULT 0;

COMMENT ON COLUMN diagnostic_tools.zone IS 'A=Being, B=Relating, C=Doing, M=Moderator';
COMMENT ON COLUMN diagnostic_tools.zone_label IS '한국어 Zone명 (예: 존재, 관계, 실행, 조절변수)';
COMMENT ON COLUMN diagnostic_tools.zone_order IS 'Zone 내 정렬 순서';

-- 2) 기존 4개 도구에 zone 할당
UPDATE diagnostic_tools SET zone = 'A', zone_label = 'Being', zone_order = 1 WHERE slug = 'bfi2';
UPDATE diagnostic_tools SET zone = 'B', zone_label = 'Relating', zone_order = 1 WHERE slug = 'nlp-vak';
UPDATE diagnostic_tools SET zone = 'B', zone_label = 'Relating', zone_order = 2 WHERE slug = 'ta-egogram';
UPDATE diagnostic_tools SET zone = 'C', zone_label = 'Doing', zone_order = 1 WHERE slug = 'conflict-style';

-- 3) results에 sub_scores 필드 추가 (K-WSD drive/behavioral 구분용)
ALTER TABLE results
  ADD COLUMN sub_scores JSONB DEFAULT NULL;

COMMENT ON COLUMN results.sub_scores IS 'K-WSD용: { "통찰력": { "drive": 12, "behavioral": 10 }, ... }';

-- 4) integrated_profiles 테이블 (통합 프로필)
CREATE TABLE integrated_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  workshop_id UUID REFERENCES workshops(id),

  -- 각 Zone의 최신 result 참조
  zone_a_results JSONB DEFAULT '[]',   -- [{ tool_slug, result_id, completed_at }]
  zone_b_results JSONB DEFAULT '[]',
  zone_c_results JSONB DEFAULT '[]',
  moderator_result_id UUID REFERENCES results(id),

  -- 통합 해석 결과
  cross_patterns JSONB DEFAULT '[]',    -- [{ name: "전략적 리더", layers: "...", desc: "..." }]
  influence_profile TEXT,               -- 'partner' | 'supporter' | 'commander' | 'observer'
  burnout_risk JSONB DEFAULT '{}',      -- { "추진력": { drive: 8, behavioral: 14, gap: 6, risk: "high" } }
  attitude_warnings JSONB DEFAULT '[]', -- [{ attitude: "배려", score: 2, impact: "연결력 약화" }]

  generated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_integrated_user ON integrated_profiles(user_id, generated_at DESC);
CREATE INDEX idx_integrated_workshop ON integrated_profiles(workshop_id) WHERE workshop_id IS NOT NULL;

-- updated_at 트리거 재사용
CREATE TRIGGER set_updated_at_integrated
  BEFORE UPDATE ON integrated_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5) RLS for integrated_profiles
ALTER TABLE integrated_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own integrated profile"
  ON integrated_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "system inserts integrated profiles"
  ON integrated_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins read workshop integrated profiles"
  ON integrated_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workshops
      WHERE workshops.id = integrated_profiles.workshop_id
        AND workshops.admin_id = auth.uid()
    )
  );
