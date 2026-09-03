import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import SettingsEditor from '@/components/dashboard/SettingsEditor'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function PrincipalSettingsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles')
    .select('notification_email, notification_inapp, profile_visibility, timezone, language, role')
    .eq('id', user.id).single()
  if (!profile || profile.role !== 'principal') redirect('/auth/staff-login')

  return (
    <SettingsEditor userId={user.id} userEmail={user.email || ''} initialSettings={profile || {}} />
  )
}
