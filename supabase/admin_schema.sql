-- =====================================================
-- ADMIN DASHBOARD — Tablas adicionales
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- 1. Status en productos (active/inactive/draft)
ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
  CHECK (status IN ('active', 'inactive', 'draft'));

-- 2. Usuarios Admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- 3. Logs de actividad
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,         -- 'create', 'update', 'delete'
  entity_type TEXT NOT NULL,    -- 'product', 'category', 'order'
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Configuración general
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- RLS Policies (Row Level Security)
-- Permitir acceso completo con service_role o anon key
-- En producción, restringir al rol autenticado
-- =====================================================

-- Admin users: lectura pública, escritura servicio
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_users_read" ON admin_users FOR SELECT USING (true);
CREATE POLICY "admin_users_write" ON admin_users FOR ALL USING (true);

-- Activity logs: acceso completo
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_logs_all" ON activity_logs FOR ALL USING (true);

-- Site settings: acceso completo
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_all" ON site_settings FOR ALL USING (true);

-- =====================================================
-- Índices de rendimiento
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- =====================================================
-- Insertar primer admin (cambiar email según necesites)
-- =====================================================
-- INSERT INTO admin_users (email, name, role) VALUES
--   ('tu-email@gmail.com', 'Administrador', 'admin');
