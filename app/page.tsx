import { createClient } from '@/lib/supabase/server';
import { HomeContent } from '@/components/home-content';
import type { Category, MenuItem, RestaurantInfo } from '@/lib/types';

export default async function HomePage() {
  const supabase = await createClient();

  const [categoriesResult, menuItemsResult, restaurantResult] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('menu_items').select('*').eq('is_available', true).order('name'),
    supabase.from('restaurant_info').select('*').single(),
  ]);

  const categories = (categoriesResult.data || []) as Category[];
  const menuItems = (menuItemsResult.data || []) as MenuItem[];
  const restaurantInfo = restaurantResult.data as RestaurantInfo | null;

  return (
    <HomeContent
      categories={categories}
      menuItems={menuItems}
      restaurantInfo={restaurantInfo}
    />
  );
}
