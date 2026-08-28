import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import AssessmentClient from '@/components/academy/AssessmentClient'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ assessment_id?: string }>
}) {
  const { assessment_id } = await searchParams
  if (!assessment_id) redirect('/dashboard/academy')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  const { data: assessment } = await admin
    .from('assessments')
    .select('*, academy_children(full_name, subjects, year_group_label)')
    .eq('id', assessment_id)
    .single()

  if (!assessment) redirect('/dashboard/academy')

  if (assessment.status === 'completed' || assessment.status === 'expired') {
    redirect('/dashboard/academy/assessment/results?assessment_id=' + assessment_id)
  }

  const child = Array.isArray(assessment.academy_children)
    ? assessment.academy_children[0]
    : assessment.academy_children

  return (
    <AssessmentClient
      assessmentId={assessment_id}
      childName={child?.full_name || 'Learner'}
      yearGroupLabel={child?.year_group_label || ''}
      subjects={child?.subjects || []}
    />
  )
}
