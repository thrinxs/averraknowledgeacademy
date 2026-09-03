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

    const { homework_id, responses } = await request.json()
    if (!homework_id || !responses) {
      return NextResponse.json({ error: 'homework_id and responses required' }, { status: 400 })
    }

    const admin = getAdminClient()
    const { data: hw } = await admin
      .from('homework')
      .select('*')
      .eq('id', homework_id)
      .single()

    if (!hw) return NextResponse.json({ error: 'Homework not found' }, { status: 404 })
    if (hw.status !== 'pending') return NextResponse.json({ error: 'Already submitted' }, { status: 400 })

    const questions = hw.questions || []
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

    const percentage = hw.max_score > 0
      ? Math.round((totalScore / hw.max_score) * 100)
      : 0

    await admin.from('homework').update({
      responses: gradedResponses,
      score: totalScore,
      status: 'submitted',
      graded_at: new Date().toISOString(),
    }).eq('id', homework_id)

    return NextResponse.json({ success: true, score: totalScore, max_score: hw.max_score, percentage })
  } catch (err) {
    console.error('Homework submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
