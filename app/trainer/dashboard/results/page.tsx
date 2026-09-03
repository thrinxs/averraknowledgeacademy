import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { TrendingUp, BookOpen, FileText, Star } from 'lucide-react'
import Link from 'next/link'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function TrainerResultsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'trainer') redirect('/auth/staff-login')

  // Get assigned children
  const { data: children } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label')
    .eq('assigned_trainer_id', user.id)

  const childIds = (children || []).map(c => c.id)

  // Get recent results
  const [cwRes, hwRes, testRes] = await Promise.all([
    childIds.length > 0 ? admin.from('classwork').select('*, academy_children(full_name)').in('child_id', childIds).eq('status', 'submitted').order('graded_at', { ascending: false }).limit(20) : { data: [] },
    childIds.length > 0 ? admin.from('homework').select('*, academy_children(full_name)').in('child_id', childIds).eq('status', 'submitted').order('graded_at', { ascending: false }).limit(20) : { data: [] },
    childIds.length > 0 ? admin.from('tests_exams').select('*, academy_children(full_name)').in('child_id', childIds).eq('status', 'completed').order('graded_at', { ascending: false }).limit(10) : { data: [] },
  ])

  const classworks = cwRes.data || []
  const homeworks = hwRes.data || []
  const tests = testRes.data || []

  function ScoreBadge({ score, max }: { score: number; max: number }) {
    const pct = max > 0 ? Math.round((score / max) * 100) : 0
    const color = pct >= 70 ? '#16A34A' : pct >= 40 ? '#F59E0B' : '#DC2626'
    const bg = pct >= 70 ? '#F0FDF4' : pct >= 40 ? '#FFF8F0' : '#FEF2F2'
    return (
      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: bg, color }}>
        {score}/{max} ({pct}%)
      </span>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>Student Results</h1>
        <p className="text-gray-500 text-sm">Overview of all your students' performance</p>
      </div>

      {/* Student quick links */}
      {children && children.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">View by Student</p>
          <div className="flex flex-wrap gap-2">
            {children.map(child => (
              <Link key={child.id}
                href={`/trainer/dashboard/assessments?child_id=${child.id}`}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
                style={{ backgroundColor: '#F0F6FB', color: '#497296' }}>
                {child.full_name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Classwork */}
      {classworks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: '#497296' }} />
            <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Recent Classwork</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {classworks.map(cw => {
              const child = Array.isArray(cw.academy_children) ? cw.academy_children[0] : cw.academy_children as { full_name: string } | null
              return (
                <div key={cw.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{child?.full_name}</p>
                    <p className="text-xs text-gray-500">{cw.topic_name} — {new Date(cw.assigned_date).toLocaleDateString('en-GB')}</p>
                  </div>
                  <ScoreBadge score={cw.score || 0} max={cw.max_score || 10} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Homework */}
      {homeworks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: '#10B981' }} />
            <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Recent Homework</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {homeworks.map(hw => {
              const child = Array.isArray(hw.academy_children) ? hw.academy_children[0] : hw.academy_children as { full_name: string } | null
              return (
                <div key={hw.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{child?.full_name}</p>
                    <p className="text-xs text-gray-500">{hw.topic_name}</p>
                  </div>
                  <ScoreBadge score={hw.score || 0} max={hw.max_score || 12} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tests */}
      {tests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Star className="w-5 h-5" style={{ color: '#F59E0B' }} />
            <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Tests & Exams</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {tests.map(test => {
              const child = Array.isArray(test.academy_children) ? test.academy_children[0] : test.academy_children as { full_name: string } | null
              return (
                <div key={test.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{child?.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{test.type?.replace('_', ' ')} — {test.subject_code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.level_result && (
                      <span className="text-xs capitalize text-gray-500">{test.level_result}</span>
                    )}
                    <ScoreBadge score={test.score || 0} max={test.max_score || 40} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {classworks.length === 0 && homeworks.length === 0 && tests.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <TrendingUp className="w-10 h-10 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
          <p className="text-gray-500">No results yet</p>
          <p className="text-gray-400 text-sm mt-1">Results will appear here as students complete classwork and homework</p>
        </div>
      )}
    </div>
  )
}
