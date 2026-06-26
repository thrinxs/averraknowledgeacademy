import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import ScholarshipStatus from
  '@/components/dashboard/ScholarshipStatus'
import {
  getTravelRequirementsForCountries,
} from '@/lib/travel-requirements'

export default async function ScholarshipPage() {
  const supabase =
    await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: preferences } = await supabase
    .from('scholarship_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: academic } = await supabase
    .from('academic_backgrounds')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: profile } = await supabase
    .from('profiles')
    .select('country')
    .eq('id', user.id)
    .maybeSingle()

  // Fetch travel requirements for preferred countries
  const preferredCountries =
    preferences?.preferred_countries || []

  const travelRequirements =
    profile?.country && preferredCountries.length > 0
      ? await getTravelRequirementsForCountries(
          profile.country,
          preferredCountries
        )
      : {}

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <ScholarshipStatus
        preferences={preferences}
        academic={academic}
        userId={user.id}
        travelRequirements={travelRequirements}
        userCountry={profile?.country || ''}
      />
    </div>
  )
}