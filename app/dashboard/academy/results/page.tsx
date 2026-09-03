import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle, BookOpen, FileText, Star } from 'lucide-react'

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

export default async function StudentResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ child_id?: string }>
}) {
  const { child_id } = await searchParams

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  const { data: enrollment } = await admin
    .from('academy_enrollments')
    .select('id')
    .eq('parent_id', user.id)
    .maybeSingle()

  if (!enrollment) redirect('/dashboard/academy')

  const { data: children } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label')
    .eq('enrollment_id', enrollment.id)

  const selectedChildId = child_id || children?.[0]?.id || ''
  const selectedChild = children?.find(c => c.id === selectedChildId)

  // Get all results
  const [classworkRes, homeworkRes, testsRes] = await Promise.all([
    admin.from('classwork').select('*').eq('child_id', selectedChildId)
      .eq('status', 'submitted').order('assigned_date', { ascending: false }).limit(20),
    admin.from('homework').select('*').eq('child_id', selectedChildId)
      .eq('status', 'submitted').order('assigned_date', { ascending: false }).limit(20),
    admin.from('tests_exams').select('*').eq('child_id', selectedChildId)
      .eq('status', 'completed').order('created_at', { ascending: false }).limit(10),
  ])

  const classworks = classworkRes.data || []
  const homeworks = homeworkRes.data || []
  const tests = testsRes.data || []

  // Calculate averages
  const cwAvg = classworks.length > 0
    ? Math.round(classworks.reduce((sum, c) => sum + ((c.score || 0) / (c.max_score || 1)) * 100, 0) / classworks.length)
    : null
  const hwAvg = homeworks.length > 0
    ? Math.round(homeworks.reduce((sum, h) => sum + ((h.score || 0) / (h.max_score || 1)) * 100, 0) / homeworks.length)
    : null
  const testAvg = tests.length > 0
    ? Math.round(tests.reduce((sum, t) => sum + ((t.score || 0) / (t.max_score || 1)) * 100, 0) / tests.length)
    : null

  function ScoreBadge({ score, max }: { score: number; max: number }) {
    const pct = max > 0 ? Math.round((score / max) * 100) : 0
    const color = pct >= 70 ? '#16A34A' : pct >= 40 ? '#F59E0B' : '#DC2626'
    const bg = pct >= 70 ? '#F0FDF4' : pct >= 40 ? '#FFF8F0' : '#FEF2F2'
    return (
      <span className="text-xs font-bold px-2 py-1 rounded-full"
        style={{ backgroundColor: bg, color }}>
        {score}/{max} ({pct}%)
      </span>
    )
  }

  return (
    <div className="p-6 md:p-10">

      {/* Child selector */}
      {children && children.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {children.map(child => (
            <a key={child.id}
              href={`/dashboard/academy/results?child_id=${child.id}`}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: child.id === selectedChildId ? '#062850' : '#F0F6FB',
                color: child.id === selectedChildId ? '#ffffff' : '#497296',
              }}>
              {child.full_name}
            </a>
          ))}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#062850' }}>
          My Results
        </h1>
        <p className="text-gray-500 text-sm">
          {selectedChild?.full_name} — {selectedChild?.year_group_label}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Classwork Average', value: cwAvg, count: classworks.length, icon: BookOpen, color: '#497296' },
          { label: 'Homework Average', value: hwAvg, count: homeworks.length, icon: FileText, color: '#10B981' },
          { label: 'Test Average', value: testAvg, count: tests.length, icon: Star, color: '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
            {stat.value !== null ? (
              <div>
                <p className="text-3xl font-bold" style={{ color: '#062850' }}>{stat.value}%</p>
                <p className="text-xs text-gray-400 mt-1">{stat.count} completed</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No results yet</p>
            )}
          </div>
        ))}
      </div>

      {/* Classwork results */}
      {classworks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: '#497296' }} />
            <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Classwork Results</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {classworks.map(cw => (
              <div key={cw.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#062850' }}>{cw.topic_name}</p>
                  <p className="text-xs text-gray-500">
                    {SUBJECT_MAP[cw.subject_code] || cw.subject_code} •{' '}
                    {new Date(cw.assigned_date).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <ScoreBadge score={cw.score || 0} max={cw.max_score || 10} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Homework results */}
      {homeworks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: '#10B981' }} />
            <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Homework Results</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {homeworks.map(hw => (
              <div key={hw.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#062850' }}>{hw.topic_name}</p>
                  <p className="text-xs text-gray-500">
                    {SUBJECT_MAP[hw.subject_code] || hw.subject_code} •{' '}
                    Due: {new Date(hw.due_date || hw.assigned_date).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <ScoreBadge score={hw.score || 0} max={hw.max_score || 10} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tests and Exams */}
      {tests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Star className="w-5 h-5" style={{ color: '#F59E0B' }} />
            <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Tests & Exams</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {tests.map(test => (
              <div key={test.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#062850' }}>{test.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{
                        backgroundColor: test.type === 'monthly_test' ? '#EBF4FF' : '#FFF8F0',
                        color: test.type === 'monthly_test' ? '#497296' : '#F59E0B',
                      }}>
                      {test.type === 'monthly_test' ? 'Monthly Test' : 'Quarterly Exam'}
                    </span>
                    {test.level_result && (
                      <span className="text-xs capitalize text-gray-500">{test.level_result}</span>
                    )}
                  </div>
                </div>
                <ScoreBadge score={test.score || 0} max={test.max_score || 40} />
              </div>
            ))}
          </div>
        </div>
      )}

      {classworks.length === 0 && homeworks.length === 0 && tests.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
          <p className="text-gray-500 font-medium mb-1">No results yet</p>
          <p className="text-gray-400 text-sm">Complete your classwork and homework to see results here.</p>
        </div>
      )}

    </div>
  )
}
