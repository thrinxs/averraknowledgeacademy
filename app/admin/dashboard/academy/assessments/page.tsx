import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Mic, Clock, User } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

type AudioResponse = { question_id: number; question: string; transcript: string }
type SubjectScores = {
  reading_score?: number
  tracing_score?: number
  audio_responses?: AudioResponse[]
  scores?: { reading: number; tracing: number; audio: number; sentence: number }
}

export default async function AdminAssessmentsPage() {
  const admin = getAdminClient()

  const { data: assessments } = await admin
    .from('assessments')
    .select('id, status, score_percentage, level_result, completed_at, subject_scores, enrollment_id, academy_children(full_name, year_group_label)')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Assessment Reviews
        </h1>
        <p className="text-gray-500 text-sm">
          Review completed assessments. Audio responses require manual review.
        </p>
      </div>

      {(!assessments || assessments.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: '#497296' }} />
          <p className="text-gray-500">No completed assessments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((assessment) => {
            const child = Array.isArray(assessment.academy_children)
              ? assessment.academy_children[0]
              : assessment.academy_children as { full_name: string; year_group_label: string } | null

            const scores = assessment.subject_scores as SubjectScores | null
            const isPrimary = scores && 'reading_score' in scores
            const needsReview = isPrimary && scores?.audio_responses && scores.audio_responses.length > 0

            const levelColor = assessment.level_result === 'advanced' ? '#16A34A'
              : assessment.level_result === 'intermediate' ? '#497296' : '#F59E0B'
            const levelBg = assessment.level_result === 'advanced' ? '#F0FDF4'
              : assessment.level_result === 'intermediate' ? '#EBF4FF' : '#FFF8F0'

            return (
              <div key={assessment.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0F6FB' }}>
                      <User className="w-5 h-5" style={{ color: '#497296' }} />
                    </div>
                    <div>
                      <p className="font-bold" style={{ color: '#062850' }}>{child?.full_name || 'Learner'}</p>
                      <p className="text-xs text-gray-500">{child?.year_group_label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {needsReview && (
                      <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold"
                        style={{ backgroundColor: '#FFF8F0', color: '#F59E0B', border: '1px solid #FCD34D' }}>
                        <Mic className="w-3 h-3" /> Audio Review Needed
                      </span>
                    )}
                    <span className="text-xs px-3 py-1.5 rounded-full font-semibold capitalize"
                      style={{ backgroundColor: levelBg, color: levelColor }}>
                      {assessment.level_result}
                    </span>
                    <span className="text-2xl font-bold" style={{ color: '#062850' }}>
                      {Math.round(assessment.score_percentage || 0)}%
                    </span>
                  </div>
                </div>

                {isPrimary && scores?.scores && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Reading', value: scores.scores.reading },
                      { label: 'Tracing', value: scores.scores.tracing },
                      { label: 'Speaking', value: scores.scores.audio },
                      { label: 'Sentences', value: scores.scores.sentence },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-xl text-center" style={{ backgroundColor: '#F0F6FB' }}>
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="font-bold text-lg" style={{ color: '#062850' }}>{Math.round(item.value || 0)}%</p>
                      </div>
                    ))}
                  </div>
                )}

                {needsReview && scores?.audio_responses && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
                      <Mic className="w-3 h-3" /> Audio Responses (manual review required)
                    </p>
                    <div className="space-y-2">
                      {scores.audio_responses.map((resp, i) => (
                        <div key={i} className="p-3 rounded-xl border border-gray-100">
                          <p className="text-xs font-semibold mb-1" style={{ color: '#062850' }}>
                            Q{resp.question_id}: {resp.question}
                          </p>
                          <p className="text-xs text-gray-600 italic">
                            Student said: "{resp.transcript || '(no response recorded)'}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Completed: {assessment.completed_at
                      ? new Date(assessment.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'Unknown'}
                  </p>
                  <Link href={'/admin/dashboard/academy/' + assessment.enrollment_id}
                    className="text-xs font-semibold hover:underline" style={{ color: '#497296' }}>
                    View Enrollment
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
