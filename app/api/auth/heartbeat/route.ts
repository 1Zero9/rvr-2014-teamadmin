import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, SessionData } from '@/app/lib/authz';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false });
    }

    const data = JSON.parse(sessionCookie.value) as SessionData;
    if (!data.id) {
      return NextResponse.json({ authenticated: false });
    }

    const updatedSession: SessionData = {
      ...data,
      lastActiveAt: Date.now(),
    };

    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day max
    });

    return NextResponse.json({ authenticated: true, refreshed: true });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: (error as Error).message });
  }
}
