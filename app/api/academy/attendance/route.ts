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

// POST — mark attendance
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()
    const { child_id, enrollment_id, subject_code, status, notes, class_date } = await request.json()

    if (!child_id || !subject_code || !status) {
      return NextResponse.json({ error: 'child_id, subject_code and status required' }, { status: 400 })
    }

    const date = class_date || new Date().toISOString().split('T')[0]

    // Upsert attendance record
    await admin.from('attendance').upsert({
      child_id,
      enrollment_id,
      trainer_id: user.id,
      class_date: date,
      subject_code,
      status,
      notes: notes || null,
      marked_by: user.id,
    }, { onConflict: 'child_id,class_date,subject_code' })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Attendance POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET — get attendance records
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('child_id')
    const month = searchParams.get('month')

    const admin = getAdminClient()
    let query = admin.from('attendance').select('*').order('class_date', { ascending: false })

    if (childId) query = query.eq('child_id', childId)
    if (month) {
      const start = `${month}-01`
      const end = `${month}-31`
      query = query.gte('class_date', start).lte('class_date', end)
    }

    const { data } = await query.limit(100)
    return NextResponse.json({ success: true, attendance: data || [] })
  } catch (err) {
    console.error('Attendance GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
