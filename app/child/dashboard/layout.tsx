import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import ChildShell from '@/components/child/ChildShell'
import { getAgeGroup } from '@/utils/auth'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function ChildDashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  // Get profile
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, email, role, avatar_url, account_type, parent_user_id')
    .eq('id', user.id)
    .maybeSingle()

  // Only child accounts can access this
  if (!profile || profile.account_type !== 'child') {
    redirect('/dashboard')
  }

  // Get child DB record to find year group
  const { data: childRecord } = await admin
    .from('academy_children')
    .select('id, year_group_code, year_group_label, full_name, subjects, enrollment_id')
    .eq('child_user_id', user.id)
    .maybeSingle()

  const yearGroupCode = childRecord?.year_group_code || 'Year 1'
  const ageGroup = getAgeGroup(yearGroupCode)

  return (
    <ChildShell
      fullName={profile.full_name || childRecord?.full_name || 'Student'}
      email={profile.email || user.email || ''}
      avatarUrl={profile.avatar_url || null}
      ageGroup={ageGroup}
      yearGroupLabel={childRecord?.year_group_label || yearGroupCode}
      childId={childRecord?.id || ''}
      enrollmentId={childRecord?.enrollment_id || ''}
      subjects={childRecord?.subjects || []}
    >
      {children}
    </ChildShell>
  )
}
