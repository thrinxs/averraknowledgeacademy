import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import MatchesList from
  '@/components/dashboard/MatchesList'
import {
  getTravelRequirementsForCountries,
} from '@/lib/travel-requirements'

export default async function MatchesPage() {
  const supabase =
    await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: preferences } = await supabase
    .from('scholarship_preferences')
    .select(
      'payment_status, selected_package, preferred_countries'
    )
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: profile } = await supabase
    .from('profiles')
    .select('country')
    .eq('id', user.id)
    .maybeSingle()

  const { data: matches } = await supabase
    .from('scholarship_matches')
    .select(`
      *,
      scholarship:scholarships(*)
    `)
    .eq('user_id', user.id)
    .order('match_score', { ascending: false })

  // Get unique destination countries from matches
  const destinationCountries = [
    ...new Set(
      (matches || [])
        .map((m) => m.scholarship?.country)
        .filter(Boolean)
    ),
  ]

  // Fetch travel requirements for all destination countries
  const travelRequirements =
    profile?.country && destinationCountries.length > 0
      ? await getTravelRequirementsForCountries(
          profile.country,
          destinationCountries
        )
      : {}

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <MatchesList
        matches={matches || []}
        paymentStatus={
          preferences?.payment_status || 'unpaid'
        }
        userCountry={profile?.country || ''}
        travelRequirements={travelRequirements}
      />
    </div>
  )
}