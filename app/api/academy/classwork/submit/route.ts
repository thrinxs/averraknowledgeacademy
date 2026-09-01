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

interface Question {
  id: number
  type: string
  correct_answer: string
  marks: number
}

interface Response {
  question_id: number
  answer: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { classwork_id, responses } = await request.json()
    if (!classwork_id || !responses) {
      return NextResponse.json({ error: 'classwork_id and responses required' }, { status: 400 })
    }

    const admin = getAdminClient()

    // Get classwork
    const { data: classwork } = await admin
      .from('classwork')
      .select('*')
      .eq('id', classwork_id)
      .single()

    if (!classwork) return NextResponse.json({ error: 'Classwork not found' }, { status: 404 })
    if (classwork.status !== 'pending') {
      return NextResponse.json({ error: 'Already submitted' }, { status: 400 })
    }

    // Auto-grade
    const questions: Question[] = classwork.questions || []
    let totalScore = 0
    const gradedResponses = responses.map((resp: Response) => {
      const question = questions.find(q => q.id === resp.question_id)
      if (!question) return resp

      let earned = 0
      if (question.type === 'mcq' || question.type === 'truefalse') {
        if (resp.answer?.trim().toLowerCase() === question.correct_answer?.trim().toLowerCase()) {
          earned = question.marks
        }
      } else if (question.type === 'written') {
        // Partial credit for written — trainer reviews later
        if (resp.answer && resp.answer.trim().length > 10) {
          earned = Math.floor(question.marks * 0.5) // 50% pending review
        }
      }

      totalScore += earned
      return { ...resp, earned_marks: earned, max_marks: question.marks }
    })

    const percentage = classwork.max_score > 0
      ? Math.round((totalScore / classwork.max_score) * 100)
      : 0

    // Update classwork
    await admin.from('classwork').update({
      responses: gradedResponses,
      score: totalScore,
      status: 'submitted',
      graded_at: new Date().toISOString(),
    }).eq('id', classwork_id)

    return NextResponse.json({
      success: true,
      score: totalScore,
      max_score: classwork.max_score,
      percentage,
      needs_review: responses.some((r: Response) => {
        const q = questions.find(q => q.id === r.question_id)
        return q?.type === 'written'
      }),
    })
  } catch (err) {
    console.error('Classwork submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
