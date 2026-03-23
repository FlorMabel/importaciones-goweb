-- Categorías
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,         -- URL de Cloudinary
  hero_image_url TEXT,    -- URL de Cloudinary
  color TEXT,
  sort_order INT DEFAULT 0
);

-- Productos
CREATE TABLE products (
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
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  sale_percent INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Imágenes de producto (1:N)
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,  -- URL de Cloudinary
  sort_order INT DEFAULT 0
);

-- Especificaciones (1:N)
CREATE TABLE product_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL
);

-- Fragancias (1:N, para esencias/quemadores)
CREATE TABLE product_fragrances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT
);

-- Colores disponibles (1:N)
CREATE TABLE product_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  hex_color TEXT NOT NULL
);

-- Productos relacionados (N:N)
CREATE TABLE related_products (
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  related_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, related_id)
);

-- Tags de producto (para búsqueda)
CREATE TABLE product_tags (
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (product_id, tag)
);

-- Pedidos (Registro de Checkout)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
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

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  variant TEXT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- Vistas útiles
CREATE VIEW deals AS
  SELECT * FROM products WHERE is_on_sale = true;

CREATE VIEW new_arrivals AS
  SELECT * FROM products WHERE is_new = true ORDER BY created_at DESC;

CREATE VIEW search_index AS
  SELECT p.id, p.name, p.slug, p.price, p.category_id,
    (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY sort_order LIMIT 1) as image,
    array_agg(DISTINCT t.tag) as tags
  FROM products p
  LEFT JOIN product_tags t ON t.product_id = p.id
  GROUP BY p.id;
  