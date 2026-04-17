-- 0. Limpiar base de datos (Opcional, útil para re-ejecutar)
TRUNCATE categories, products, prices RESTART IDENTITY CASCADE;

-- 1. Esquema Completo (Categorías, Productos, Precios)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    description TEXT,
    titulo_card TEXT,
    is_combo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL
);

-- 2. Categorías
INSERT INTO categories (name, slug) VALUES 
('Perros', 'perros'),
('Hamburguesas', 'burgers'),
('Combos Perros', 'combos-perros'),
('Combos Hamburguesas', 'combos-burgers'),
('Combos Papas', 'combos-papas'),
('Combos Mixtos', 'combos-mixtos'),
('Terneritos', 'terneritos'),
('Bebidas', 'bebidas')
ON CONFLICT (slug) DO NOTHING;

-- 3. Migración de datos (Bloque de código para ejecutar en el SQL Editor)
DO $$
DECLARE
    cat_id UUID;
    prod_id UUID;
BEGIN
    -- Perros
    SELECT id INTO cat_id FROM categories WHERE slug = 'perros';
    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'Perro Normal', 'Salchicha ahumada, ensalada, papitas, cebolla y queso llanero.', '') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, '1x', 1.40), (prod_id, '2x', 2.80);
    
    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'Perro Especial', 'Salchicha ahumada, ensalada, papitas, cebolla, jamón, tocineta y queso amarillo.', '') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, '1x', 2.50), (prod_id, '2x', 5.00);

    -- Burgers
    SELECT id INTO cat_id FROM categories WHERE slug = 'burgers';
    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'Burguir Normal', 'Carne de res, vegetales, papitas, cebolla caramelizada y salsas.', '') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 2.80);
    
    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'Hamburguesa Chicken', 'Pollo, vegetales, papitas, cebolla caramelizada y salsas.', '') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 3.20);

    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'MC Borguir', 'Carne de res, lechuga, cebolla caramelizada, queso amarillo y pepinillo.', '') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 3.50);

    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'Especial Proteica', 'Carne de res, vegetales, huevo, jamón, queso amarillo y tocineta.', '') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 5.25);

    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'Chicken S', 'Pollo, vegetales, jamón, queso amarillo y tocineta.', '') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 5.65);

    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'Hamburguesa Doble', '2 Carnes de res, jamón, queso amarillo, tocineta y huevo.', '') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 7.20);

    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'Hamburguesa Mixta', 'Carne de res + Pollo, jamón, queso amarillo, tocineta y huevo.', '') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 7.80);

    -- Combos Perros (Restantes)
    SELECT id INTO cat_id FROM categories WHERE slug = 'combos-perros';
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Combo 2 Perros Especiales + Refresco 400ml', '2 Perros Especiales + Refresco 400ml', '2 ESPECIALES + REFRESCO', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 5.45);

    -- Combos Burgers (Restantes)
    SELECT id INTO cat_id FROM categories WHERE slug = 'combos-burgers';
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Chicken + 1 Refresco 400ml', 'Hamburguesa Chicken + 1 Refresco', 'CHICKEN + 1 REFRESCO', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 3.85);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Mc Borguir + 1 Refresco 400ml', 'Mc Borguir + 1 Refresco', 'MC BORGUIR + 1 REFRESCO', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 3.85);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Proteica + 1 Refresco 400ml', 'Especial Proteica + 1 Refresco', '1 PROTEICA + 1 REFRESCO', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 5.75);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Special Chicken + 1 Refresco 400ml', 'Special Chicken + 1 Refresco', 'SPECIAL CHICKEN + 1 REFRESCO', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 6.15);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Doble + 1 Refresco 400ml', 'Hamburguesa Doble + 1 Refresco', 'DOBLE + 1 REFRESCO', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 7.50);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Mixta + 1 Refresco 400ml', 'Hamburguesa Mixta + 1 Refresco', 'MIXTA + 1 REFRESCO', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 8.20);

    -- Combos Papas
    SELECT id INTO cat_id FROM categories WHERE slug = 'combos-papas';
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Combo Clásica + Papas', '', 'CLÁSICA + PAPAS', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 4.30);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Combo Chicken + Papas', '', 'CHICKEN + PAPAS', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 4.70);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Combo Mc Borguir + Papas', '', 'MC BORGUIR + PAPAS', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 4.90);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Combo Proteica + Papas', '', 'PROTEICA + PAPAS', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 6.75);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Combo Doble + Papas', '', 'DOBLE + PAPAS', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 8.40);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Papas', 'Full o Media ración', 'RACIÓN DE PAPAS', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Media', 2.90), (prod_id, 'Full', 5.00);

    -- Combos Mixtos
    SELECT id INTO cat_id FROM categories WHERE slug = 'combos-mixtos';
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Promo Perro Normal + Especial', 'Perro Normal + Perro Especial + Refresco.', 'NORMAL + ESPECIAL', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 4.55);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Promo DÚO: 1 Perro + 1 Borguir + Refresco', '1 Perro Clásico + 1 Borguir Clásica + Refresco.', 'PERRO CLÁSICO + B. CLÁSICA', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 4.85);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Promo TRÍO: 3 Mc Borguir + Refresco 1L', '3 Mc Borguir + Refresco 1 Litro.', '3 MC BORGUIR + REFRESCO 1L', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 11.20);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Promo 2 Proteicas + Refresco 1L', '2 Hamburguesas Proteicas + Refresco 1 Litro.', '2 PROTEICAS + REFRESCO 1L', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 11.20);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Promo 2 Chicken S + Refresco 1L', '2 Chicken (S) + Refresco 1 Litro.', '2 CHICKEN (S) + REFRESCO 1L', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 12.00);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Promo PAREJA: 2 Mixtas + Refresco 1L', '2 Mixtas + Refresco 1 Litro.', '2 MIXTAS + REFRESCO 1L', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 16.30);
    INSERT INTO products (category_id, name, description, titulo_card, is_combo) VALUES (cat_id, 'Promo MEGA DOBLE: 3 Dobles + Refresco 1L', '3 Dobles + Refresco 1 Litro.', '3 DOBLES + REFRESCO 1L', true) RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 22.20);

    -- Terneritos
    SELECT id INTO cat_id FROM categories WHERE slug = 'terneritos';
    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, '2 Terneritos Especiales', 'Pan Jumbo, carne, pollo, ensalada, papitas, jamón, tocineta y queso amarillo.', '2 TERNERITOS ESPECIALES') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, 'Pedir', 7.80);

    -- Bebidas
    SELECT id INTO cat_id FROM categories WHERE slug = 'bebidas';
    INSERT INTO products (category_id, name, description, titulo_card) VALUES (cat_id, 'Refresco', 'Variedad de refrescos', 'REFRESCOS') RETURNING id INTO prod_id;
    INSERT INTO prices (product_id, label, amount) VALUES (prod_id, '400ml', 0.70), (prod_id, 'Glup 1 Litro', 0.90);

END $$;

-- 4. Seguridad (Row Level Security)
-- Habilitar RLS en todas las tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas existentes para evitar errores al re-ejecutar
DROP POLICY IF EXISTS "Allow public select on categories" ON categories;
DROP POLICY IF EXISTS "Allow anon all on categories" ON categories;
DROP POLICY IF EXISTS "Allow public select on products" ON products;
DROP POLICY IF EXISTS "Allow anon all on products" ON products;
DROP POLICY IF EXISTS "Allow public select on prices" ON prices;
DROP POLICY IF EXISTS "Allow anon all on prices" ON prices;

-- Políticas para Categorías
CREATE POLICY "Allow public select on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow anon all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- Políticas para Productos
CREATE POLICY "Allow public select on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow anon all on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Políticas para Precios
CREATE POLICY "Allow public select on prices" ON prices FOR SELECT USING (true);
CREATE POLICY "Allow anon all on prices" ON prices FOR ALL USING (true) WITH CHECK (true);

-- 5. Habilitar Realtime para cambios dinámicos
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE categories, products, prices;
COMMIT;
