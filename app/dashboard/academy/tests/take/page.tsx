import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import TestTakingClient from '@/components/academy/learning/TestTakingClient'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function TakeTestPage({
  searchParams,
}: {
  searchParams: Promise<{ test_id?: string }>
}) {
  const { test_id } = await searchParams
  if (!test_id) redirect('/dashboard/academy/tests')

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()
  const { data: test } = await admin
    .from('tests_exams')
    .select('*')
    .eq('id', test_id)
    .single()

  if (!test) redirect('/dashboard/academy/tests')
  if (test.status === 'completed' || test.status === 'graded') {
    redirect(`/dashboard/academy/tests/results?test_id=${test_id}`)
  }

  return (
    <TestTakingClient
      testId={test_id}
      title={test.title}
      type={test.type}
      durationMinutes={test.duration_minutes || 30}
      questions={test.questions || []}
      maxScore={test.max_score || 0}
    />
  )
}
