import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import HomeworkClient from '@/components/academy/learning/HomeworkClient'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function StudentHomeworkPage({
  searchParams,
}: {
  searchParams: Promise<{ child_id?: string; date?: string }>
}) {
  const { child_id, date } = await searchParams

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  const { data: enrollment } = await admin
    .from('academy_enrollments')
    .select('id')
    .eq('parent_id', user.id)
    .maybeSingle()

  if (!enrollment) redirect('/dashboard/academy')

  const { data: children } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label, subjects')
    .eq('enrollment_id', enrollment.id)

  const selectedChildId = child_id || children?.[0]?.id || ''
  const selectedChild = children?.find(c => c.id === selectedChildId)
  const today = date || new Date().toISOString().split('T')[0]

  const { data: homeworks } = selectedChildId ? await admin
    .from('homework')
    .select('*')
    .eq('child_id', selectedChildId)
    .eq('assigned_date', today)
    .order('subject_code') : { data: [] }

  return (
    <HomeworkClient
      childId={selectedChildId}
      childName={selectedChild?.full_name || 'Learner'}
      yearGroupLabel={selectedChild?.year_group_label || ''}
      subjects={selectedChild?.subjects || []}
      homeworks={homeworks || []}
      date={today}
      children={(children || []).map(c => ({ id: c.id, full_name: c.full_name }))}
    />
  )
}
