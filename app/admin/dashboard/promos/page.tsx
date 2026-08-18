import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
import PromoManagement from
  '@/components/admin/PromoManagement'

export default async function PromosPage() {
  const supabase = getAdminClient()

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