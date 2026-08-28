import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { CheckCircle, TrendingUp, BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  ART: 'Creative Arts', MUS: 'Music', PE: 'Physical Education',
  NHC: 'Nigerian History & Culture', REL: 'Religious Studies',
  BTECH: 'Basic Technology', BIO: 'Biology', CHEM: 'Chemistry',
  PHY: 'Physics', ECON: 'Economics', GOV: 'Government / Politics',
  ENGLIT: 'English Literature',
}

const LEVEL_CONFIG = {
  beginner: { label: 'Beginner', color: '#F59E0B', bg: '#FFF8F0', emoji: '🌱', description: 'You are at the start of your learning journey. Our teachers will build a strong foundation for you.' },
  intermediate: { label: 'Intermediate', color: '#497296', bg: '#EBF4FF', emoji: '📈', description: 'You have a good understanding of the basics. Your teacher will help you reach the next level.' },
  advanced: { label: 'Advanced', color: '#16A34A', bg: '#F0FDF4', emoji: '🌟', description: 'Excellent! You have strong knowledge in your subjects. Your teacher will challenge and stretch you further.' },
}

export default async function AssessmentResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ assessment_id?: string }>
}) {
  const { assessment_id } = await searchParams
  if (!assessment_id) redirect('/dashboard/academy')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  const { data: assessment } = await admin
    .from('assessments')
    .select('*, academy_children(full_name, year_group_label, subjects)')
    .eq('id', assessment_id)
    .single()

  if (!assessment || assessment.status === 'pending' || assessment.status === 'in_progress') {
    redirect('/dashboard/academy')
  }

  const child = Array.isArray(assessment.academy_children)
    ? assessment.academy_children[0]
    : assessment.academy_children

  const levelConfig = LEVEL_CONFIG[assessment.level_result as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.intermediate
  const subjectScores = assessment.subject_scores as Record<string, { correct: number; total: number; percentage: number }> || {}
  const score = Math.round(assessment.score_percentage || 0)
  const circumference = 2 * Math.PI * 40

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl"
            style={{ backgroundColor: levelConfig.bg }}>
            {levelConfig.emoji}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
            Assessment Complete!
          </h1>
          <p className="text-gray-500 text-sm">{child?.full_name} — {child?.year_group_label}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-center">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Overall Score</p>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none"
                stroke={levelConfig.color} strokeWidth="10"
                strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: '#062850' }}>{score}%</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
            style={{ backgroundColor: levelConfig.bg, color: levelConfig.color }}>
            <TrendingUp className="w-4 h-4" />
            {levelConfig.label}
          </div>
          <p className="text-gray-600 text-sm mt-4 leading-relaxed max-w-sm mx-auto">
            {levelConfig.description}
          </p>
        </div>

        {Object.keys(subjectScores).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: '#062850' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#497296' }} />
              Results by Subject
            </h2>
            <div className="space-y-4">
              {Object.entries(subjectScores).map(([code, scores]) => {
                const pct = scores.percentage || 0
                const level = pct >= 70 ? 'Advanced' : pct >= 40 ? 'Intermediate' : 'Beginner'
                const color = pct >= 70 ? '#16A34A' : pct >= 40 ? '#497296' : '#F59E0B'
                return (
                  <div key={code}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm" style={{ color: '#062850' }}>
                        {SUBJECT_MAP[code] || code}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color }}>{level}</span>
                        <span className="font-bold text-sm" style={{ color: '#062850' }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{scores.correct} of {scores.total} marks</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#062850' }}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            What Happens Next
          </h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Results sent to your teacher', desc: 'Your teacher has been notified of your assessment results and level.' },
              { step: '2', title: 'Timetable confirmation', desc: 'Our team will contact you within 24 hours to confirm your class schedule.' },
              { step: '3', title: 'Classes begin', desc: 'Your personalised classes will begin within 48 hours of timetable confirmation.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: '#497296' }}>
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#062850' }}>{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link href="/dashboard/academy">
          <Button className="w-full py-4 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2"
            style={{ backgroundColor: '#062850' }}>
            Go to My Dashboard <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

      </div>
    </div>
  )
}
