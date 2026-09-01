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
  type: 'mcq' | 'written' | 'truefalse'
  question: string
  options?: string[]
  correct_answer: string
  marks: number
}

function generateClassworkQuestions(
  topicName: string,
  topicUnit: string,
  subjectCode: string,
  yearGroupCode: string,
): Question[] {
  const subject = subjectCode
  const questions: Question[] = []

  // 3 MCQ + 1 True/False + 1 Written = 5 questions total
  questions.push({
    id: 1,
    type: 'mcq',
    question: `Which of the following best describes "${topicName}" in ${subject}?`,
    options: [
      `It is a key concept in ${topicUnit}`,
      `It is unrelated to ${topicUnit}`,
      `It only applies to advanced students`,
      `It was removed from the curriculum`,
    ],
    correct_answer: `It is a key concept in ${topicUnit}`,
    marks: 2,
  })

  questions.push({
    id: 2,
    type: 'mcq',
    question: `What is the most important thing to remember about "${topicName}"?`,
    options: [
      `Understanding the core concept`,
      `Memorising without understanding`,
      `Skipping it for the next topic`,
      `Only reading about it`,
    ],
    correct_answer: `Understanding the core concept`,
    marks: 2,
  })

  questions.push({
    id: 3,
    type: 'mcq',
    question: `"${topicName}" belongs to which unit of study?`,
    options: [
      topicUnit,
      `Introduction to ${subject}`,
      `Advanced ${subject} Topics`,
      `Revision Module`,
    ],
    correct_answer: topicUnit,
    marks: 2,
  })

  questions.push({
    id: 4,
    type: 'truefalse',
    question: `"${topicName}" is an important topic in ${topicUnit} for ${yearGroupCode} students.`,
    options: ['True', 'False'],
    correct_answer: 'True',
    marks: 1,
  })

  questions.push({
    id: 5,
    type: 'written',
    question: `In your own words, explain what you learned about "${topicName}" today. Write at least two sentences.`,
    correct_answer: topicName.toLowerCase(),
    marks: 3,
  })

  return questions
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

    // Check if classwork already exists for today
    const { data: existing } = await admin
      .from('classwork')
      .select('id')
      .eq('child_id', child_id)
      .eq('subject_code', subject_code)
      .eq('assigned_date', assignedDate)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, classwork_id: existing.id, already_exists: true })
    }

    // Get child details
    const { data: child } = await admin
      .from('academy_children')
      .select('enrollment_id, year_group_code')
      .eq('id', child_id)
      .single()

    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

    // Get current topic for this subject
    const { data: currentTopic } = await admin
      .from('learning_roadmap_progress')
      .select('topic_name, topic_unit')
      .eq('child_id', child_id)
      .eq('subject_code', subject_code)
      .eq('status', 'current')
      .maybeSingle()

    const topicName = currentTopic?.topic_name || `${subject_code} Lesson`
    const topicUnit = currentTopic?.topic_unit || 'General'
    const yearGroupCode = child.year_group_code || 'Year 1'

    // Generate questions
    const questions = generateClassworkQuestions(topicName, topicUnit, subject_code, yearGroupCode)
    const maxScore = questions.reduce((sum, q) => sum + q.marks, 0)

    // Get trainer assigned to child
    const { data: childData } = await admin
      .from('academy_children')
      .select('assigned_trainer_id')
      .eq('id', child_id)
      .single()

    const { data: classwork } = await admin
      .from('classwork')
      .insert({
        child_id,
        enrollment_id: child.enrollment_id,
        trainer_id: childData?.assigned_trainer_id || null,
        subject_code,
        topic_unit: topicUnit,
        topic_name: topicName,
        type: 'auto',
        title: `${topicName} — Classwork`,
        questions,
        assigned_date: assignedDate,
        due_date: assignedDate,
        max_score: maxScore,
      })
      .select('id')
      .single()

    return NextResponse.json({
      success: true,
      classwork_id: classwork?.id,
      topic_name: topicName,
      questions_count: questions.length,
    })
  } catch (err) {
    console.error('Classwork generate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
