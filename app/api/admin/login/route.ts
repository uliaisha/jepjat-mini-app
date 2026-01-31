// import { createClient } from '@/lib/supabase/server';
// import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import bcrypt from 'bcryptjs';

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { username, password } = body;

//     if (!username || !password) {
//       return NextResponse.json(
//         { error: 'Username and password are required' },
//         { status: 400 }
//       );
//     }

//     const supabase = await createClient();

//     // Find admin user
//     const { data: admin, error } = await supabase
//       .from('admin_users')
//       .select('*')
//       .eq('username', username)
//       .single();

//     if (error || !admin) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }


// //     console.log("Girilen şifre:", password);
// // console.log("DB'deki hash:", admin.password_hash);

// // const isValidPassword = await bcrypt.compare(password, admin.password_hash);
// // console.log("Eşleşme sonucu:", isValidPassword);

//     // Verify password
//     // const isValidPassword = await bcrypt.compare(password, admin.password_hash);
// // ESKİ HALİ:
//  const isValidPassword = await bcrypt.compare(password, admin.password_hash);

// // YENİ TEST HALİ:
// // const isValidPassword = (password === "admin123"); // Şifreyi direkt metin olarak kontrol et

//     if (!isValidPassword) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     // Create a simple session token
//     const sessionToken = Buffer.from(
//       JSON.stringify({
//         adminId: admin.id,
//         username: admin.username,
//         exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
//       })
//     ).toString('base64');

//     // Set session cookie
//     const cookieStore = await cookies();
//     cookieStore.set('admin_session', sessionToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 24 * 60 * 60, // 24 hours
//       path: '/',
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Admin login error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }

//   // Verify password kısmından hemen önce ekle:

// }



import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // ŞİMDİLİK VERİTABANINI VE BCRYPT'İ DEVRE DIŞI BIRAKTIK
    // SADECE GİRİŞ YAPABİLMEN İÇİN BU KONTROLÜ YAPIYORUZ
    if (username === 'admin' && password === 'admin123') {
      
      const sessionToken = "gecici_token_123";

      const cookieStore = await cookies();
      cookieStore.set('admin_session', sessionToken, {
        httpOnly: true,
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    // Bilgiler uymuyorsa yine 401 ver
    return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
    
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}