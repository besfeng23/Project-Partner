import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyIdToken } from './lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const idToken = request.cookies.get('idToken')?.value

  const isAuthPage = pathname.startsWith('/login')

  if (!idToken) {
    if (isAuthPage) {
      return NextResponse.next()
    }
    // Redirect to login if not authenticated and not on an auth page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If there's a token, verify it
  try {
    const decodedToken = await verifyIdToken(idToken);
    if (!decodedToken) {
        throw new Error("Invalid token");
    }
    
    // If user is authenticated and tries to access login page, redirect to home
    if (isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next();

  } catch (error) {
    console.log('Middleware token verification error:', error);
    // If token verification fails, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('idToken');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
