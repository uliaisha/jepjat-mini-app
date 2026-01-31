-- Insert restaurant info
INSERT INTO restaurant_info (name, description, address, phone, working_hours)
VALUES (
  'Osh Plov Center',
  'Authentic Central Asian cuisine - the best plov in town!',
  'Bishkek, Kyrgyzstan',
  '+996 555 123 456',
  '10:00 - 22:00'
) ON CONFLICT DO NOTHING;

-- Insert categories
INSERT INTO categories (id, name, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Plov', 1),
  ('22222222-2222-2222-2222-222222222222', 'Samsa', 2),
  ('33333333-3333-3333-3333-333333333333', 'Drinks', 3)
ON CONFLICT DO NOTHING;

-- Insert menu items
INSERT INTO menu_items (category_id, name, description, price, sort_order) VALUES
  -- Plov
  ('11111111-1111-1111-1111-111111111111', 'Osh Plov', 'Traditional Uzbek plov with tender lamb, carrots, and aromatic spices', 350, 1),
  ('11111111-1111-1111-1111-111111111111', 'Wedding Plov', 'Premium plov prepared in the traditional wedding style with extra meat', 400, 2),
  -- Samsa
  ('22222222-2222-2222-2222-222222222222', 'Beef Samsa', 'Flaky pastry filled with seasoned minced beef and onions', 120, 1),
  ('22222222-2222-2222-2222-222222222222', 'Chicken Samsa', 'Crispy samsa with juicy chicken filling', 100, 2),
  -- Drinks
  ('33333333-3333-3333-3333-333333333333', 'Tea', 'Traditional green tea', 50, 1),
  ('33333333-3333-3333-3333-333333333333', 'Cola 0.5L', 'Refreshing cola drink', 70, 2)
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123)
-- Password hash generated with bcrypt for 'admin123'
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$rQYlZu9H8VGjGhCf.KROJO/UJEHp8xqJJdQwrCX3VUWF.H/jPKbWy')
ON CONFLICT (username) DO NOTHING;
