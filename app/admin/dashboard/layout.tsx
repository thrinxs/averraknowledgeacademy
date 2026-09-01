import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import AdminShell from '@/components/admin/AdminShell'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, email, role, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <AdminShell
      fullName={profile?.full_name || 'Admin'}
      email={profile?.email || user.email || ''}
      avatarUrl={profile?.avatar_url || null}
    >
      {children}
    </AdminShell>
  )
}
