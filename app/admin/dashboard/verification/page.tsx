import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import MatchVerification from
  '@/components/admin/MatchVerification'

export default async function VerificationPage() {
  const supabase =
    await createSupabaseServerClient()

  const { data: matches } = await supabase
    .from('scholarship_matches')
    .select(`
      *,
      scholarship:scholarships(*),
      profile:profiles!scholarship_matches_user_id_fkey(
        full_name, email, country
      )
    `)
    .order('created_at', { ascending: false })

  // Fetch all active scholarships for the swap dropdown
  const { data: scholarships } = await supabase
    .from('scholarships')
    .select('id, name, country')
    .eq('is_active', true)
    .order('name', { ascending: true })

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <MatchVerification
        matches={matches || []}
        scholarships={scholarships || []}
      />
    </div>
  )
}