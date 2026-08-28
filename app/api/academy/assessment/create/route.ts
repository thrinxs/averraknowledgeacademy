import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { enrollment_id } = await request.json()
    if (!enrollment_id) {
      return NextResponse.json({ error: 'enrollment_id required' }, { status: 400 })
    }

    const admin = getAdminClient()

    const { data: children } = await admin
      .from('academy_children')
      .select('id, subjects, year_group_code')
      .eq('enrollment_id', enrollment_id)

    if (!children || children.length === 0) {
      return NextResponse.json({ error: 'No children found' }, { status: 404 })
    }

    const created = []
    for (const child of children) {
      const { data: existing } = await admin
        .from('assessments')
        .select('id')
        .eq('child_id', child.id)
        .maybeSingle()

      if (existing) { created.push(existing.id); continue }

      const { data: assessment } = await admin
        .from('assessments')
        .insert({ enrollment_id, child_id: child.id, status: 'pending' })
        .select('id')
        .single()

      if (assessment) created.push(assessment.id)
    }

    return NextResponse.json({ success: true, assessment_ids: created })
  } catch (err) {
    console.error('Assessment create error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
