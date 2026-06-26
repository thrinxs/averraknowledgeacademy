import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import NotificationsList from
  '@/components/dashboard/NotificationsList'

export default async function NotificationsPage() {
  const supabase =
    await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <NotificationsList
        notifications={notifications || []}
        userId={user.id}
      />
    </div>
  )
}