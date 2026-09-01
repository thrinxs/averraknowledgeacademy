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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()
    const { topic_id, status, notes, child_id } = await request.json()

    if (!topic_id || !status || !child_id) {
      return NextResponse.json({ error: 'topic_id, status and child_id required' }, { status: 400 })
    }

    // Update this topic
    await admin.from('learning_roadmap_progress').update({
      status,
      trainer_notes: notes || null,
      completed_by: status === 'completed' ? user.id : null,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      started_at: status === 'current' ? new Date().toISOString() : null,
    }).eq('id', topic_id)

    // If marking as completed, set the next topic to 'current'
    if (status === 'completed') {
      const { data: completedTopic } = await admin
        .from('learning_roadmap_progress')
        .select('topic_index, subject_code')
        .eq('id', topic_id)
        .single()

      if (completedTopic) {
        const { data: nextTopic } = await admin
          .from('learning_roadmap_progress')
          .select('id')
          .eq('child_id', child_id)
          .eq('subject_code', completedTopic.subject_code)
          .eq('topic_index', completedTopic.topic_index + 1)
          .maybeSingle()

        if (nextTopic) {
          await admin.from('learning_roadmap_progress').update({
            status: 'current',
            started_at: new Date().toISOString(),
          }).eq('id', nextTopic.id)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Roadmap update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
