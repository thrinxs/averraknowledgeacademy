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

    const body = await request.json()
    const {
      assessment_id, reading_score, reading_wpm, reading_transcript,
      tracing_score, tracing_words_completed, audio_responses, sentence_responses,
    } = body

    const admin = getAdminClient()

    const { data: assessment } = await admin
      .from('assessments')
      .select('*, academy_enrollments(parent_id)')
      .eq('id', assessment_id)
      .single()

    if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const enrollment = Array.isArray(assessment.academy_enrollments)
      ? assessment.academy_enrollments[0]
      : assessment.academy_enrollments
    if (enrollment?.parent_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const scores = {
      reading: reading_score || 0,
      tracing: tracing_score || 0,
      audio: 0,
      sentence: 0,
    }

    if (audio_responses && audio_responses.length > 0) {
      let audioCorrect = 0
      for (const resp of audio_responses) {
        if (!resp.transcript || !resp.keywords) continue
        const transcript = resp.transcript.toLowerCase()
        const matched = resp.keywords.filter((kw: string) => transcript.includes(kw.toLowerCase()))
        const ratio = matched.length / resp.keywords.length
        if (ratio >= 0.5) audioCorrect++
      }
      scores.audio = Math.round((audioCorrect / audio_responses.length) * 100)
    }

    if (sentence_responses && sentence_responses.length > 0) {
      let sentenceCorrect = 0
      for (const resp of sentence_responses) {
        if (!resp.transcript || !resp.keywords) continue
        const transcript = resp.transcript.toLowerCase()
        const matched = resp.keywords.filter((kw: string) => transcript.includes(kw.toLowerCase()))
        const ratio = matched.length / resp.keywords.length
        if (ratio >= 0.5) sentenceCorrect++
      }
      scores.sentence = Math.round((sentenceCorrect / sentence_responses.length) * 100)
    }

    const overallScore = Math.round(
      (scores.reading + scores.tracing + scores.audio + scores.sentence) / 4
    )
    const levelResult = overallScore >= 70 ? 'advanced' : overallScore >= 40 ? 'intermediate' : 'beginner'

    const primaryResults = {
      reading_score: scores.reading,
      reading_wpm,
      reading_transcript,
      tracing_score: scores.tracing,
      tracing_words_completed,
      audio_responses,
      sentence_responses,
      scores,
      overall_score: overallScore,
    }

    await admin.from('assessments').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      score_percentage: overallScore,
      level_result: levelResult,
      subject_scores: primaryResults,
    }).eq('id', assessment_id)

    const { data: adminUsers } = await admin
      .from('profiles').select('id').eq('role', 'admin').limit(1)

    if (adminUsers && adminUsers[0]) {
      await admin.from('notifications').insert({
        user_id: adminUsers[0].id,
        type: 'assessment',
        title: 'Primary Assessment Completed — Audio Review Needed',
        message: `A learner completed their primary baseline assessment. Score: ${overallScore}% (${levelResult}). Audio responses require manual review.`,
        is_read: false,
        link: '/admin/dashboard/academy/assessments',
      })
    }

    return NextResponse.json({
      success: true,
      overall_score: overallScore,
      level_result: levelResult,
      scores,
      assessment_id,
    })
  } catch (err) {
    console.error('Primary assessment submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
