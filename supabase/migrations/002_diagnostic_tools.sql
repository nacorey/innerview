-- 진단 도구 레지스트리
CREATE TABLE diagnostic_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  icon TEXT,

  questions JSONB NOT NULL,
  scale_type TEXT NOT NULL,
  scale_options JSONB NOT NULL,
  category_map JSONB NOT NULL,
  reverse_items JSONB DEFAULT '[]',
  max_scale INTEGER,
  interpretations JSONB NOT NULL,
  chart_config JSONB DEFAULT '{}',
  pattern_config JSONB DEFAULT '{}',

  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON diagnostic_tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
