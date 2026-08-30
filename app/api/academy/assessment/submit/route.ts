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

function gradeWritten(response: string, correctAnswer: string, keywords: string[]): { is_correct: boolean; marks_awarded: number } {
  if (!response || response.trim() === '') return { is_correct: false, marks_awarded: 0 }
  const resp = response.toLowerCase().trim()
  const correct = correctAnswer.toLowerCase().trim()
  if (resp === correct) return { is_correct: true, marks_awarded: 1 }
  if (keywords && keywords.length > 0) {
    const matched = keywords.filter(kw => resp.includes(kw.toLowerCase()))
    const ratio = matched.length / keywords.length
    if (ratio >= 0.8) return { is_correct: true, marks_awarded: 1 }
    if (ratio >= 0.4) return { is_correct: false, marks_awarded: 0.5 }
  }
  return { is_correct: false, marks_awarded: 0 }
}

function determineLevel(score: number): string {
  if (score >= 70) return 'advanced'
  if (score >= 40) return 'intermediate'
  return 'beginner'
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { assessment_id, responses } = await request.json()
    if (!assessment_id || !responses) {
      return NextResponse.json({ error: 'assessment_id and responses required' }, { status: 400 })
    }

    const admin = getAdminClient()

    const { data: assessment } = await admin
      .from('assessments')
      .select('*, academy_enrollments(parent_id)')
      .eq('id', assessment_id)
      .single()

    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })

    const enrollment = Array.isArray(assessment.academy_enrollments)
      ? assessment.academy_enrollments[0]
      : assessment.academy_enrollments
    if (enrollment?.parent_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (assessment.status === 'completed') {
      return NextResponse.json({ error: 'Already submitted' }, { status: 400 })
    }

    const isExpired = assessment.expires_at && new Date(assessment.expires_at) < new Date()
    const questionIds = responses.map((r: { question_id: string }) => r.question_id)
    const { data: questions } = await admin
      .from('assessment_questions')
      .select('id, subject_code, question_type, correct_answer, keywords')
      .in('id', questionIds)

    const questionMap = new Map((questions || []).map(q => [q.id, q]))

    const gradedResponses = responses.map((r: { question_id: string; subject_code: string; response: string }) => {
      const question = questionMap.get(r.question_id)
      if (!question) return null
      let is_correct = false
      let marks_awarded = 0
      if (question.question_type === 'mcq') {
        is_correct = r.response?.trim().toLowerCase() === question.correct_answer?.trim().toLowerCase()
        marks_awarded = is_correct ? 1 : 0
      } else {
        const graded = gradeWritten(r.response, question.correct_answer, question.keywords || [])
        is_correct = graded.is_correct
        marks_awarded = graded.marks_awarded
      }
      return {
        assessment_id,
        question_id: r.question_id,
        subject_code: r.subject_code || question.subject_code,
        response: r.response || '',
        is_correct,
        marks_awarded,
      }
    }).filter(Boolean)

    await admin.from('assessment_responses').insert(gradedResponses)

    const subjectScores: Record<string, { correct: number; total: number; percentage: number }> = {}
    for (const r of gradedResponses) {
      if (!r) continue
      if (!subjectScores[r.subject_code]) subjectScores[r.subject_code] = { correct: 0, total: 0, percentage: 0 }
      subjectScores[r.subject_code].total += 1
      subjectScores[r.subject_code].correct += r.marks_awarded
    }
    for (const subject of Object.keys(subjectScores)) {
      const s = subjectScores[subject]
      s.percentage = Math.round((s.correct / s.total) * 100)
    }

    const totalCorrect = gradedResponses.reduce((sum: number, r: { marks_awarded?: number } | null) => sum + (r?.marks_awarded || 0), 0)
    const totalQuestions = gradedResponses.length
    const scorePercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    const levelResult = determineLevel(scorePercentage)

    await admin.from('assessments').update({
      status: isExpired ? 'expired' : 'completed',
      completed_at: new Date().toISOString(),
      score_percentage: scorePercentage,
      level_result: levelResult,
      subject_scores: subjectScores,
    }).eq('id', assessment_id)

    const { data: adminUsers } = await admin.from('profiles').select('id').eq('role', 'admin').limit(1)
    if (adminUsers && adminUsers[0]) {
      await admin.from('notifications').insert({
        user_id: adminUsers[0].id,
        type: 'assessment',
        title: 'Assessment Completed',
        message: `A learner has completed their baseline assessment. Score: ${scorePercentage}% (${levelResult})`,
        is_read: false,
        link: `/admin/dashboard/academy/${assessment.enrollment_id}`,
      })
    }

    return NextResponse.json({ success: true, score_percentage: scorePercentage, level_result: levelResult, subject_scores: subjectScores, assessment_id })
  } catch (err) {
    console.error('Assessment submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
