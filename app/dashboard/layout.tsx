import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import DashboardSidebar from
  '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role && profile.role !== 'student') {
    redirect(`/${profile.role}/dashboard`)
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        fullName={profile?.full_name || 'Student'}
        email={profile?.email || user.email || ''}
        avatarUrl={profile?.avatar_url || null}
      />
            <main
        className="flex-1 lg:ml-64 min-h-screen
        pt-16 lg:pt-0"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        {children}
      </main>
    </div>
  )
}