import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the user is trying to access dashboard without authentication
  if (pathname.startsWith('/dashboard')) {
    const sessionToken = request.cookies.get('session-token')?.value
    
    // If no session token, redirect to sign-in
    if (!sessionToken) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}