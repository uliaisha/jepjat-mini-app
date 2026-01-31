-- Update restaurant logo
UPDATE restaurant_info SET logo_url = '/images/max-doner-logo.jpg';

-- Update menu items with images
UPDATE menu_items SET image_url = '/images/doner-1.jpg' WHERE name = 'Mix Mini Hot';
UPDATE menu_items SET image_url = '/images/doner-2.jpg' WHERE name = 'Beef Mini Hot';
UPDATE menu_items SET image_url = '/images/doner-1.jpg' WHERE name = 'Chicken Mini';
UPDATE menu_items SET image_url = '/images/doner-2.jpg' WHERE name = 'Beef Max Hot';
UPDATE menu_items SET image_url = '/images/doner-1.jpg' WHERE name = 'Mix Maxi';
UPDATE menu_items SET image_url = '/images/doner-2.jpg' WHERE name = 'Beef Maxi Hot';
