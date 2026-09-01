import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import RoadmapView from '@/components/academy/learning/RoadmapView'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function StudentRoadmapPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  // Get enrollment
  const { data: enrollment } = await admin
    .from('academy_enrollments')
    .select('id')
    .eq('parent_id', user.id)
    .maybeSingle()

  if (!enrollment) redirect('/dashboard/academy')

  // Get children
  const { data: children } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label')
    .eq('enrollment_id', enrollment.id)

  // Get roadmap for first child (or all)
  const childIds = (children || []).map(c => c.id)
  const { data: topics } = childIds.length > 0 ? await admin
    .from('learning_roadmap_progress')
    .select('*')
    .in('child_id', childIds)
    .order('subject_code')
    .order('topic_index') : { data: [] }

  const firstChild = children?.[0]

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Learning Roadmap
        </h1>
        <p className="text-gray-500 text-sm">
          Track progress through every topic. Green = completed, Blue = currently learning, Grey = coming soon.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
        {[
          { color: '#16A34A', label: 'Completed', icon: '✅' },
          { color: '#3B82F6', label: 'Currently Learning', icon: '🔵' },
          { color: '#D1D5DB', label: 'Coming Soon', icon: '⬜' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs font-medium text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {firstChild && (
        <div className="mb-4">
          <p className="text-sm font-semibold" style={{ color: '#062850' }}>
            {firstChild.full_name} — {firstChild.year_group_label}
          </p>
        </div>
      )}

      <RoadmapView
        topics={topics || []}
        childName={firstChild?.full_name || 'Learner'}
        canEdit={false}
      />
    </div>
  )
}
