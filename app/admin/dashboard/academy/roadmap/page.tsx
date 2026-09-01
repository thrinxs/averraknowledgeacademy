import { createClient } from '@supabase/supabase-js'
import RoadmapView from '@/components/academy/learning/RoadmapView'
import Link from 'next/link'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function AdminRoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ child_id?: string }>
}) {
  const { child_id } = await searchParams
  const admin = getAdminClient()

  // Get all children with roadmaps
  const { data: children } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label, assigned_trainer_name')
    .order('full_name')

  const selectedChildId = child_id || children?.[0]?.id || null
  const selectedChild = children?.find(c => c.id === selectedChildId)

  const { data: topics } = selectedChildId ? await admin
    .from('learning_roadmap_progress')
    .select('*')
    .eq('child_id', selectedChildId)
    .order('subject_code')
    .order('topic_index') : { data: [] }

  // Stats
  const total = topics?.length || 0
  const completed = topics?.filter(t => t.status === 'completed').length || 0
  const current = topics?.filter(t => t.status === 'current').length || 0

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Learning Roadmap Overview
        </h1>
        <p className="text-gray-500 text-sm">Monitor curriculum progress across all learners.</p>
      </div>

      {/* Child selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-3">Select Learner:</p>
        <div className="flex flex-wrap gap-2">
          {(children || []).map(child => (
            <Link key={child.id}
              href={`/admin/dashboard/academy/roadmap?child_id=${child.id}`}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: child.id === selectedChildId ? '#062850' : '#F0F6FB',
                color: child.id === selectedChildId ? '#ffffff' : '#497296',
              }}>
              {child.full_name}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      {selectedChild && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Topics', value: total, color: '#062850' },
            { label: 'Completed', value: completed, color: '#16A34A' },
            { label: 'In Progress', value: current, color: '#3B82F6' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              {total > 0 && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(stat.value / total) * 100}%`, backgroundColor: stat.color }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedChild && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-bold" style={{ color: '#062850' }}>{selectedChild.full_name}</p>
            <p className="text-xs text-gray-500">
              {selectedChild.year_group_label}
              {selectedChild.assigned_trainer_name && ` • Trainer: ${selectedChild.assigned_trainer_name}`}
            </p>
          </div>
        </div>
      )}

      <RoadmapView
        topics={topics || []}
        childName={selectedChild?.full_name || 'Learner'}
        canEdit={false}
      />
    </div>
  )
}
