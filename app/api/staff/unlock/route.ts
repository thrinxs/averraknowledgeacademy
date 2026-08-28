import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-server'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()
    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { user_id } = await request.json()
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    await admin.from('staff_credentials').update({
      locked_at: null,
      failed_attempts: 0,
    }).eq('user_id', user_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Staff unlock error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
