import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import StaffShell from '@/components/staff/StaffShell'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, email, role, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'staff') {
    redirect('/auth/staff-login')
  }

  return (
    <StaffShell
      fullName={profile.full_name || 'Staff'}
      email={profile.email || user.email || ''}
      avatarUrl={profile.avatar_url || null}
    >
      {children}
    </StaffShell>
  )
}
