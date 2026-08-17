import { createSupabaseServerClient } from
  '@/lib/supabase-server'

export default async function AdminChildrenPage() {
  const supabase = await createSupabaseServerClient()
  const { data: children } = await supabase
    .from('academy_children')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10">
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: '#062850' }}
      >
        Children Profiles ({children?.length || 0})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2
      lg:grid-cols-3 gap-4">
        {(children || []).map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-2xl border
            border-gray-100 p-5"
          >
            <div className="flex items-center
            gap-2 mb-3">
              <span className="text-2xl">👦</span>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: '#062850' }}
                >
                  {child.full_name}
                </p>
                <p className="text-xs text-gray-500">
                  {child.year_group_label} •{' '}
                  {child.country_code}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Subjects: {(child.subjects as string[])
                .join(', ')}
            </p>
            <p className="text-xs font-bold"
            style={{ color: '#062850' }}>
              £{Number(child.monthly_fee || 0)
                .toLocaleString()}/month
            </p>
          </div>
        ))}
        {(!children || children.length === 0) && (
          <div className="col-span-3 text-center
          py-12 text-gray-400">
            No children enrolled yet.
          </div>
        )}
      </div>
    </div>
  )
}