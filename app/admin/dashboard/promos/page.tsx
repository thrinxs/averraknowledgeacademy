import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import PromoManagement from
  '@/components/admin/PromoManagement'

export default async function PromosPage() {
  const supabase =
    await createSupabaseServerClient()

  const { data: promos } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PromoManagement promos={promos || []} />
    </div>
  )
}