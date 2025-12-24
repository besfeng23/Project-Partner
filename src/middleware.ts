import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const idToken = request.cookies.get('idToken')?.value

  const isAuthPage = pathname.startsWith('/login')

  if (!idToken) {
    if (isAuthPage) {
      // If on the login page and not authenticated, allow access
      return NextResponse.next()
    }
    // If not authenticated, redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is authenticated (has a token) and tries to access the login page,
  // redirect them to the main dashboard.
  if (isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If authenticated and not on an auth page, allow the request to proceed.
  return NextResponse.next();
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
