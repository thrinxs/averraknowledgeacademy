import { createSupabaseServerClient } from
  './supabase-server'

export async function getTravelRequirements(
  fromCountry: string,
  toCountry: string
) {
  const supabase =
    await createSupabaseServerClient()

  // Try exact match first
  const { data: exact } = await supabase
    .from('travel_requirements')
    .select('*')
    .eq('from_country', fromCountry)
    .eq('to_country', toCountry)
    .eq('is_active', true)
    .maybeSingle()

  if (exact) return exact

  // Fall back to Global → destination
  const { data: global } = await supabase
    .from('travel_requirements')
    .select('*')
    .eq('from_country', 'Global')
    .eq('to_country', toCountry)
    .eq('is_active', true)
    .maybeSingle()

  return global || null
}

export async function getTravelRequirementsForCountries(
  fromCountry: string,
  toCountries: string[]
) {
  const results: Record<string, any> = {}

  for (const toCountry of toCountries) {
    const req = await getTravelRequirements(
      fromCountry,
      toCountry
    )
    if (req) {
      results[toCountry] = req
    }
  }

  return results
}