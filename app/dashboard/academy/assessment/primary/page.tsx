import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import PrimaryAssessmentClient from '@/components/academy/assessment/PrimaryAssessmentClient'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function PrimaryAssessmentPage({
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
    .select('*, academy_children(full_name, year_group_label, year_group_code, subjects)')
    .eq('id', assessment_id)
    .single()

  if (!assessment) redirect('/dashboard/academy')

  if (assessment.status === 'completed' || assessment.status === 'expired') {
    redirect('/dashboard/academy/assessment/results?assessment_id=' + assessment_id)
  }

  const child = Array.isArray(assessment.academy_children)
    ? assessment.academy_children[0]
    : assessment.academy_children

  const yearCode = child?.year_group_code || ''
  const primaryYears = ['Y1','Y2','Y3','Y4','Y5','Y6','P1','P2','P3','P4','P5','P6','Year 1','Year 2','Year 3','Year 4','Year 5','Year 6']
  const isPrimary = primaryYears.includes(yearCode)

  if (!isPrimary) {
    redirect('/dashboard/academy/assessment?assessment_id=' + assessment_id)
  }

  return (
    <PrimaryAssessmentClient
      assessmentId={assessment_id}
      childName={child?.full_name || 'Learner'}
      yearGroupLabel={child?.year_group_label || yearCode}
      yearGroupCode={yearCode}
    />
  )
}
