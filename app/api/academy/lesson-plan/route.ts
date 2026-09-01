import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const SUBJECT_NAMES: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
  ART: 'Creative Arts', MUS: 'Music', PE: 'Physical Education',
  NHC: 'Nigerian History & Culture', REL: 'Religious Studies',
  BTECH: 'Basic Technology', BIO: 'Biology', CHEM: 'Chemistry',
  PHY: 'Physics', ECON: 'Economics', GOV: 'Government / Politics',
  ENGLIT: 'English Literature',
}

function generateLessonPlan(
  subjectCode: string,
  yearGroupCode: string,
  topicUnit: string,
  topicName: string,
) {
  const subjectName = SUBJECT_NAMES[subjectCode] || subjectCode

  return {
    subject_code: subjectCode,
    year_group_code: yearGroupCode,
    topic_unit: topicUnit,
    topic_name: topicName,
    duration_minutes: 45,
    objectives: [
      `Students will be able to understand ${topicName}`,
      `Students will be able to apply knowledge of ${topicName} in context`,
      `Students will be able to explain ${topicName} in their own words`,
    ],
    starter_activity: `Begin with a short warm-up activity related to ${topicName}. Ask students what they already know about this topic. Use questioning techniques to activate prior knowledge (5 minutes).`,
    main_teaching: `Introduce ${topicName} clearly using simple language and visual aids where possible. Break the topic into small steps. Use the Averra Super Curriculum approach — explain the concept, give real-world examples, and connect it to what students already know. Check for understanding at each step. Use questioning to keep students engaged (20 minutes).`,
    practice_activity: `Students complete guided practice exercises on ${topicName}. Start with teacher-led examples, then move to independent practice. Provide immediate feedback and correction. For ${subjectName}, use a mix of written exercises and oral questioning (15 minutes).`,
    plenary: `Summarise the key learning points from today's lesson on ${topicName}. Ask students to explain one thing they learned. Set classwork and homework based on today's topic. Preview what will be covered next lesson (5 minutes).`,
    resources: [
      'Averra Super Curriculum reference materials',
      'Whiteboard or digital display',
      'Student exercise books',
      `${topicName} worksheet (auto-generated)`,
      'Previous lesson notes for reference',
    ],
    differentiation: `For students who need more support: Break ${topicName} into even smaller steps. Use visual aids and real objects where possible. Provide worked examples before independent practice.

For advanced students: Challenge them with extension questions that apply ${topicName} in more complex or real-world contexts. Ask them to explain the concept to a peer.`,
    assessment_criteria: `Students can:
• Define or describe ${topicName} correctly
• Complete at least 3 practice questions accurately
• Explain the topic in their own words
• Score at least 60% on the classwork assignment`,
    is_auto_generated: true,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectCode = searchParams.get('subject_code')
    const yearGroupCode = searchParams.get('year_group_code')
    const topicUnit = searchParams.get('topic_unit')
    const topicName = searchParams.get('topic_name')

    if (!subjectCode || !yearGroupCode || !topicUnit || !topicName) {
      return NextResponse.json({ error: 'All parameters required' }, { status: 400 })
    }

    const admin = getAdminClient()

    // Check if lesson plan already exists
    const { data: existing } = await admin
      .from('lesson_plans')
      .select('*')
      .eq('subject_code', subjectCode)
      .eq('year_group_code', yearGroupCode)
      .eq('topic_unit', topicUnit)
      .eq('topic_name', topicName)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, lesson_plan: existing })
    }

    // Auto-generate and save
    const plan = generateLessonPlan(subjectCode, yearGroupCode, topicUnit, topicName)
    const { data: saved } = await admin
      .from('lesson_plans')
      .insert(plan)
      .select()
      .single()

    return NextResponse.json({ success: true, lesson_plan: saved })
  } catch (err) {
    console.error('Lesson plan error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
