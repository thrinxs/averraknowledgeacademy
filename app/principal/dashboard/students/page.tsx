import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English', MATH: 'Maths', SCI: 'Science', COMP: 'Computing',
}

export default async function PrincipalStudentsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'principal') redirect('/auth/staff-login')

  const { data: children } = await admin
    .from('academy_children')
    .select('*, academy_enrollments(payment_status, billing_amount, currency)')
    .order('full_name')

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>All Students</h1>
        <p className="text-gray-500 text-sm">{(children || []).length} learners enrolled</p>
      </div>

      {(!children || children.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
          <p className="text-gray-500">No students enrolled yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {children.map(child => (
              <div key={child.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{ color: '#062850' }}>{child.full_name}</p>
                  <p className="text-xs text-gray-500">{child.year_group_label}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(child.subjects || []).map((s: string) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: '#497296' }}>
                        {SUBJECT_MAP[s] || s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{child.assigned_trainer_name || 'No tutor'}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: child.status === 'active' ? '#F0FDF4' : '#FFF8F0',
                        color: child.status === 'active' ? '#16A34A' : '#F59E0B',
                      }}>
                      {child.status}
                    </span>
                  </div>
                  <Link href={`/principal/dashboard/results?child_id=${child.id}`}>
                    <ArrowRight className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
