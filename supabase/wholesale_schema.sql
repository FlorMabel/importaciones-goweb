-- =====================================================
-- PRECIOS POR MAYOR — Tabla de niveles de descuento
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- Tabla para precios por mayor personalizados por producto
CREATE TABLE IF NOT EXISTS product_wholesale_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,           -- ej: '3–11 ud.'
  min_qty INT NOT NULL,          -- cantidad mínima
  max_qty INT,                   -- cantidad máxima (NULL = sin límite)
  discount_percent DECIMAL(5,2), -- porcentaje de descuento (15, 20, 30...)
  fixed_price DECIMAL(10,2),     -- precio fijo override (opcional, si no se usa discount)
  sort_order INT DEFAULT 0
);

-- RLS — acceso completo
ALTER TABLE product_wholesale_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wholesale_tiers_all" ON product_wholesale_tiers FOR ALL USING (true);

-- Índice para búsquedas por producto
CREATE INDEX IF NOT EXISTS idx_wholesale_product ON product_wholesale_tiers(product_id);
