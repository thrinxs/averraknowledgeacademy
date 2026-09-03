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
    if (!['admin', 'principal'].includes(profile?.role || '')) return NextResponse.json({ error: 'Admin or Principal only' }, { status: 403 })

    const { child_id, trainer_id } = await request.json()
    if (!child_id || !trainer_id) return NextResponse.json({ error: 'child_id and trainer_id required' }, { status: 400 })

    // Get trainer name
    const { data: trainer } = await admin.from('profiles').select('full_name, email').eq('id', trainer_id).single()
    if (!trainer) return NextResponse.json({ error: 'Trainer not found' }, { status: 404 })

    // Assign trainer to child
    await admin.from('academy_children').update({
      assigned_trainer_id: trainer_id,
      assigned_trainer_name: trainer.full_name,
    }).eq('id', child_id)

    // Notify trainer
    await admin.from('notifications').insert({
      user_id: trainer_id,
      type: 'assignment',
      title: 'New Student Assigned',
      message: 'A new learner has been assigned to you. Check your students page to view their details.',
      is_read: false,
      link: '/trainer/dashboard/students',
    })

    // Auto-generate learning roadmap for this child
    try {
      const origin = request.headers.get('origin') || 'https://www.averraknowledgeacademy.com'
      const { data: child } = await admin
        .from('academy_children')
        .select('enrollment_id')
        .eq('id', child_id)
        .single()

      if (child?.enrollment_id) {
        await fetch(`${origin}/api/academy/roadmap/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ child_id, enrollment_id: child.enrollment_id }),
        })
      }
    } catch (roadmapErr) {
      console.error('Roadmap generation error (non-fatal):', roadmapErr)
    }

    return NextResponse.json({ success: true, trainer_name: trainer.full_name })
  } catch (err) {
    console.error('Assign trainer error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
