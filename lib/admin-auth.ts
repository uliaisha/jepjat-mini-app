import { cookies } from 'next/headers';

interface AdminSession {
  adminId: string;
  username: string;
  exp: number;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
    ) as AdminSession;

    if (session.exp < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function requireAdminAuth() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
