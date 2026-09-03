import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-server'

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
    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { data: staffProfiles } = await admin
      .from('profiles')
      .select('id, full_name, email, role')
      .in('role', ['admin', 'staff', 'trainer', 'principal'])
      .order('created_at', { ascending: false })

    const { data: credentials } = await admin
      .from('staff_credentials')
      .select('user_id, onboarding_completed, locked_at, failed_attempts')

    const credsMap = new Map((credentials || []).map(c => [c.user_id, c]))

    const staff = (staffProfiles || []).map(p => {
      const creds = credsMap.get(p.id) || { onboarding_completed: false, locked_at: null, failed_attempts: 0 }
      return {
        user_id: p.id,
        full_name: p.full_name,
        email: p.email,
        role: p.role,
        onboarding_completed: creds.onboarding_completed,
        locked_at: creds.locked_at,
        failed_attempts: creds.failed_attempts,
      }
    })

    return NextResponse.json({ staff })
  } catch (err) {
    console.error('Staff list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
