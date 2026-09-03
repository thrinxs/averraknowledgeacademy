import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { BarChart3, BookOpen, FileText, Star } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function PrincipalResultsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'principal') redirect('/auth/staff-login')

  const [cwRes, hwRes, testRes] = await Promise.all([
    admin.from('classwork').select('*, academy_children(full_name, year_group_label)')
      .eq('status', 'submitted').order('graded_at', { ascending: false }).limit(30),
    admin.from('homework').select('*, academy_children(full_name, year_group_label)')
      .eq('status', 'submitted').order('graded_at', { ascending: false }).limit(30),
    admin.from('tests_exams').select('*, academy_children(full_name, year_group_label)')
      .eq('status', 'completed').order('graded_at', { ascending: false }).limit(20),
  ])

  const classworks = cwRes.data || []
  const homeworks = hwRes.data || []
  const tests = testRes.data || []

  const cwAvg = classworks.length > 0
    ? Math.round(classworks.reduce((sum, c) => sum + ((c.score || 0) / (c.max_score || 1)) * 100, 0) / classworks.length)
    : null

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
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>Academic Results</h1>
        <p className="text-gray-500 text-sm">Platform-wide performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Avg Classwork Score', value: cwAvg !== null ? `${cwAvg}%` : 'N/A', icon: BookOpen, color: '#497296' },
          { label: 'Classwork Submitted', value: classworks.length, icon: FileText, color: '#16A34A' },
          { label: 'Tests Completed', value: tests.length, icon: Star, color: '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#062850' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {classworks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: '#497296' }} />
            <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Recent Classwork</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {classworks.slice(0, 10).map(cw => {
              const child = Array.isArray(cw.academy_children) ? cw.academy_children[0] : cw.academy_children as { full_name: string; year_group_label: string } | null
              return (
                <div key={cw.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{child?.full_name}</p>
                    <p className="text-xs text-gray-500">{cw.topic_name} — {cw.subject_code}</p>
                  </div>
                  <ScoreBadge score={cw.score || 0} max={cw.max_score || 10} />
                </div>
              )
            })}
          </div>
        </div>
      )}

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
                    {test.level_result && <span className="text-xs capitalize text-gray-400">{test.level_result}</span>}
                  </div>
                  <ScoreBadge score={test.score || 0} max={test.max_score || 40} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
