-- Clear existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_items;
DELETE FROM categories;
DELETE FROM restaurant_info;

-- Insert Max Doner restaurant info
INSERT INTO restaurant_info (name, description, address, phone, working_hours, logo_url)
VALUES (
  'Max Doner',
  'Лучшие донеры в городе',
  'улица Тыналиева, 1/3',
  '+996 555 123 456',
  '09:00 - 23:30',
  '/logo.png'
);

-- Insert categories
INSERT INTO categories (id, name, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Донеры', 1),
  ('22222222-2222-2222-2222-222222222222', 'Закуски', 2),
  ('33333333-3333-3333-3333-333333333333', 'Комбо', 3),
  ('44444444-4444-4444-4444-444444444444', 'Напитки', 4),
  ('55555555-5555-5555-5555-555555555555', 'Томбик', 5);

-- Insert Донеры (Doners)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, bg_color, unit, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mix Mini Hot', 'Мини донер с курицей и говядиной', 249, true, '#F5E6D3', '1 г / мл / шт.', 1),
  ('11111111-1111-1111-1111-111111111111', 'Beef Mini Hot', 'Мини донер с говядиной', 289, true, '#C84B4B', '1 г / мл / шт.', 2),
  ('11111111-1111-1111-1111-111111111111', 'Chicken Mini', 'Мини донер с курицей', 219, false, '#F5E6D3', '1 г / мл / шт.', 3),
  ('11111111-1111-1111-1111-111111111111', 'Beef Max Hot', 'Большой донер с говядиной', 319, true, '#C84B4B', '1 г / мл / шт.', 4),
  ('11111111-1111-1111-1111-111111111111', 'Mix Max', 'Большой донер микс', 349, false, '#4A90D9', '1 г / мл / шт.', 5),
  ('11111111-1111-1111-1111-111111111111', 'Chicken Max', 'Большой донер с курицей', 299, false, '#F5E6D3', '1 г / мл / шт.', 6);

-- Insert Закуски (Snacks)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, bg_color, unit, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Картошка фри', 'Хрустящий картофель фри', 99, false, '#F5E6D3', '150 г', 1),
  ('22222222-2222-2222-2222-222222222222', 'Картошка с сыром', 'Картофель фри с сырным соусом', 149, false, '#F5E6D3', '200 г', 2),
  ('22222222-2222-2222-2222-222222222222', 'Наггетсы', 'Куриные наггетсы 6 шт', 129, false, '#C84B4B', '6 шт.', 3);

-- Insert Комбо (Combo)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, bg_color, unit, sort_order) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Комбо Mini', 'Мини донер + картошка + напиток', 399, false, '#4A90D9', '1 шт.', 1),
  ('33333333-3333-3333-3333-333333333333', 'Комбо Max', 'Большой донер + картошка + напиток', 499, false, '#C84B4B', '1 шт.', 2),
  ('33333333-3333-3333-3333-333333333333', 'Комбо Family', 'Для 2-3 человек', 899, false, '#F5E6D3', '1 шт.', 3);

-- Insert Напитки (Drinks)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, bg_color, unit, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Coca-Cola', 'Освежающий напиток', 69, false, '#C84B4B', '0.5 л', 1),
  ('44444444-4444-4444-4444-444444444444', 'Fanta', 'Апельсиновый напиток', 69, false, '#F5A623', '0.5 л', 2),
  ('44444444-4444-4444-4444-444444444444', 'Sprite', 'Лимонный напиток', 69, false, '#4CAF50', '0.5 л', 3),
  ('44444444-4444-4444-4444-444444444444', 'Вода', 'Питьевая вода', 39, false, '#4A90D9', '0.5 л', 4),
  ('44444444-4444-4444-4444-444444444444', 'Чай', 'Горячий чай', 49, false, '#F5E6D3', '1 шт.', 5);

-- Insert Томбик
INSERT INTO menu_items (category_id, name, description, price, is_spicy, bg_color, unit, sort_order) VALUES
  ('55555555-5555-5555-5555-555555555555', 'Томбик Beef', 'Томбик с говядиной', 189, false, '#C84B4B', '1 шт.', 1),
  ('55555555-5555-5555-5555-555555555555', 'Томбик Chicken', 'Томбик с курицей', 169, false, '#F5E6D3', '1 шт.', 2),
  ('55555555-5555-5555-5555-555555555555', 'Томбик Mix', 'Томбик микс', 199, false, '#4A90D9', '1 шт.', 3);
