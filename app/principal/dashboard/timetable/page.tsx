import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import PrincipalTimetableClient from '@/components/principal/PrincipalTimetableClient'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function PrincipalTimetablePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'principal') redirect('/auth/staff-login')

  const [childrenRes, trainersRes, slotsRes] = await Promise.all([
    admin.from('academy_children').select('id, full_name, year_group_label, subjects, assigned_trainer_id, assigned_trainer_name, timetable, timetable_confirmed').order('full_name'),
    admin.from('profiles').select('id, full_name, email').eq('role', 'trainer').order('full_name'),
    admin.from('class_slots').select('*').eq('is_active', true),
  ])

  return (
    <PrincipalTimetableClient
      children={childrenRes.data || []}
      trainers={trainersRes.data || []}
      classSlots={slotsRes.data || []}
    />
  )
}
