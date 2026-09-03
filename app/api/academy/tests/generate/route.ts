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

function generateTestQuestions(
  topics: { topic_name: string; topic_unit: string }[],
  type: 'monthly_test' | 'quarterly_exam',
  subjectCode: string
) {
  const questionCount = type === 'monthly_test' ? 20 : 40
  const questions = []

  for (let i = 0; i < questionCount; i++) {
    const topic = topics[i % topics.length]
    const isWritten = i % 5 === 4 // every 5th question is written
    const isTrueFalse = i % 5 === 3

    if (isWritten) {
      questions.push({
        id: i + 1, type: 'written',
        question: `Explain in your own words what you learned about "${topic.topic_name}".`,
        correct_answer: topic.topic_name.toLowerCase(), marks: 3,
      })
    } else if (isTrueFalse) {
      questions.push({
        id: i + 1, type: 'truefalse',
        question: `"${topic.topic_name}" is part of the ${topic.topic_unit} unit.`,
        options: ['True', 'False'],
        correct_answer: 'True', marks: 1,
      })
    } else {
      questions.push({
        id: i + 1, type: 'mcq',
        question: `Which unit does "${topic.topic_name}" belong to in ${subjectCode}?`,
        options: [
          topic.topic_unit,
          'Introduction Unit',
          'Revision Module',
          'Advanced Topics',
        ],
        correct_answer: topic.topic_unit, marks: 2,
      })
    }
  }

  return questions
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()
    const { child_id, subject_code, type, scheduled_date } = await request.json()

    if (!child_id || !subject_code || !type) {
      return NextResponse.json({ error: 'child_id, subject_code and type required' }, { status: 400 })
    }

    const { data: child } = await admin
      .from('academy_children')
      .select('enrollment_id, assigned_trainer_id')
      .eq('id', child_id)
      .single()

    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

    // Get completed topics for this month (or quarter)
    const monthsBack = type === 'monthly_test' ? 1 : 3
    const fromDate = new Date()
    fromDate.setMonth(fromDate.getMonth() - monthsBack)

    const { data: completedTopics } = await admin
      .from('learning_roadmap_progress')
      .select('topic_name, topic_unit')
      .eq('child_id', child_id)
      .eq('subject_code', subject_code)
      .eq('status', 'completed')
      .gte('completed_at', fromDate.toISOString())
      .order('topic_index')

    // If no completed topics, use current topic
    if (!completedTopics || completedTopics.length === 0) {
      const { data: currentTopic } = await admin
        .from('learning_roadmap_progress')
        .select('topic_name, topic_unit')
        .eq('child_id', child_id)
        .eq('subject_code', subject_code)
        .eq('status', 'current')
        .maybeSingle()

      if (!currentTopic) {
        return NextResponse.json({ error: 'No topics found for this student' }, { status: 404 })
      }
      completedTopics?.push(currentTopic)
    }

    const questions = generateTestQuestions(completedTopics || [], type, subject_code)
    const maxScore = questions.reduce((sum, q) => sum + q.marks, 0)
    const duration = type === 'monthly_test' ? 30 : 60
    const title = type === 'monthly_test'
      ? `Monthly Test — ${subject_code}`
      : `Quarterly Exam — ${subject_code}`

    const { data: test } = await admin
      .from('tests_exams')
      .insert({
        child_id,
        enrollment_id: child.enrollment_id,
        trainer_id: child.assigned_trainer_id || null,
        subject_code,
        type,
        title,
        questions,
        scheduled_date: scheduled_date || new Date().toISOString().split('T')[0],
        duration_minutes: duration,
        max_score: maxScore,
        is_auto_generated: true,
      })
      .select('id')
      .single()

    return NextResponse.json({
      success: true,
      test_id: test?.id,
      questions_count: questions.length,
      duration_minutes: duration,
      max_score: maxScore,
    })
  } catch (err) {
    console.error('Test generate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
