-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE liderancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE eleitores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reunioes ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE vale_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipe_membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanhas_marketing ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES FOR LIDERANÇAS (Leadership)
-- ============================================================

CREATE POLICY "Users can only see lideranças from their tenant"
  ON liderancas FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only insert lideranças in their tenant"
  ON liderancas FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only update lideranças in their tenant"
  ON liderancas FOR UPDATE
  USING (tenantId = current_setting('app.tenant_id')::text)
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only delete lideranças in their tenant"
  ON liderancas FOR DELETE
  USING (tenantId = current_setting('app.tenant_id')::text);

-- ============================================================
-- POLICIES FOR ELEITORES (Voters)
-- ============================================================

CREATE POLICY "Users can only see eleitores from their tenant"
  ON eleitores FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only insert eleitores in their tenant"
  ON eleitores FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only update eleitores in their tenant"
  ON eleitores FOR UPDATE
  USING (tenantId = current_setting('app.tenant_id')::text)
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only delete eleitores in their tenant"
  ON eleitores FOR DELETE
  USING (tenantId = current_setting('app.tenant_id')::text);

-- ============================================================
-- POLICIES FOR REUNIÕES (Meetings)
-- ============================================================

CREATE POLICY "Users can only see reunioes from their tenant"
  ON reunioes FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only insert reunioes in their tenant"
  ON reunioes FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only update reunioes in their tenant"
  ON reunioes FOR UPDATE
  USING (tenantId = current_setting('app.tenant_id')::text)
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);

-- ============================================================
-- POLICIES FOR METAS (Vote Targets)
-- ============================================================

CREATE POLICY "Users can only see metas from their tenant"
  ON metas FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only insert metas in their tenant"
  ON metas FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only update metas in their tenant"
  ON metas FOR UPDATE
  USING (tenantId = current_setting('app.tenant_id')::text)
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);

-- ============================================================
-- POLICIES FOR FINANCEIRO (Financial)
-- ============================================================

CREATE POLICY "Finance users can only see contas from their tenant"
  ON contas FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Finance users can only manage contas in their tenant"
  ON contas FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text AND current_setting('app.user_role')::text IN ('admin', 'finance'));

CREATE POLICY "Users can only see notas from their tenant"
  ON notas_fiscais FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Finance users can manage notas in their tenant"
  ON notas_fiscais FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text AND current_setting('app.user_role')::text IN ('admin', 'finance'));

-- ============================================================
-- POLICIES FOR VALE VOUCHERS
-- ============================================================

CREATE POLICY "Users can only see vouchers from their tenant"
  ON vale_vouchers FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Admin users can manage vouchers in their tenant"
  ON vale_vouchers FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text AND current_setting('app.user_role')::text = 'admin');

-- ============================================================
-- POLICIES FOR EQUIPE (Team)
-- ============================================================

CREATE POLICY "Users can only see equipe from their tenant"
  ON equipe_membros FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Admin users can manage equipe in their tenant"
  ON equipe_membros FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text AND current_setting('app.user_role')::text = 'admin');

-- ============================================================
-- POLICIES FOR DEMANDAS (Demands)
-- ============================================================

CREATE POLICY "Users can only see demandas from their tenant"
  ON demandas FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can only insert demandas in their tenant"
  ON demandas FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);

-- ============================================================
-- POLICIES FOR CAMPANHAS MARKETING
-- ============================================================

CREATE POLICY "Users can only see campanhas from their tenant"
  ON campanhas_marketing FOR SELECT
  USING (tenantId = current_setting('app.tenant_id')::text);

CREATE POLICY "Users can manage campanhas in their tenant"
  ON campanhas_marketing FOR INSERT
  WITH CHECK (tenantId = current_setting('app.tenant_id')::text);
