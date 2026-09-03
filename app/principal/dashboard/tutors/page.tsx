import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { Users } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function PrincipalTutorsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'principal') redirect('/auth/staff-login')

  const { data: tutors } = await admin
    .from('profiles')
    .select('id, full_name, email, avatar_url, created_at')
    .eq('role', 'trainer')
    .order('full_name')

  // Get student count per tutor
  const { data: allChildren } = await admin
    .from('academy_children')
    .select('assigned_trainer_id')

  const studentCounts: Record<string, number> = {}
  for (const child of allChildren || []) {
    if (child.assigned_trainer_id) {
      studentCounts[child.assigned_trainer_id] = (studentCounts[child.assigned_trainer_id] || 0) + 1
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>Tutors</h1>
        <p className="text-gray-500 text-sm">{(tutors || []).length} tutors on the platform</p>
      </div>

      {(!tutors || tutors.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
          <p className="text-gray-500">No tutors yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutors.map(tutor => (
            <div key={tutor.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: '#497296' }}>
                  {tutor.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <p className="font-bold" style={{ color: '#062850' }}>{tutor.full_name}</p>
                  <p className="text-xs text-gray-500">{tutor.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#F0F6FB' }}>
                  <p className="text-lg font-bold" style={{ color: '#062850' }}>
                    {studentCounts[tutor.id] || 0}
                  </p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#F0F6FB' }}>
                  <p className="text-xs text-gray-500 mb-1">Member since</p>
                  <p className="text-xs font-semibold" style={{ color: '#062850' }}>
                    {new Date(tutor.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
