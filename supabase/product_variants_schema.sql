-- =====================================================
-- PRODUCT VARIANTS CATALOG
-- Esquema de variantes (tallas, tamaños, precios)
-- =====================================================

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  stock INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_variants_all" ON product_variants FOR ALL USING (true);

-- Índice
CREATE INDEX IF NOT EXISTS idx_variant_product ON product_variants(product_id);
