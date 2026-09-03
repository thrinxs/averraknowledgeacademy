import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('child_id')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    if (!childId) return NextResponse.json({ error: 'child_id required' }, { status: 400 })

    const admin = getAdminClient()
    const { data: homeworks } = await admin
      .from('homework')
      .select('*')
      .eq('child_id', childId)
      .eq('assigned_date', date)
      .order('subject_code')

    return NextResponse.json({ success: true, homeworks: homeworks || [] })
  } catch (err) {
    console.error('Homework GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
