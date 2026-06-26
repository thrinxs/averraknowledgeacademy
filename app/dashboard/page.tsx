import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import DashboardHome from
  '@/components/dashboard/DashboardHome'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Fetch scholarship preferences
  const { data: preferences } = await supabase
    .from('scholarship_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  // Fetch matches count
  const { count: matchCount } = await supabase
    .from('scholarship_matches')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Fetch unread notifications count
  const { count: notifCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

    // Fetch unread messages count
    const { count: msgCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .eq('is_read', false)

  return (
    <DashboardHome
      profile={profile}
      preferences={preferences}
      matchCount={matchCount || 0}
      notifCount={notifCount || 0}
      msgCount={msgCount || 0}
    />
  )
}