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

    const { test_id, responses } = await request.json()
    const admin = getAdminClient()

    const { data: test } = await admin
      .from('tests_exams')
      .select('*')
      .eq('id', test_id)
      .single()

    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 })

    const questions = test.questions || []
    let totalScore = 0

    const gradedResponses = responses.map((resp: { question_id: number; answer: string }) => {
      const q = questions.find((q: { id: number; type: string; correct_answer: string; marks: number }) => q.id === resp.question_id)
      if (!q) return resp
      let earned = 0
      if (q.type === 'mcq' || q.type === 'truefalse') {
        if (resp.answer?.trim().toLowerCase() === q.correct_answer?.trim().toLowerCase()) {
          earned = q.marks
        }
      } else if (q.type === 'written') {
        if (resp.answer && resp.answer.trim().length > 10) {
          earned = Math.floor(q.marks * 0.5)
        }
      }
      totalScore += earned
      return { ...resp, earned_marks: earned, max_marks: q.marks }
    })

    const percentage = test.max_score > 0
      ? Math.round((totalScore / test.max_score) * 100)
      : 0

    const levelResult = percentage >= 70 ? 'advanced'
      : percentage >= 40 ? 'intermediate' : 'beginner'

    await admin.from('tests_exams').update({
      responses: gradedResponses,
      score: totalScore,
      status: 'completed',
      level_result: levelResult,
      graded_at: new Date().toISOString(),
    }).eq('id', test_id)

    return NextResponse.json({
      success: true,
      score: totalScore,
      max_score: test.max_score,
      percentage,
      level_result: levelResult,
    })
  } catch (err) {
    console.error('Test submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
