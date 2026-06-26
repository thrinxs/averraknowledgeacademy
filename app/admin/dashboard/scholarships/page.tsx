import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import ScholarshipManagement from
  '@/components/admin/ScholarshipManagement'

export default async function ScholarshipsPage() {
  const supabase =
    await createSupabaseServerClient()

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