import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
import ScholarshipManagement from
  '@/components/admin/ScholarshipManagement'

export default async function ScholarshipsPage() {
  const supabase = getAdminClient()

  const { data: scholarships } = await supabase
    .from('scholarships')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <ScholarshipManagement
        scholarships={scholarships || []}
      />
    </div>
  )
}