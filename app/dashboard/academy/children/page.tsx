import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import ChildAccountManager from '@/components/academy/learning/ChildAccountManager'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function ChildAccountsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  const { data: enrollment } = await admin
    .from('academy_enrollments')
    .select('id')
    .eq('parent_id', user.id)
    .maybeSingle()

  if (!enrollment) redirect('/dashboard/academy')

  const { data: children } = await admin
    .from('academy_children')
    .select('id, full_name, year_group_label, subjects, child_user_id')
    .eq('enrollment_id', enrollment.id)

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Child Accounts
        </h1>
        <p className="text-gray-500 text-sm">
          Create separate login accounts for your children so they can access their dashboard independently.
          You can still monitor everything from your account.
        </p>
      </div>
      <ChildAccountManager children={children || []} />
    </div>
  )
}
