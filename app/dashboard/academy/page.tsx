import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import {
  School,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const SUBJECT_MAP: Record<string, string> = {
  ENG: 'English Language', MATH: 'Mathematics',
  SCI: 'Science', COMP: 'Computing',
  HIST: 'History', GEO: 'Geography',
  ART: 'Creative Arts', MUS: 'Music',
  PE: 'Physical Education',
  NHC: 'Nigerian History & Culture',
  REL: 'Religious Studies', BTECH: 'Basic Technology',
  BIO: 'Biology', CHEM: 'Chemistry',
  PHY: 'Physics', ECON: 'Economics',
  GOV: 'Government / Politics',
  ENGLIT: 'English Literature',
}

const billingPeriodMap: Record<string, string> = {
  monthly: 'Monthly',
  termly: 'Termly (3 Months)',
  annually: 'Annually (12 Months)',
  '1_month': '1 Month',
  '2_months': '2 Months',
  '3_months': '3 Months',
  '6_months': '6 Months',
  '12_months': '12 Months',
  '2_weeks': '2 Weeks',
}

const classTypeMap: Record<string, string> = {
  private: '👤 Private (1-on-1)',
  general: '👥 General Class',
}

export default async function StudentAcademyPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>
}) {
  const { payment } = await searchParams

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = getAdminClient()

  // Get enrollment
  const { data: enrollment } = await admin
    .from('academy_enrollments')
    .select('*')
    .eq('parent_id', user.id)
    .maybeSingle()

  // Get children via enrollment_id
  const { data: children } = enrollment
    ? await admin
        .from('academy_children')
        .select('*')
        .eq('enrollment_id', enrollment.id)
    : { data: [] }

  // Get assessments
  const { data: assessments } = enrollment
    ? await admin
        .from('assessments')
        .select('*, academy_children(year_group_code)')
        .eq('enrollment_id', enrollment.id)
    : { data: [] }

  // Helper to determine if an assessment is for a primary learner
  const PRIMARY_YEARS = ['Y1','Y2','Y3','Y4','Y5','Y6','P1','P2','P3','P4','P5','P6','Year 1','Year 2','Year 3','Year 4','Year 5','Year 6']
  function isPrimaryAssessment(assessment: { academy_children?: { year_group_code: string } | { year_group_code: string }[] | null }) {
    const child = Array.isArray(assessment.academy_children)
      ? assessment.academy_children[0]
      : assessment.academy_children
    return PRIMARY_YEARS.includes(child?.year_group_code || '')
  }
  function getAssessmentUrl(assessment: { id: string; academy_children?: { year_group_code: string } | { year_group_code: string }[] | null }) {
    if (isPrimaryAssessment(assessment)) {
      return '/dashboard/academy/assessment/primary?assessment_id=' + assessment.id
    }
    return '/dashboard/academy/assessment?assessment_id=' + assessment.id
  }

  const pendingAssessments = (assessments || []).filter(
    (a) => a.status === 'pending' || a.status === 'in_progress'
  )
  const completedAssessments = (assessments || []).filter(
    (a) => a.status === 'completed' || a.status === 'expired'
  )

  const currency = enrollment?.currency || 'GBP'
  const currencySymbol = currency === 'NGN' ? '₦' : '£'

  const paymentParams = enrollment
    ? new URLSearchParams({
        enrollment_id: enrollment.id,
        currency: enrollment.currency || 'GBP',
        amount: String(enrollment.billing_amount || 0),
      }).toString()
    : ''

  return (
    <div className="p-6 md:p-10">

      {/* Payment result banners */}
      {payment === 'success' && (
        <div className="mb-6 rounded-2xl p-5 bg-green-50 border-2 border-green-200 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800">Payment Confirmed!</p>
            <p className="text-green-700 text-sm">Your enrolment is now active. We will contact you within 24 hours.</p>
          </div>
        </div>
      )}
      {payment === 'failed' && (
        <div className="mb-6 rounded-2xl p-5 bg-red-50 border-2 border-red-200 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-red-800">Payment Failed</p>
            <p className="text-red-700 text-sm">Your payment was not completed. Please try again below.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          🏛️ My Academy Enrolment
        </h1>
        <p className="text-gray-500 text-sm">
          Track your enrolment status, learner profiles and class schedule.
        </p>
      </div>

      {/* No Enrollment */}
      {!enrollment && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <School className="w-16 h-16 mx-auto mb-4" style={{ color: '#497296' }} />
          <h2 className="text-xl font-bold mb-3" style={{ color: '#062850' }}>
            No Academy Enrolment Found
          </h2>
          <p className="text-gray-500 mb-6">
            You have not enrolled in Averra Academy yet. Click below to explore the programme.
          </p>
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: '#062850' }}
          >
            Explore Averra Academy
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Enrollment Found */}
      {enrollment && (
        <div className="space-y-6">

          {/* Payment Pending Banner */}
          {enrollment.payment_status !== 'paid' && (
            <div
              className="rounded-2xl p-6 border-2 border-amber-200"
              style={{ backgroundColor: '#FFFBEB' }}
            >
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 flex-shrink-0 text-amber-500" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 text-amber-800">
                    Payment Pending
                  </h3>
                  <p className="text-amber-700 text-sm mb-4">
                    Your enrolment is registered but payment has not yet been confirmed.
                    Choose your preferred payment method to activate your account.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/academy/enroll/payment?${paymentParams}`}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#497296' }}
                    >
                      💳 Pay Now →
                    </Link>
                    <a
                      href="https://wa.me/2349033440966"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#16A34A' }}
                    >
                      💬 Send Payment Proof
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Banner */}
          {enrollment.payment_status === 'paid' && pendingAssessments.length > 0 && (
            <div className="rounded-2xl p-6 border-2 border-blue-200" style={{ backgroundColor: '#EBF4FF' }}>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-xl">📝</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 text-blue-800">Baseline Assessment Ready</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Your payment has been confirmed. Before classes begin, your learner needs to complete a short baseline assessment so we can teach at the right level.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {pendingAssessments.map((assessment: { id: string; academy_children?: { year_group_code: string } | { year_group_code: string }[] | null }) => (
                      <a key={assessment.id}
                        href={getAssessmentUrl(assessment)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: '#497296' }}>
                        📝 Start Assessment
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {enrollment.payment_status === 'paid' && pendingAssessments.length === 0 && completedAssessments.length > 0 && (
            <div className="rounded-2xl p-6 border-2 border-green-200" style={{ backgroundColor: '#F0FDF4' }}>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 flex-shrink-0 text-green-500" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 text-green-800">Assessment Complete ✅</h3>
                  <p className="text-green-700 text-sm mb-4">
                    Great work! Our team will confirm your timetable within 24 hours and classes will begin soon.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {completedAssessments.map((assessment: { id: string; academy_children?: { year_group_code: string } | { year_group_code: string }[] | null }) => (
                      <a key={assessment.id}
                        href={'/dashboard/academy/assessment/results?assessment_id=' + assessment.id}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: '#16A34A' }}>
                        View Results
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {enrollment.payment_status === 'paid' && (assessments || []).length === 0 && (
            <div className="rounded-2xl p-6 border-2 border-green-200" style={{ backgroundColor: '#F0FDF4' }}>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 flex-shrink-0 text-green-500" />
                <div>
                  <h3 className="font-bold text-lg mb-1 text-green-800">Enrolment Active ✅</h3>
                  <p className="text-green-700 text-sm">Your payment has been confirmed. Our team will contact you within 24 hours to confirm your timetable.</p>
                </div>
              </div>
            </div>
          )}

          {/* Enrollment Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>
              Enrolment Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Amount',
                  value: `${currencySymbol}${Number(enrollment.billing_amount || 0).toLocaleString()}`,
                },
                {
                  label: 'Billing Period',
                  value: billingPeriodMap[enrollment.billing_period] || enrollment.billing_period,
                },
                {
                  label: 'Class Type',
                  value: classTypeMap[enrollment.class_type] || enrollment.class_type,
                },
                {
                  label: 'Payment Status',
                  value: enrollment.payment_status === 'paid' ? '✅ Confirmed' : '⏳ Pending',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: '#F0F6FB' }}
                >
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="font-bold text-sm" style={{ color: '#062850' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Children Profiles */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>
              Learners Enrolled ({(children || []).length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(children || []).map((child) => (
                <div key={child.id} className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div
                    className="px-5 py-3 flex items-center justify-between"
                    style={{ backgroundColor: '#062850' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👦</span>
                      <span className="font-bold text-white text-sm">{child.full_name}</span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                      style={{ backgroundColor: child.status === 'active' ? '#16A34A' : '#D97706' }}
                    >
                      {child.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Year Group</span>
                      <span className="font-medium" style={{ color: '#062850' }}>
                        {child.year_group_label}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Class Type</span>
                      <span className="font-medium" style={{ color: '#062850' }}>
                        {classTypeMap[child.learning_format] || child.learning_format}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly Fee</span>
                      <span className="font-bold" style={{ color: '#062850' }}>
                        {currencySymbol}{Number(child.monthly_fee || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Subjects */}
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-2">Subjects:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(child.subjects as string[]).map((code) => (
                          <span
                            key={code}
                            className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                            style={{ backgroundColor: '#497296' }}
                          >
                            {SUBJECT_MAP[code] || code}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Timetable */}
                    <div className="pt-2">
                      {child.timetable ? (
                        <div className="p-3 rounded-xl text-xs text-green-700 bg-green-50 border border-green-100">
                          <p className="font-semibold mb-2">✅ Timetable Confirmed</p>
                          {(() => {
                            try {
                              const rows = typeof child.timetable === 'string'
                                ? JSON.parse(child.timetable)
                                : child.timetable
                              if (Array.isArray(rows)) {
                                return (
                                  <div className="space-y-2">
                                    {rows.map((row: { day: string; time: string; subject: string; meet_link?: string }, i: number) => (
                                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-green-100">
                                        <div>
                                          <p className="font-semibold text-green-800">{row.day} — {row.time}</p>
                                          <p className="text-green-600">{row.subject}</p>
                                        </div>
                                        {row.meet_link && (
                                          <a href={row.meet_link} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-white text-xs font-semibold flex-shrink-0"
                                            style={{ backgroundColor: '#1A73E8' }}>
                                            Join Class
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )
                              }
                              return <p>{String(child.timetable)}</p>
                            } catch {
                              return <p>{String(child.timetable)}</p>
                            }
                          })()}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl text-xs text-amber-700 bg-amber-50 border border-amber-100">
                          <AlertCircle className="inline w-3 h-3 mr-1" />
                          Timetable being confirmed — our team will contact you within 24 hours.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#062850' }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-bold text-white text-lg mb-1">Need Help?</p>
                <p className="text-blue-300 text-sm">
                  Our team is available to help with your timetable, payments or any academy questions.
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/2349033440966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#16A34A' }}
                >
                  💬 WhatsApp Us
                </a>
                <a
                  href="mailto:info@averraknowledgeacademy.com"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/20 transition-all hover:bg-white/10"
                >
                  📧 Email Us
                </a>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
