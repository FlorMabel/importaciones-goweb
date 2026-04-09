-- =====================================================
-- ADMIN DASHBOARD SCHEMA & WHOLESALE PRICING
-- Esquema de administración y precios por mayor
-- =====================================================

-- Usuarios Admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- Logs de actividad
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Configuración general del sitio
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Precios por mayor personalizados
CREATE TABLE IF NOT EXISTS product_wholesale_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  min_qty INT NOT NULL,
  max_qty INT,
  discount_percent DECIMAL(5,2),
  fixed_price DECIMAL(10,2),
  sort_order INT DEFAULT 0
);

-- RLS Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_users_all" ON admin_users FOR ALL USING (true);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_logs_all" ON activity_logs FOR ALL USING (true);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_all" ON site_settings FOR ALL USING (true);

ALTER TABLE product_wholesale_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wholesale_tiers_all" ON product_wholesale_tiers FOR ALL USING (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wholesale_product ON product_wholesale_tiers(product_id);
