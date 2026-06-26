import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import AdminMessages from
  '@/components/admin/AdminMessages'

export default async function AdminMessagesPage() {
  const supabase =
    await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get all messages sent by students (receiver_id is null)
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .is('receiver_id', null)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <AdminMessages
        messages={messages || []}
        adminId={user?.id || ''}
      />
    </div>
  )
}