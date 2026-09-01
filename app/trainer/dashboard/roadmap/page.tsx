import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import TrainerRoadmapClient from '@/components/academy/learning/TrainerRoadmapClient'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function TrainerRoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ child_id?: string }>
}) {
  const { child_id } = await searchParams

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'trainer') redirect('/auth/staff-login')

  // Get assigned children
  const { data: children } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label, subjects')
    .eq('assigned_trainer_id', user.id)

  const selectedChildId = child_id || children?.[0]?.id || null

  // Get roadmap for selected child
  const { data: topics } = selectedChildId ? await admin
    .from('learning_roadmap_progress')
    .select('*')
    .eq('child_id', selectedChildId)
    .order('subject_code')
    .order('topic_index') : { data: [] }

  const selectedChild = children?.find(c => c.id === selectedChildId)

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Learning Roadmap
        </h1>
        <p className="text-gray-500 text-sm">
          Track curriculum progress, access lesson plans and mark topics as taught.
        </p>
      </div>

      {/* Child selector */}
      {children && children.length > 1 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {children.map(child => (
            <a key={child.id}
              href={`/trainer/dashboard/roadmap?child_id=${child.id}`}
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

      {selectedChild && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-4"
          style={{ backgroundColor: '#EBF4FF' }}>
          <div>
            <p className="font-bold" style={{ color: '#062850' }}>{selectedChild.full_name}</p>
            <p className="text-xs text-gray-500">{selectedChild.year_group_label}</p>
          </div>
        </div>
      )}

      <TrainerRoadmapClient
        topics={topics || []}
        childName={selectedChild?.full_name || 'Learner'}
        childId={selectedChildId || ''}
      />
    </div>
  )
}
