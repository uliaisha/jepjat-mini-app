// import { updateSession } from '@/lib/supabase/proxy'
// import { type NextRequest, NextResponse } from 'next/server'

// export async function middleware(request: NextRequest) {
//   // 1. Önce çerezi kontrol edelim
//   const session = request.cookies.get('admin_session')
  
//   // 2. Eğer admin sayfasına gidiliyorsa ve bizim koyduğumuz geçici token varsa, engelleme!
//   if (request.nextUrl.pathname.startsWith('/admin') && session?.value === 'gecici_token_123') {
//     return NextResponse.next()
//   }

//   // 3. Diğer tüm durumlar için orijinal Supabase kontrolünü yap
//   return await updateSession(request)
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Hiçbir kontrol yapma, her şeye izin ver
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'], // Sadece admin yollarını etkilesin
}