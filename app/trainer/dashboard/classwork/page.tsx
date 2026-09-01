import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { CheckCircle, Clock, BookOpen, Users } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics', SCI: 'Science',
  COMP: 'Computing', HIST: 'History', GEO: 'Geography',
  ART: 'Creative Arts', MUS: 'Music', PE: 'Physical Education',
  NHC: 'Nigerian History & Culture', REL: 'Religious Studies',
  BTECH: 'Basic Technology', BIO: 'Biology', CHEM: 'Chemistry',
  PHY: 'Physics', ECON: 'Economics', GOV: 'Government / Politics',
  ENGLIT: 'English Literature',
}

export default async function TrainerClassworkPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'trainer') redirect('/auth/staff-login')

  const today = new Date().toISOString().split('T')[0]

  // Get all classwork for trainer's students
  const { data: classworks } = await admin
    .from('classwork')
    .select('*, academy_children(full_name, year_group_label)')
    .eq('trainer_id', user.id)
    .eq('assigned_date', today)
    .order('subject_code')

  const submitted = (classworks || []).filter(c => c.status === 'submitted')
  const pending = (classworks || []).filter(c => c.status === 'pending')

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Classwork Manager
        </h1>
        <p className="text-gray-500 text-sm">
          Today: {new Date(today).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Assigned', value: classworks?.length || 0, icon: BookOpen, color: '#497296' },
          { label: 'Submitted', value: submitted.length, icon: CheckCircle, color: '#16A34A' },
          { label: 'Pending', value: pending.length, icon: Clock, color: '#F59E0B' },
          { label: 'Students', value: new Set((classworks || []).map(c => c.child_id)).size, icon: Users, color: '#062850' },
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

      {/* Classwork list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg" style={{ color: '#062850' }}>
            Today's Classwork
          </h2>
        </div>

        {(!classworks || classworks.length === 0) ? (
          <div className="p-12 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p className="text-gray-500 mb-2">No classwork assigned today</p>
            <p className="text-gray-400 text-sm">
              Classwork is auto-generated when students open their classwork page,
              or you can generate it from the student profile.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(classworks || []).map(cw => {
              const child = Array.isArray(cw.academy_children)
                ? cw.academy_children[0]
                : cw.academy_children as { full_name: string; year_group_label: string } | null
              const percentage = cw.max_score > 0
                ? Math.round(((cw.score || 0) / cw.max_score) * 100)
                : null

              return (
                <div key={cw.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: '#062850' }}>
                      {child?.full_name || 'Student'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {SUBJECT_MAP[cw.subject_code] || cw.subject_code} — {cw.topic_name}
                    </p>
                    <p className="text-xs text-gray-400">{child?.year_group_label}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {cw.status === 'submitted' ? (
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: '#062850' }}>
                          {cw.score}/{cw.max_score}
                        </p>
                        <p className="text-xs text-green-600">{percentage}%</p>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium px-2 py-1 rounded-full bg-amber-50">
                        Pending
                      </span>
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
