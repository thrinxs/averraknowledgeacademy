import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getDashboardRouteByRole } from '@/utils/auth'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tokenHash =
    requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next =
    requestUrl.searchParams.get('next') || ''

  const supabase = await createSupabaseServerClient()

  try {
    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
    } else if (tokenHash && type) {
      await supabase.auth.verifyOtp({
        type: type as EmailOtpType,
        token_hash: tokenHash,
      })
    }

    if (
      type === 'recovery' ||
      next === '/auth/reset-password'
    ) {
      return NextResponse.redirect(
        new URL('/auth/reset-password', request.url)
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(
        new URL(
          '/auth/login?error=auth_callback_failed',
          request.url
        )
      )
    }

    await supabase
      .from('profiles')
      .update({ email_verified: true })
      .eq('id', user.id)

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const route = getDashboardRouteByRole(
      profile?.role
    )

    const redirectUrl = new URL(route, request.url)
    redirectUrl.searchParams.set('verified', 'true')

    return NextResponse.redirect(redirectUrl)
  } catch {
    return NextResponse.redirect(
      new URL('/auth/login?error=auth_callback_failed', request.url)
    )
  }
}