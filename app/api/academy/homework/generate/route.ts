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

function generateHomeworkQuestions(topicName: string, topicUnit: string, subjectCode: string) {
  return [
    {
      id: 1, type: 'written',
      question: `Write 3 things you learned about "${topicName}" in today's class.`,
      correct_answer: topicName.toLowerCase(), marks: 3,
    },
    {
      id: 2, type: 'mcq',
      question: `"${topicName}" is part of which unit of study?`,
      options: [topicUnit, 'Introduction Unit', 'Revision Unit', 'Extension Unit'],
      correct_answer: topicUnit, marks: 2,
    },
    {
      id: 3, type: 'written',
      question: `Give one real-life example of how "${topicName}" is used or seen in everyday life.`,
      correct_answer: topicName.toLowerCase(), marks: 3,
    },
    {
      id: 4, type: 'truefalse',
      question: `Learning about "${topicName}" helps us understand ${subjectCode} better.`,
      options: ['True', 'False'],
      correct_answer: 'True', marks: 1,
    },
    {
      id: 5, type: 'written',
      question: `Ask someone at home to listen while you explain "${topicName}" in your own words. Write what you told them.`,
      correct_answer: topicName.toLowerCase(), marks: 3,
    },
  ]
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()
    const { child_id, subject_code, date } = await request.json()
    if (!child_id || !subject_code) {
      return NextResponse.json({ error: 'child_id and subject_code required' }, { status: 400 })
    }

    const assignedDate = date || new Date().toISOString().split('T')[0]
    const dueDate = new Date(assignedDate)
    dueDate.setDate(dueDate.getDate() + 1)
    const dueDateStr = dueDate.toISOString().split('T')[0]

    // Check if homework already exists
    const { data: existing } = await admin
      .from('homework')
      .select('id')
      .eq('child_id', child_id)
      .eq('subject_code', subject_code)
      .eq('assigned_date', assignedDate)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, homework_id: existing.id, already_exists: true })
    }

    const { data: child } = await admin
      .from('academy_children')
      .select('enrollment_id, assigned_trainer_id')
      .eq('id', child_id)
      .single()

    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

    const { data: currentTopic } = await admin
      .from('learning_roadmap_progress')
      .select('topic_name, topic_unit')
      .eq('child_id', child_id)
      .eq('subject_code', subject_code)
      .eq('status', 'current')
      .maybeSingle()

    const topicName = currentTopic?.topic_name || `${subject_code} Topic`
    const topicUnit = currentTopic?.topic_unit || 'General'
    const questions = generateHomeworkQuestions(topicName, topicUnit, subject_code)
    const maxScore = questions.reduce((sum, q) => sum + q.marks, 0)

    const { data: hw } = await admin
      .from('homework')
      .insert({
        child_id,
        enrollment_id: child.enrollment_id,
        trainer_id: child.assigned_trainer_id || null,
        subject_code,
        topic_unit: topicUnit,
        topic_name: topicName,
        type: 'auto',
        title: `${topicName} — Homework`,
        questions,
        assigned_date: assignedDate,
        due_date: dueDateStr,
        max_score: maxScore,
      })
      .select('id')
      .single()

    return NextResponse.json({
      success: true,
      homework_id: hw?.id,
      topic_name: topicName,
      due_date: dueDateStr,
    })
  } catch (err) {
    console.error('Homework generate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
