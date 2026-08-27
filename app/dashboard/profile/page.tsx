import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import ProfileEditor from '@/components/dashboard/ProfileEditor'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: enrollment } = await admin
    .from('academy_enrollments')
    .select('applicant_type')
    .eq('parent_id', user.id)
    .maybeSingle()

  const { data: scholarship } = await admin
    .from('scholarship_preferences')
    .select('selected_package')
    .eq('user_id', user.id)
    .maybeSingle()

  const services: string[] = []
  if (enrollment) {
    services.push(
      enrollment.applicant_type === 'parent'
        ? 'Parent / Guardian (Junior Academy)'
        : 'Student (Junior Academy)'
    )
  }
  if (scholarship) {
    services.push('Scholarship Matching')
  }

  return (
    <ProfileEditor
      initialProfile={profile || {}}
      userId={user.id}
      userEmail={user.email || ''}
      dbRole={(profile?.role as string) || 'student'}
      services={services}
    />
  )
}
