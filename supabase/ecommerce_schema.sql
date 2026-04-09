-- =====================================================
-- E-COMMERCE CATALOG AND ORDERS SCHEMA
-- Esquema maestro del catálogo y pedidos
-- =====================================================

-- Categorías
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  hero_image_url TEXT,
  color TEXT,
  sort_order INT DEFAULT 0
);

-- Productos
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id),
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  currency TEXT DEFAULT 'PEN',
  badge TEXT,
  badge_color TEXT,
  description TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INT DEFAULT 0,
  stock INT DEFAULT 0,
  sku TEXT,
  wholesale_enabled BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  sale_percent INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Imágenes de producto (1:N)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Especificaciones (1:N)
CREATE TABLE IF NOT EXISTS product_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL
);

-- Fragancias (1:N)
CREATE TABLE IF NOT EXISTS product_fragrances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT
);

-- Colores disponibles (1:N)
CREATE TABLE IF NOT EXISTS product_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  hex_color TEXT NOT NULL
);

-- Productos relacionados (N:N)
CREATE TABLE IF NOT EXISTS related_products (
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  related_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, related_id)
);

-- Tags de producto (para búsqueda)
CREATE TABLE IF NOT EXISTS product_tags (
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (product_id, tag)
);

-- Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_dni TEXT,
  department TEXT,
  city TEXT,
  address TEXT,
  payment_method TEXT,
  subtotal DECIMAL(10,2),
  shipping DECIMAL(10,2),
  total DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  variant TEXT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- Vistas útiles
CREATE OR REPLACE VIEW deals AS
  SELECT * FROM products WHERE is_on_sale = true;

CREATE OR REPLACE VIEW new_arrivals AS
  SELECT * FROM products WHERE is_new = true ORDER BY created_at DESC;

CREATE OR REPLACE VIEW search_index AS
  SELECT p.id, p.name, p.slug, p.price, p.category_id,
    (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY sort_order LIMIT 1) as image,
    array_agg(DISTINCT t.tag) as tags
  FROM products p
  LEFT JOIN product_tags t ON t.product_id = p.id
  GROUP BY p.id;

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
