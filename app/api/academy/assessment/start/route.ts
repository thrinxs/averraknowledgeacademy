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

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { assessment_id } = await request.json()
    if (!assessment_id) return NextResponse.json({ error: 'assessment_id required' }, { status: 400 })

    const admin = getAdminClient()

    const { data: assessment } = await admin
      .from('assessments')
      .select('*, academy_children(subjects, year_group_code), academy_enrollments(parent_id)')
      .eq('id', assessment_id)
      .single()

    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })

    const enrollment = Array.isArray(assessment.academy_enrollments)
      ? assessment.academy_enrollments[0]
      : assessment.academy_enrollments
    if (enrollment?.parent_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (assessment.status === 'completed' || assessment.status === 'expired') {
      return NextResponse.json({ error: 'Assessment already completed' }, { status: 400 })
    }

    const child = Array.isArray(assessment.academy_children)
      ? assessment.academy_children[0]
      : assessment.academy_children
    const subjects: string[] = child?.subjects || []
    const yearGroupCode: string = child?.year_group_code || ''

    const totalMinutes = subjects.length * 30
    const expiresAt = new Date(Date.now() + totalMinutes * 60 * 1000).toISOString()

    await admin.from('assessments').update({
      status: 'in_progress',
      started_at: new Date().toISOString(),
      expires_at: expiresAt,
    }).eq('id', assessment_id)

    const allQuestions: Record<string, unknown>[] = []

    for (const subject of subjects) {
      const { data: mcqQuestions } = await admin
        .from('assessment_questions')
        .select('id, subject_code, question_type, question_text, options, difficulty')
        .eq('subject_code', subject)
        .eq('year_group_code', yearGroupCode)
        .eq('question_type', 'mcq')
        .eq('is_active', true)

      const { data: writtenQuestions } = await admin
        .from('assessment_questions')
        .select('id, subject_code, question_type, question_text, options, difficulty')
        .eq('subject_code', subject)
        .eq('year_group_code', yearGroupCode)
        .eq('question_type', 'written')
        .eq('is_active', true)

      const mcq = shuffle(mcqQuestions || []).slice(0, 7)
      const written = shuffle(writtenQuestions || []).slice(0, 3)
      allQuestions.push(...mcq, ...written)
    }

    return NextResponse.json({
      success: true,
      assessment_id,
      expires_at: expiresAt,
      total_minutes: totalMinutes,
      subjects,
      questions: shuffle(allQuestions),
    })
  } catch (err) {
    console.error('Assessment start error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
