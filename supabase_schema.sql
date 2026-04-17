-- Tabla para las categorías de productos
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- Tabla para los productos (burgers, perros, combos, etc.)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    description TEXT,
    titulo_card TEXT,
    is_combo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para los precios (un producto puede tener varios precios, ej: 1x, 2x)
CREATE TABLE prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    label TEXT NOT NULL, -- Ej: "1x", "2x", "Pedir", "Media", "Full"
    amount DECIMAL(10, 2) NOT NULL
);

-- Insertar categorías iniciales
INSERT INTO categories (name, slug) VALUES 
('Perros', 'perros'),
('Hamburguesas', 'burgers'),
('Combos Perros', 'combos-perros'),
('Combos Hamburguesas', 'combos-burgers'),
('Combos Papas', 'combos-papas'),
('Combos Mixtos', 'combos-mixtos'),
('Terneritos', 'terneritos'),
('Bebidas', 'bebidas');
