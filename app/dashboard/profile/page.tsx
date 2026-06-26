import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import ProfileEditor from
  '@/components/dashboard/ProfileEditor'

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <ProfileEditor profile={profile} />
    </div>
  )
}