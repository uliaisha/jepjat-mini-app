import React from "react"
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Allow access to login page without auth
  // Other pages will be protected individually
  
  return <>{children}</>;
}
