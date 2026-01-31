export interface Category {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_spicy: boolean;
  bg_color: string | null;
  unit: string | null;
  created_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  telegram_user_id?: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string | null;
  order_type?: string;
  utensils_count?: number;
  delivery_fee?: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  menu_item?: MenuItem;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { menu_item: MenuItem })[];
}

export interface RestaurantInfo {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  working_hours: string | null;
  open_time: string;
  close_time: string;
  logo_url: string | null;
  min_order_amount: number;
  delivery_fee: number;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}
