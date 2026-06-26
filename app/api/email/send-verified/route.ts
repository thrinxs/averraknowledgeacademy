import { NextRequest, NextResponse } from 'next/server'
import { sendMatchesVerifiedEmail } from '@/lib/email'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Verify the requester is an admin
    const supabase =
      await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { to, name, packageName } = body

    if (!to || !name) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    await sendMatchesVerifiedEmail({
      to,
      name,
      packageName: packageName || 'Basic',
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (err) {
    console.error('Send verified email error:', err)
    return NextResponse.json(
      { error: 'Failed to send email.' },
      { status: 500 }
    )
  }
}