import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { User, BookOpen, ArrowRight } from 'lucide-react'

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

export default async function TrainerStudentsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/staff-login')

  const admin = getAdminClient()
  const { data: profile } = await admin.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (!profile || profile.role !== 'trainer') redirect('/auth/staff-login')

  // Get all children assigned to this trainer
  const { data: children } = await admin
    .from('academy_children')
    .select('*, academy_enrollments(parent_id, payment_status, billing_amount, currency, profiles(full_name, email, phone))')
    .eq('assigned_trainer_id', user.id)
    .order('full_name')

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          My Students
        </h1>
        <p className="text-gray-500 text-sm">
          {(children || []).length} learner{(children || []).length !== 1 ? 's' : ''} assigned to you.
        </p>
      </div>

      {(!children || children.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <User className="w-12 h-12 mx-auto mb-4" style={{ color: '#497296' }} />
          <p className="text-gray-500 font-medium mb-1">No students assigned yet</p>
          <p className="text-gray-400 text-sm">The admin team will assign learners to you shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((child) => {
            const enrollment = Array.isArray(child.academy_enrollments)
              ? child.academy_enrollments[0]
              : child.academy_enrollments as {
                  parent_id: string
                  payment_status: string
                  billing_amount: number
                  currency: string
                  profiles: { full_name: string; email: string; phone: string } | { full_name: string; email: string; phone: string }[]
                } | null

            const parent = enrollment ? (
              Array.isArray(enrollment.profiles)
                ? enrollment.profiles[0]
                : enrollment.profiles
            ) : null

            const symbol = enrollment?.currency === 'NGN' ? '\u20a6' : '\u00a3'

            return (
              <div key={child.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between"
                  style={{ backgroundColor: '#062850' }}>
                  <div>
                    <p className="font-bold text-white">{child.full_name}</p>
                    <p className="text-blue-300 text-xs mt-0.5">{child.year_group_label}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium text-white"
                    style={{ backgroundColor: child.status === 'active' ? '#16A34A' : '#F59E0B' }}>
                    {child.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  {/* Parent info */}
                  {parent && (
                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
                      <p className="text-xs text-gray-500 mb-1">Parent / Guardian</p>
                      <p className="text-sm font-semibold" style={{ color: '#062850' }}>{(parent as { full_name: string }).full_name}</p>
                      <p className="text-xs text-gray-500">{(parent as { email: string }).email}</p>
                      {(parent as { phone?: string }).phone && (
                        <a href={`https://wa.me/${((parent as { phone: string }).phone).replace(/\D/g, '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-green-600 font-medium mt-1 inline-block">
                          💬 WhatsApp Parent
                        </a>
                      )}
                    </div>
                  )}

                  {/* Subjects */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Subjects
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(child.subjects as string[]).map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                          style={{ backgroundColor: '#497296' }}>
                          {SUBJECT_MAP[s] || s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timetable */}
                  {child.timetable && (
                    <div className="rounded-xl overflow-hidden border border-green-100">
                      <div className="px-3 py-2" style={{ backgroundColor: '#F0FDF4' }}>
                        <p className="text-xs font-semibold text-green-700">📅 Class Schedule</p>
                      </div>
                      <div className="p-3 space-y-2">
                        {(() => {
                          try {
                            const rows = typeof child.timetable === 'string'
                              ? JSON.parse(child.timetable)
                              : child.timetable
                            if (!Array.isArray(rows)) return <p className="text-xs text-gray-500">No schedule set</p>
                            return rows.map((row: {
                              type?: string; day?: string; date?: string
                              subject: string; wat_display?: string
                              student_display?: string; start_time?: string
                              end_time?: string; meet_link?: string
                            }, i: number) => (
                              <div key={i} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white border border-green-100">
                                <div className="flex-1">
                                  <p className="text-xs font-bold" style={{ color: '#062850' }}>
                                    {row.type === 'weekly' ? `Every ${row.day}` : row.date}
                                    {' — '}{row.subject === 'ENG' ? 'English Language' : row.subject === 'MATH' ? 'Mathematics' : row.subject}
                                  </p>
                                  {row.wat_display ? (
                                    <>
                                      <p className="text-xs text-orange-700 mt-0.5">🇳🇬 {row.wat_display}</p>
                                      {row.student_display && !row.student_display.includes('+1)') && (
                                        <p className="text-xs text-blue-700 mt-0.5">🌍 {row.student_display}</p>
                                      )}
                                    </>
                                  ) : (
                                    <p className="text-xs text-green-700 mt-0.5">{row.start_time} – {row.end_time}</p>
                                  )}
                                </div>
                                {row.meet_link && (
                                  <a href={row.meet_link} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-white text-xs font-semibold flex-shrink-0"
                                    style={{ backgroundColor: '#1A73E8' }}>
                                    Join
                                  </a>
                                )}
                              </div>
                            ))
                          } catch {
                            return <p className="text-xs text-gray-500">Could not parse schedule</p>
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Fee */}
                  {enrollment && (
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-gray-500">Monthly Fee</span>
                      <span className="text-sm font-bold" style={{ color: '#062850' }}>
                        {symbol}{Number(child.monthly_fee || 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* View assessment link */}
                  <Link
                    href={`/trainer/dashboard/assessments?child_id=${child.id}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group mt-2"
                  >
                    <p className="text-xs font-semibold" style={{ color: '#062850' }}>View Assessment Results</p>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
