import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Clock, CheckCircle, Star, BookOpen, AlertCircle } from 'lucide-react'

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

export default async function StudentTestsPage({
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
    .select('id, full_name, year_group_label, subjects')
    .eq('enrollment_id', enrollment.id)

  const selectedChildId = child_id || children?.[0]?.id || ''
  const selectedChild = children?.find(c => c.id === selectedChildId)

  const { data: tests } = selectedChildId ? await admin
    .from('tests_exams')
    .select('*')
    .eq('child_id', selectedChildId)
    .order('created_at', { ascending: false }) : { data: [] }

  const scheduled = (tests || []).filter(t => t.status === 'scheduled')
  const completed = (tests || []).filter(t => t.status === 'completed' || t.status === 'graded')

  return (
    <div className="p-6 md:p-10">
      {children && children.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {children.map(child => (
            <a key={child.id}
              href={`/dashboard/academy/tests?child_id=${child.id}`}
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
          Tests & Exams
        </h1>
        <p className="text-gray-500 text-sm">
          {selectedChild?.full_name} — {selectedChild?.year_group_label}
        </p>
      </div>

      {/* Scheduled tests */}
      {scheduled.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#062850' }}>
            <AlertCircle className="w-5 h-5 text-amber-500" /> Upcoming Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduled.map(test => (
              <div key={test.id} className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden">
                <div className="p-5" style={{ backgroundColor: '#FFF8F0' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-1 rounded-full capitalize"
                      style={{ backgroundColor: '#F59E0B', color: '#ffffff' }}>
                      {test.type === 'monthly_test' ? 'Monthly Test' : 'Quarterly Exam'}
                    </span>
                    <span className="text-xs text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {test.duration_minutes} mins
                    </span>
                  </div>
                  <p className="font-bold" style={{ color: '#062850' }}>{test.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {SUBJECT_MAP[test.subject_code] || test.subject_code}
                  </p>
                  {test.scheduled_date && (
                    <p className="text-xs text-amber-700 mt-1">
                      Scheduled: {new Date(test.scheduled_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="p-4">
                  <Link href={`/dashboard/academy/tests/take?test_id=${test.id}`}>
                    <div className="w-full py-3 rounded-xl text-white font-semibold text-sm text-center transition-all hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: '#F59E0B' }}>
                      Start Test →
                    </div>
                  </Link>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    {test.questions?.length || 0} questions • Timed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed tests */}
      {completed.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#062850' }}>
            <CheckCircle className="w-5 h-5 text-green-500" /> Completed Tests
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {completed.map(test => {
                const pct = test.max_score > 0 ? Math.round(((test.score || 0) / test.max_score) * 100) : 0
                const color = pct >= 70 ? '#16A34A' : pct >= 40 ? '#F59E0B' : '#DC2626'
                const bg = pct >= 70 ? '#F0FDF4' : pct >= 40 ? '#FFF8F0' : '#FEF2F2'
                return (
                  <div key={test.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#062850' }}>{test.title}</p>
                      <p className="text-xs text-gray-500">
                        {SUBJECT_MAP[test.subject_code] || test.subject_code} •{' '}
                        {test.type === 'monthly_test' ? 'Monthly Test' : 'Quarterly Exam'}
                      </p>
                      {test.level_result && (
                        <span className="text-xs capitalize text-gray-400">{test.level_result}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: bg, color }}>
                        {test.score}/{test.max_score} ({pct}%)
                      </span>
                      <Link href={`/dashboard/academy/tests/results?test_id=${test.id}`}
                        className="text-xs text-blue-600 hover:underline">
                        Details
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {scheduled.length === 0 && completed.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Star className="w-12 h-12 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
          <p className="text-gray-500 font-medium mb-1">No tests yet</p>
          <p className="text-gray-400 text-sm">Your teacher will schedule tests when you are ready.</p>
        </div>
      )}
    </div>
  )
}
