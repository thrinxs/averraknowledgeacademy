import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()
    const { data: children } = await admin
      .from('academy_children')
      .select('id, full_name, year_group_label, subjects, enrollment_id')
      .eq('assigned_trainer_id', user.id)
      .order('full_name')

    return NextResponse.json({ success: true, children: children || [] })
  } catch (err) {
    console.error('Students GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
