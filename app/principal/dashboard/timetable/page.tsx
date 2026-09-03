import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function PrincipalTimetableManagerPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'principal') redirect('/auth/staff-login')

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
        Timetable Manager
      </h1>
      <p className="text-gray-500 text-sm mb-6">Manage class schedules and Google Meet links</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <p className="text-gray-400 text-sm">This section is being built. Check back soon.</p>
      </div>
    </div>
  )
}
