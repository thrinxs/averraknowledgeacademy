import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import ClassworkClient from '@/components/academy/learning/ClassworkClient'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function ChildClassworkPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('account_type').eq('id', user.id).single()
  if (profile?.account_type !== 'child') redirect('/dashboard')

  const { data: childRecord } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label, subjects, enrollment_id')
    .eq('child_user_id', user.id)
    .maybeSingle()

  if (!childRecord) redirect('/child/dashboard')

  const today = new Date().toISOString().split('T')[0]
  const { data: classworks } = await admin
    .from('classwork')
    .select('*')
    .eq('child_id', childRecord.id)
    .eq('assigned_date', today)
    .order('subject_code')

  return (
    <ClassworkClient
      childId={childRecord.id}
      childName={childRecord.full_name}
      yearGroupLabel={childRecord.year_group_label}
      subjects={childRecord.subjects || []}
      classworks={classworks || []}
      date={today}
      children={[{ id: childRecord.id, full_name: childRecord.full_name }]}
    />
  )
}
