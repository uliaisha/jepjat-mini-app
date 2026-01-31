import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_item:menu_items (*)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Admin orders API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
