import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import UsersManagement from
  '@/components/admin/UsersManagement'

export default async function UsersPage() {
  const supabase =
    await createSupabaseServerClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <UsersManagement users={users || []} />
    </div>
  )
}