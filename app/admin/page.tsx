import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import type { OrderWithItems } from '@/lib/types';



export default async function AdminPage() {
  // const session = await getAdminSession(); // Bunu yorum satırı yap
  
  // Şimdilik sahte bir session objesi oluştur
  const session = { username: 'admin' }; 

  // if (!session) { 
  //   redirect('/admin/login');
  // }
  
  // ... geri kalan kodlar aynı kalsın

// export default async function AdminPage() {
//   const session = await getAdminSession();

//   if (!session) {
//     redirect('/admin/login');
//   }

  const supabase = await createClient();

  const { data: orders } = await supabase
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

  return (
    <AdminDashboard
      orders={(orders || []) as OrderWithItems[]}
      adminUsername={session.username}
    />
  );
}
