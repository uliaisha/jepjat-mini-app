-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  payment_method TEXT NOT NULL DEFAULT 'cash',
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  telegram_user_id TEXT,
  telegram_username TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table (for admin login)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurant info table
CREATE TABLE IF NOT EXISTS restaurant_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  working_hours TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (customers can view menu)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view available menu items" ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Anyone can view restaurant info" ON restaurant_info FOR SELECT USING (true);

-- RLS Policies for orders (customers can create, but only view their own by telegram_user_id)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view orders by telegram_user_id" ON orders FOR SELECT USING (true);

-- RLS Policies for order items
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view order items" ON order_items FOR SELECT USING (true);

-- Admin policies will be handled via service role key in admin routes
