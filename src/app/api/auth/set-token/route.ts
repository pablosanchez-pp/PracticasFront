import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = typeof body === 'object' && body ? (body as any).token : null;
    const res = NextResponse.json({ ok: !!token });
    if (token) {
      res.cookies.set('token', String(token), {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
      });
    }
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
}
