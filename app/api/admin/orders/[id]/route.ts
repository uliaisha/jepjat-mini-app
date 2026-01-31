import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: OrderStatus };

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Admin order update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
