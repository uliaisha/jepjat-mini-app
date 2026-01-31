import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { OrderStatusContent } from '@/components/order-status-content';
import type { OrderWithItems } from '@/lib/types';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        menu_item:menu_items (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  return <OrderStatusContent order={order as OrderWithItems} />;
}
