import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getDashboardRouteByRole } from '@/utils/auth'

export default async function TrainerDashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .maybeSingle()

  const role = profile?.role || 'student'

  if (role !== 'trainer') {
    redirect(getDashboardRouteByRole(role))
  }

  return (
    <div className="min-h-screen bg-white px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <p
          className="text-sm font-medium mb-2"
          style={{ color: '#497296' }}
        >
          Trainer Dashboard
        </p>
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: '#062850' }}
        >
          Welcome, {profile?.full_name || 'Trainer'}
        </h1>
        <p className="text-gray-600">
          Your trainer dashboard shell is working. Full
          course delivery, earnings, and payout tools will
          be built in the trainer dashboard phase.
        </p>
      </div>
    </div>
  )
}