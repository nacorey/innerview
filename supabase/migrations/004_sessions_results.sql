-- 진단 세션
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES diagnostic_tools(id) NOT NULL,
  workshop_id UUID REFERENCES workshops(id),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 진단 결과
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  tool_id UUID REFERENCES diagnostic_tools(id) NOT NULL,
  workshop_id UUID REFERENCES workshops(id),
  answers JSONB NOT NULL,
  scores JSONB NOT NULL,
  pattern_type TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_results_user ON results(user_id, completed_at DESC);
CREATE INDEX idx_results_tool ON results(tool_id, completed_at DESC);
CREATE INDEX idx_results_workshop ON results(workshop_id) WHERE workshop_id IS NOT NULL;
