import { createClient } from '@supabase/supabase-js'
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export default async function AdminClassworkPage() {
  const admin = getAdminClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: classworks } = await admin
    .from('classwork')
    .select('*, academy_children(full_name, year_group_label)')
    .eq('assigned_date', today)
    .order('created_at', { ascending: false })

  const submitted = (classworks || []).filter(c => c.status === 'submitted')
  const avgScore = submitted.length > 0
    ? Math.round(submitted.reduce((sum, c) => sum + ((c.score || 0) / (c.max_score || 1)) * 100, 0) / submitted.length)
    : 0

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Classwork Overview
        </h1>
        <p className="text-gray-500 text-sm">
          Today: {new Date(today).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Assigned', value: classworks?.length || 0, icon: BookOpen, color: '#497296' },
          { label: 'Submitted', value: submitted.length, icon: CheckCircle, color: '#16A34A' },
          { label: 'Pending', value: (classworks?.length || 0) - submitted.length, icon: Clock, color: '#F59E0B' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: '#062850' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#062850' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg" style={{ color: '#062850' }}>All Classwork Today</h2>
        </div>
        {(!classworks || classworks.length === 0) ? (
          <div className="p-12 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p className="text-gray-500">No classwork assigned today yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {classworks.map(cw => {
              const child = Array.isArray(cw.academy_children)
                ? cw.academy_children[0]
                : cw.academy_children as { full_name: string; year_group_label: string } | null
              const pct = cw.max_score > 0 ? Math.round(((cw.score || 0) / cw.max_score) * 100) : null

              return (
                <div key={cw.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>
                      {child?.full_name || 'Student'}
                    </p>
                    <p className="text-xs text-gray-500">{cw.subject_code} — {cw.topic_name}</p>
                    <p className="text-xs text-gray-400">{child?.year_group_label}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {pct !== null && (
                      <p className="text-sm font-bold" style={{ color: '#062850' }}>{pct}%</p>
                    )}
                    <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                      style={{
                        backgroundColor: cw.status === 'submitted' ? '#F0FDF4' : '#FFF8F0',
                        color: cw.status === 'submitted' ? '#16A34A' : '#F59E0B',
                      }}>
                      {cw.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
