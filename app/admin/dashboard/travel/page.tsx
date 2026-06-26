import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import TravelManagement from
  '@/components/admin/TravelManagement'

export default async function TravelPage() {
  const supabase =
    await createSupabaseServerClient()

  const { data: requirements } = await supabase
    .from('travel_requirements')
    .select('*')
    .order('from_country', { ascending: true })

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <TravelManagement
        requirements={requirements || []}
      />
    </div>
  )
}