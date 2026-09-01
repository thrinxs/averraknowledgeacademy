import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function TrainerMySchedulePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
        My Schedule
      </h1>
      <p className="text-gray-500 text-sm">
        This section is being built. Check back soon.
      </p>
    </div>
  )
}
