-- ============================================================
-- profiles
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- admin은 모든 프로필 조회 가능 (워크숍 참가자 확인용)
CREATE POLICY "admin reads all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================
-- diagnostic_tools
-- ============================================================
ALTER TABLE diagnostic_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads active tools"
  ON diagnostic_tools FOR SELECT
  USING (is_active = true);

CREATE POLICY "admin manages tools"
  ON diagnostic_tools FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- workshops
-- ============================================================
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin manages own workshops"
  ON workshops FOR ALL
  USING (admin_id = auth.uid());

CREATE POLICY "members read workshop"
  ON workshops FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workshop_members wm
      WHERE wm.workshop_id = workshops.id AND wm.user_id = auth.uid()
    )
  );

-- ============================================================
-- workshop_members
-- ============================================================
ALTER TABLE workshop_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin manages workshop members"
  ON workshop_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workshops w
      WHERE w.id = workshop_members.workshop_id AND w.admin_id = auth.uid()
    )
  );

CREATE POLICY "users read own membership"
  ON workshop_members FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================
-- sessions
-- ============================================================
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users manage sessions"
  ON sessions FOR ALL
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- results
-- ============================================================
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own results"
  ON results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own results"
  ON results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin reads workshop results"
  ON results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workshops w
      WHERE w.id = results.workshop_id AND w.admin_id = auth.uid()
    )
  );
