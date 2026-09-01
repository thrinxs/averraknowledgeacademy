import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { Mic, TrendingUp, BookOpen, Download } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
}

type AudioResponse = { question_id: number; question: string; transcript: string; audio_url?: string }
type SentenceResponse = { sentence_id: number; prompt: string; transcript: string; audio_url?: string }
type PrimaryScores = {
  reading_score?: number
  tracing_score?: number
  audio_responses?: AudioResponse[]
  sentence_responses?: SentenceResponse[]
  reading_transcript?: string
  reading_audio_url?: string
  scores?: { reading: number; tracing: number; audio: number; sentence: number }
}

export default async function TrainerAssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ child_id?: string }>
}) {
  const { child_id } = await searchParams

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'trainer') redirect('/auth/staff-login')

  // Get child details
  const { data: child } = child_id ? await admin
    .from('academy_children')
    .select('*')
    .eq('id', child_id)
    .eq('assigned_trainer_id', user.id)
    .single() : { data: null }

  if (child_id && !child) redirect('/trainer/dashboard/students')

  // Get assessments
  const query = admin.from('assessments').select('*').eq('status', 'completed')
  const { data: assessments } = child_id
    ? await query.eq('child_id', child_id)
    : await query.in('child_id',
        (await admin.from('academy_children').select('id').eq('assigned_trainer_id', user.id)).data?.map(c => c.id) || []
      )

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          {child ? `${child.full_name}'s Assessment` : 'Assessment Results'}
        </h1>
        <p className="text-gray-500 text-sm">
          {child ? `${child.year_group_label} — Review results and audio recordings` : 'All assessment results for your students'}
        </p>
      </div>

      {(!assessments || assessments.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: '#497296' }} />
          <p className="text-gray-500">No completed assessments yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {assessments.map((assessment) => {
            const scores = assessment.subject_scores as PrimaryScores | Record<string, { correct: number; total: number; percentage: number }> | null
            const isPrimary = scores && 'reading_score' in scores
            const primaryScores = isPrimary ? scores as PrimaryScores : null
            const subjectScores = !isPrimary ? scores as Record<string, { correct: number; total: number; percentage: number }> : null

            const levelColor = assessment.level_result === 'advanced' ? '#16A34A'
              : assessment.level_result === 'intermediate' ? '#497296' : '#F59E0B'
            const levelBg = assessment.level_result === 'advanced' ? '#F0FDF4'
              : assessment.level_result === 'intermediate' ? '#EBF4FF' : '#FFF8F0'

            return (
              <div key={assessment.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between"
                  style={{ backgroundColor: '#062850' }}>
                  <div>
                    <p className="font-bold text-white">
                      {isPrimary ? 'Primary Baseline Assessment' : 'Standard Assessment'}
                    </p>
                    <p className="text-blue-300 text-xs mt-0.5">
                      Completed: {assessment.completed_at
                        ? new Date(assessment.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Unknown'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1.5 rounded-full font-semibold capitalize"
                      style={{ backgroundColor: levelBg, color: levelColor }}>
                      {assessment.level_result}
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {Math.round(assessment.score_percentage || 0)}%
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">

                  {/* Primary score breakdown */}
                  {isPrimary && primaryScores?.scores && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Score Breakdown</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { label: 'Reading', value: primaryScores.scores.reading },
                          { label: 'Tracing', value: primaryScores.scores.tracing },
                          { label: 'Speaking', value: primaryScores.scores.audio },
                          { label: 'Sentences', value: primaryScores.scores.sentence },
                        ].map((item) => (
                          <div key={item.label} className="p-3 rounded-xl text-center"
                            style={{ backgroundColor: '#F0F6FB' }}>
                            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                            <p className="font-bold text-lg" style={{ color: '#062850' }}>
                              {Math.round(item.value || 0)}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Standard subject scores */}
                  {!isPrimary && subjectScores && Object.keys(subjectScores).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Subject Results</p>
                      <div className="space-y-3">
                        {Object.entries(subjectScores).map(([code, data]) => (
                          <div key={code}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold" style={{ color: '#062850' }}>
                                {SUBJECT_MAP[code] || code}
                              </p>
                              <span className="text-sm font-bold" style={{ color: '#062850' }}>
                                {data.percentage}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full"
                                style={{ width: `${data.percentage}%`, backgroundColor: data.percentage >= 70 ? '#16A34A' : data.percentage >= 40 ? '#497296' : '#F59E0B' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reading transcript + audio */}
                  {isPrimary && primaryScores?.reading_transcript && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wide">
                        <BookOpen className="w-3 h-3" /> Reading Transcript
                      </p>
                      <div className="p-4 rounded-xl border border-gray-100" style={{ backgroundColor: '#F0F6FB' }}>
                        <p className="text-sm text-gray-700 leading-relaxed italic">
                          "{primaryScores.reading_transcript}"
                        </p>
                      </div>
                      {primaryScores.reading_audio_url && (
                        <div className="mt-3 flex items-center gap-3">
                          <audio controls src={primaryScores.reading_audio_url} className="flex-1 h-10" />
                          <a href={primaryScores.reading_audio_url} download="reading.webm"
                            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                            style={{ backgroundColor: '#497296' }}>
                            <Download className="w-3 h-3" /> Download
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Audio responses */}
                  {isPrimary && primaryScores?.audio_responses && primaryScores.audio_responses.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1 uppercase tracking-wide">
                        <Mic className="w-3 h-3" /> Speaking Responses
                      </p>
                      <div className="space-y-3">
                        {primaryScores.audio_responses.map((resp, i) => (
                          <div key={i} className="p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-semibold mb-1" style={{ color: '#062850' }}>
                              Q{resp.question_id}: {resp.question}
                            </p>
                            <p className="text-xs text-gray-600 italic mb-2">
                              "{resp.transcript || '(no transcript)'}"
                            </p>
                            {resp.audio_url && (
                              <div className="flex items-center gap-2">
                                <audio controls src={resp.audio_url} className="flex-1 h-8" />
                                <a href={resp.audio_url} download={`q${resp.question_id}.webm`}
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold text-white flex-shrink-0"
                                  style={{ backgroundColor: '#497296' }}>
                                  <Download className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sentence responses */}
                  {isPrimary && primaryScores?.sentence_responses && primaryScores.sentence_responses.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                        Sentence Construction
                      </p>
                      <div className="space-y-3">
                        {primaryScores.sentence_responses.map((resp, i) => (
                          <div key={i} className="p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-semibold mb-1" style={{ color: '#062850' }}>
                              {resp.prompt}
                            </p>
                            <p className="text-xs text-gray-600 italic mb-2">
                              "{resp.transcript || '(no response)'}"
                            </p>
                            {resp.audio_url && (
                              <div className="flex items-center gap-2">
                                <audio controls src={resp.audio_url} className="flex-1 h-8" />
                                <a href={resp.audio_url} download={`sentence_${i + 1}.webm`}
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold text-white flex-shrink-0"
                                  style={{ backgroundColor: '#497296' }}>
                                  <Download className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overall level */}
                  <div className="p-4 rounded-xl flex items-center gap-3"
                    style={{ backgroundColor: levelBg }}>
                    <TrendingUp className="w-5 h-5 flex-shrink-0" style={{ color: levelColor }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: levelColor }}>
                        Overall Level: {assessment.level_result?.charAt(0).toUpperCase()}{assessment.level_result?.slice(1)}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: levelColor, opacity: 0.8 }}>
                        {assessment.level_result === 'advanced'
                          ? 'Excellent performance. Challenge with advanced material.'
                          : assessment.level_result === 'intermediate'
                          ? 'Good foundation. Focus on strengthening weak areas.'
                          : 'Needs strong foundational support. Start from basics.'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
