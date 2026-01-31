-- Add new columns to menu_items table
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_spicy BOOLEAN DEFAULT FALSE;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT '#F5E6D3';
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT '1 г / мл / шт.';

-- Add new columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'delivery';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS utensils_count INTEGER DEFAULT 1;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee INTEGER DEFAULT 190;
