import { NextResponse, NextRequest } from 'next/server';

function base64UrlDecode(str: string) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad === 2) str += '==';
  else if (pad === 3) str += '=';
  else if (pad !== 0) str += '===';
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  const isPublic = pathname === '/' || pathname === '/register';
  if (!isPublic && !token) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payloadJson = base64UrlDecode(parts[1]);
      if (payloadJson) {
        try {
          const payload = JSON.parse(payloadJson);
          if (payload.exp && typeof payload.exp === 'number') {
            const expMs = payload.exp * 1000;
            if (Date.now() > expMs) {
              const res = NextResponse.redirect(new URL('/', req.url));
              res.cookies.set('token', '', { path: '/', maxAge: 0 });
              return res;
            }
          }
        } catch (_) {
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
