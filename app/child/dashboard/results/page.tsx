import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle, BookOpen, FileText, Star } from 'lucide-react'
import { getAgeGroup } from '@/utils/auth'

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
const SUBJECT_EMOJIS: Record<string, string> = {
  ENG: '📖', MATH: '🔢', SCI: '🔬', COMP: '💻',
}

export default async function ChildResultsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('account_type').eq('id', user.id).single()
  if (profile?.account_type !== 'child') redirect('/dashboard')

  const { data: childRecord } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label, year_group_code')
    .eq('child_user_id', user.id)
    .maybeSingle()

  if (!childRecord) redirect('/child/dashboard')

  const isPrimary = getAgeGroup(childRecord.year_group_code || 'Year 1') === 'primary'

  const [cwRes, hwRes, testRes] = await Promise.all([
    admin.from('classwork').select('*').eq('child_id', childRecord.id).eq('status', 'submitted').order('assigned_date', { ascending: false }).limit(10),
    admin.from('homework').select('*').eq('child_id', childRecord.id).eq('status', 'submitted').order('assigned_date', { ascending: false }).limit(10),
    admin.from('tests_exams').select('*').eq('child_id', childRecord.id).eq('status', 'completed').order('created_at', { ascending: false }).limit(5),
  ])

  const classworks = cwRes.data || []
  const homeworks = hwRes.data || []
  const tests = testRes.data || []

  function getStars(pct: number) { return pct >= 80 ? 3 : pct >= 50 ? 2 : 1 }

  function ScoreDisplay({ score, max, isPrimary }: { score: number; max: number; isPrimary: boolean }) {
    const pct = max > 0 ? Math.round((score / max) * 100) : 0
    const stars = getStars(pct)
    const color = pct >= 70 ? '#16A34A' : pct >= 40 ? '#F59E0B' : '#DC2626'

    if (isPrimary) {
      return (
        <div className="flex items-center gap-1">
          {[1,2,3].map(s => (
            <Star key={s} className="w-5 h-5"
              fill={s <= stars ? '#F59E0B' : 'none'}
              stroke={s <= stars ? '#F59E0B' : '#D1D5DB'} />
          ))}
          <span className="text-sm font-bold ml-1" style={{ color }}>{pct}%</span>
        </div>
      )
    }
    return (
      <span className="text-sm font-bold px-2 py-1 rounded-full"
        style={{ backgroundColor: color + '15', color }}>
        {score}/{max} ({pct}%)
      </span>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#062850' }}>
          {isPrimary ? '🏆 My Results' : 'My Results'}
        </h1>
        <p className="text-gray-500 text-sm">{childRecord.year_group_label}</p>
      </div>

      {classworks.length === 0 && homeworks.length === 0 && tests.length === 0 ? (
        <div className={`text-center py-12 rounded-${isPrimary ? '3xl' : '2xl'} bg-white border border-gray-100`}>
          <div className="text-5xl mb-4">🌟</div>
          <p className="font-bold mb-1" style={{ color: '#062850' }}>
            {isPrimary ? 'No results yet!' : 'No results yet'}
          </p>
          <p className="text-gray-400 text-sm">
            {isPrimary ? 'Complete your classwork to see your stars here!' : 'Complete classwork and homework to see your results.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">

          {classworks.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <h2 className="font-bold" style={{ color: '#062850' }}>Classwork</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {classworks.map(cw => (
                  <div key={cw.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{SUBJECT_EMOJIS[cw.subject_code] || '📚'}</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#062850' }}>{cw.topic_name}</p>
                        <p className="text-xs text-gray-400">{SUBJECT_MAP[cw.subject_code] || cw.subject_code}</p>
                      </div>
                    </div>
                    <ScoreDisplay score={cw.score || 0} max={cw.max_score || 10} isPrimary={isPrimary} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {homeworks.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="text-xl">📝</span>
                <h2 className="font-bold" style={{ color: '#062850' }}>Homework</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {homeworks.map(hw => (
                  <div key={hw.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{SUBJECT_EMOJIS[hw.subject_code] || '📚'}</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#062850' }}>{hw.topic_name}</p>
                        <p className="text-xs text-gray-400">{SUBJECT_MAP[hw.subject_code] || hw.subject_code}</p>
                      </div>
                    </div>
                    <ScoreDisplay score={hw.score || 0} max={hw.max_score || 12} isPrimary={isPrimary} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tests.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h2 className="font-bold" style={{ color: '#062850' }}>Tests</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {tests.map(test => (
                  <div key={test.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#062850' }}>{test.title}</p>
                      <p className="text-xs capitalize text-gray-400">
                        {test.type === 'monthly_test' ? 'Monthly Test' : 'Quarterly Exam'}
                      </p>
                    </div>
                    <ScoreDisplay score={test.score || 0} max={test.max_score || 40} isPrimary={isPrimary} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
