import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import RoadmapView from '@/components/academy/learning/RoadmapView'
import { getAgeGroup } from '@/utils/auth'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function ChildRoadmapPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('account_type').eq('id', user.id).single()
  if (profile?.account_type !== 'child') redirect('/dashboard')

  const { data: childRecord } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_code, year_group_label')
    .eq('child_user_id', user.id)
    .maybeSingle()

  if (!childRecord) redirect('/child/dashboard')

  const isPrimary = getAgeGroup(childRecord.year_group_code || 'Year 1') === 'primary'

  const { data: topics } = await admin
    .from('learning_roadmap_progress')
    .select('*')
    .eq('child_id', childRecord.id)
    .order('subject_code')
    .order('topic_index')

  const completed = (topics || []).filter(t => t.status === 'completed').length
  const total = (topics || []).length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#062850' }}>
          {isPrimary ? '🌟 My Learning Journey' : 'Learning Roadmap'}
        </h1>
        <p className="text-gray-500 text-sm">{childRecord.year_group_label}</p>
      </div>

      {/* Progress summary */}
      {total > 0 && (
        <div className={`rounded-${isPrimary ? '3xl' : '2xl'} p-5 mb-6`}
          style={{ background: 'linear-gradient(135deg, #062850 0%, #497296 100%)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-bold">{isPrimary ? '📚 Topics Learned' : 'Overall Progress'}</p>
            <p className="text-white font-bold text-xl">{completed}/{total}</p>
          </div>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: '#F59E0B' }} />
          </div>
          <p className="text-blue-200 text-xs mt-2">{pct}% complete {isPrimary ? '🎉' : ''}</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-white border border-gray-100">
        {[
          { color: '#16A34A', label: isPrimary ? '✅ Done!' : 'Completed', icon: '✅' },
          { color: '#3B82F6', label: isPrimary ? '📖 Learning now' : 'Current', icon: '🔵' },
          { color: '#D1D5DB', label: isPrimary ? '⏳ Coming soon' : 'Upcoming', icon: '⬜' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs font-medium text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      <RoadmapView
        topics={topics || []}
        childName={childRecord.full_name}
        canEdit={false}
      />
    </div>
  )
}
