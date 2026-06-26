import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import MessagesInbox from
  '@/components/dashboard/MessagesInbox'

export default async function MessagesPage() {
  const supabase =
    await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  // Get all messages where user is sender or receiver
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .or(
      `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
    )
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <MessagesInbox
        messages={messages || []}
        userId={user.id}
        userName={profile?.full_name || 'Student'}
      />
    </div>
  )
}