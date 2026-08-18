import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run on dashboard routes
  if (!pathname.startsWith('/dashboard') &&
      !pathname.startsWith('/admin/dashboard') &&
      !pathname.startsWith('/affiliate/dashboard') &&
      !pathname.startsWith('/trainer/dashboard') &&
      !pathname.startsWith('/staff/dashboard')) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } =
    await supabase.auth.getUser()

  // Not logged in — redirect to login
  if (!user) {
    return NextResponse.redirect(
      new URL('/auth/login', request.url)
    )
  }

  // Get role using service role key
  const { createClient } = await import(
    '@supabase/supabase-js'
  )
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = profile?.role || 'student'

  const correctRoutes: Record<string, string> = {
    admin: '/admin/dashboard',
    staff: '/staff/dashboard',
    affiliate: '/affiliate/dashboard',
    trainer: '/trainer/dashboard',
    student: '/dashboard',
  }

  const correctPath = correctRoutes[role] || '/dashboard'

  // If on wrong dashboard — redirect to correct one
  if (!pathname.startsWith(correctPath)) {
    return NextResponse.redirect(
      new URL(correctPath, request.url)
    )
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/dashboard/:path*',
    '/affiliate/dashboard/:path*',
    '/trainer/dashboard/:path*',
    '/staff/dashboard/:path*',
  ],
}
