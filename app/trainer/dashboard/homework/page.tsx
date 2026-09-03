import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { FileText, CheckCircle, Clock } from 'lucide-react'

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

export default async function TrainerHomeworkPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'trainer') redirect('/auth/staff-login')

  const today = new Date().toISOString().split('T')[0]

  const { data: homeworks } = await admin
    .from('homework')
    .select('*, academy_children(full_name, year_group_label)')
    .eq('trainer_id', user.id)
    .eq('assigned_date', today)
    .order('subject_code')

  const submitted = (homeworks || []).filter(h => h.status === 'submitted')

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>Homework Manager</h1>
        <p className="text-gray-500 text-sm">
          Today: {new Date(today).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Assigned', value: homeworks?.length || 0, icon: FileText, color: '#497296' },
          { label: 'Submitted', value: submitted.length, icon: CheckCircle, color: '#16A34A' },
          { label: 'Pending', value: (homeworks?.length || 0) - submitted.length, icon: Clock, color: '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#062850' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg" style={{ color: '#062850' }}>Today's Homework</h2>
        </div>
        {(!homeworks || homeworks.length === 0) ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p className="text-gray-500">No homework assigned today</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {homeworks.map(hw => {
              const child = Array.isArray(hw.academy_children) ? hw.academy_children[0] : hw.academy_children as { full_name: string; year_group_label: string } | null
              const pct = hw.max_score > 0 ? Math.round(((hw.score || 0) / hw.max_score) * 100) : null
              return (
                <div key={hw.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{child?.full_name || 'Student'}</p>
                    <p className="text-xs text-gray-500">{SUBJECT_MAP[hw.subject_code] || hw.subject_code} — {hw.topic_name}</p>
                    {hw.due_date && <p className="text-xs text-amber-600">Due: {new Date(hw.due_date).toLocaleDateString('en-GB')}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    {pct !== null && <p className="text-sm font-bold" style={{ color: '#062850' }}>{pct}%</p>}
                    <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                      style={{ backgroundColor: hw.status === 'submitted' ? '#F0FDF4' : '#FFF8F0', color: hw.status === 'submitted' ? '#16A34A' : '#F59E0B' }}>
                      {hw.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
