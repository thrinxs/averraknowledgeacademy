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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('assessment_id')
    if (!assessmentId) return NextResponse.json({ error: 'assessment_id required' }, { status: 400 })

    const admin = getAdminClient()

    const { data: assessment } = await admin
      .from('assessments')
      .select('*, academy_children(year_group_code, subjects, full_name), academy_enrollments(parent_id)')
      .eq('id', assessmentId)
      .single()

    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })

    const enrollment = Array.isArray(assessment.academy_enrollments)
      ? assessment.academy_enrollments[0]
      : assessment.academy_enrollments
    if (enrollment?.parent_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const child = Array.isArray(assessment.academy_children)
      ? assessment.academy_children[0]
      : assessment.academy_children

    const yearGroupCode = child?.year_group_code || 'Year 1'

    const { data: content } = await admin
      .from('primary_assessment_content')
      .select('*')
      .eq('year_group_code', yearGroupCode)
      .eq('is_active', true)

    if (!content || content.length === 0) {
      return NextResponse.json({ error: 'No assessment content found for this year group' }, { status: 404 })
    }

    const level = assessment.level_result || 'intermediate'
    const difficultyMap: Record<string, string> = {
      beginner: 'easy',
      intermediate: 'medium',
      advanced: 'hard',
    }
    const difficulty = difficultyMap[level] || 'medium'

    function getContent(type: string) {
      const exact = content!.find((c: { content_type: string; difficulty: string }) => c.content_type === type && c.difficulty === difficulty)
      if (exact) return exact
      return content!.find((c: { content_type: string; difficulty: string }) => c.content_type === type && c.difficulty === 'medium')
        || content!.find((c: { content_type: string }) => c.content_type === type)
    }

    const readingPassage = getContent('reading_passage')
    const wordList = getContent('word_list')
    const audioQuestions = getContent('audio_question')
    const sentenceConstruction = getContent('sentence_construction')

    return NextResponse.json({
      success: true,
      year_group_code: yearGroupCode,
      child_name: child?.full_name || 'Learner',
      difficulty,
      reading_passage: readingPassage?.content || null,
      reading_passage_id: readingPassage?.id || null,
      word_list: wordList?.content || null,
      word_list_id: wordList?.id || null,
      audio_questions: audioQuestions?.content || null,
      audio_questions_id: audioQuestions?.id || null,
      sentence_construction: sentenceConstruction?.content || null,
      sentence_construction_id: sentenceConstruction?.id || null,
    })
  } catch (err) {
    console.error('Primary assessment content error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
