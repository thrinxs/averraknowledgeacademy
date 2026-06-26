import { NextRequest, NextResponse } from 'next/server'
import { sendMessageReplyEmail } from '@/lib/email'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
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
    const {
      to,
      name,
      subject,
      replyContent,
      department,
    } = body

    await sendMessageReplyEmail({
      to,
      name,
      subject,
      replyContent,
      department,
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (err) {
    console.error('Send reply email error:', err)
    return NextResponse.json(
      { error: 'Failed to send email.' },
      { status: 500 }
    )
  }
}