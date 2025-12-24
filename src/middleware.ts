import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const idToken = request.cookies.get('idToken')?.value

  const isAuthPage = pathname.startsWith('/login')

  // If user is not authenticated and is not on the login page, redirect to login.
  if (!idToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is authenticated and tries to access the login page, redirect to the dashboard.
  if (idToken && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Otherwise, allow the request to proceed.
  return NextResponse.next()
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
