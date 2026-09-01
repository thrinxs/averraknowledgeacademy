import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Clock } from 'lucide-react'
import EnrollmentDetailClient from '@/app/admin/dashboard/academy/EnrollmentDetailClient'

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

const FORMAT_MAP: Record<string, string> = {
  private: 'Private (1-on-1)',
  small_class: 'Small Class (2-5)',
  classroom: 'Classroom (up to 20)',
}

const BILLING_MAP: Record<string, string> = {
  '2_weeks': '2 Weeks', '1_month': '1 Month',
  '2_months': '2 Months', '3_months': '3 Months',
  '6_months': '6 Months', '12_months': '12 Months',
}

export default async function ManageEnrollmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = getAdminClient()

  const { data: enrollment } = await supabase
    .from('academy_enrollments')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!enrollment) notFound()

  const { data: parent } = await supabase
    .from('profiles')
    .select('full_name, email, phone, whatsapp, country')
    .eq('id', enrollment.parent_id)
    .maybeSingle()

  const { data: children } = await supabase
    .from('academy_children')
    .select('*')
    .eq('enrollment_id', enrollment.id)

  // Derive class type from first child's learning_format
  const classType = children?.[0]?.learning_format || 'private'
  const scheduleNotes = enrollment.notes || ''

  // Fetch all trainers for assignment dropdown
  const { data: trainers } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'trainer')
    .order('full_name')

  return (
    <div className="p-6 md:p-10">

      <Link
        href="/admin/dashboard/academy"
        className="inline-flex items-center gap-2
        text-sm text-gray-500 hover:text-[#062850]
        transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Enrollments
      </Link>

      <div className="flex items-center
      justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: '#062850' }}
          >
            Manage Enrollment
          </h1>
          <p className="text-gray-500 text-sm">
            {parent?.full_name} — Enrolled{' '}
            {new Date(enrollment.created_at)
              .toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
          </p>
        </div>
        <span
          className="px-4 py-2 rounded-full
          text-sm font-bold"
          style={{
            backgroundColor:
              enrollment.payment_status === 'paid'
                ? '#F0FDF4' : '#FEF3C7',
            color:
              enrollment.payment_status === 'paid'
                ? '#16A34A' : '#D97706',
          }}
        >
          {enrollment.payment_status === 'paid'
            ? '✅ Paid'
            : '⏳ Awaiting Payment'}
        </span>
      </div>

      <div className="grid grid-cols-1
      md:grid-cols-2 gap-6 mb-6">

        {/* Parent Details */}
        <div className="bg-white rounded-2xl
        border border-gray-100 p-6">
          <h2
            className="font-bold text-lg mb-4"
            style={{ color: '#062850' }}
          >
            Parent / Guardian
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">
                Full Name
              </p>
              <p
                className="font-semibold text-sm"
                style={{ color: '#062850' }}
              >
                {parent?.full_name}
              </p>
            </div>
            <a
              href={`mailto:${parent?.email}`}
              className="flex items-center gap-2
              text-sm font-semibold hover:opacity-80"
              style={{ color: '#497296' }}
            >
              <Mail className="w-4 h-4" />
              {parent?.email}
            </a>
            <a
              href={`tel:${parent?.phone}`}
              className="flex items-center gap-2
              text-sm font-semibold hover:opacity-80"
              style={{ color: '#497296' }}
            >
              <Phone className="w-4 h-4" />
              {parent?.phone}
            </a>
            {parent?.whatsapp && (
              <a
                href={`https://wa.me/${
                  (parent.whatsapp || '').replace(/\D/g, '')
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center
                justify-center gap-2 px-4 py-2.5
                rounded-xl text-sm font-bold
                text-white w-full
                transition-all hover:opacity-90"
                style={{ backgroundColor: '#16A34A' }}
              >
                💬 WhatsApp Parent
              </a>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl
        border border-gray-100 p-6">
          <h2
            className="font-bold text-lg mb-4"
            style={{ color: '#062850' }}
          >
            Payment Details
          </h2>
          <div className="space-y-2 mb-5">
            {[
              {
                label: 'Total Amount',
                value: `£${Number(
                  enrollment.billing_amount || 0
                ).toLocaleString()}`,
              },
              {
                label: 'Billing Period',
                value: BILLING_MAP[
                  enrollment.billing_period
                ] || enrollment.billing_period,
              },
              {
                label: 'Registration Fee',
                value: `£${enrollment.registration_fee || 25}`,
              },
              {
                label: 'Applicant Type',
                value: enrollment.applicant_type === 'student'
                  ? '🎓 Student'
                  : '👨‍👩‍👧 Parent/Guardian',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between
                py-2 border-b border-gray-50
                last:border-0"
              >
                <span className="text-xs text-gray-500">
                  {item.label}
                </span>
                <span
                  className="font-semibold text-sm"
                  style={{ color: '#062850' }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <EnrollmentDetailClient
            enrollmentId={enrollment.id}
            billingAmount={Number(enrollment.billing_amount || 0)}
            currency={enrollment.currency || 'GBP'}
            parentEmail={parent?.email || ''}
            isPaid={enrollment.payment_status === 'paid'}
            trainers={trainers || []}
            classType={classType}
            scheduleNotes={scheduleNotes}
            children={(children || []).map(c => ({
              id: c.id,
              full_name: c.full_name,
              year_group_label: c.year_group_label || '',
              subjects: c.subjects || [],
              assigned_trainer_id: c.assigned_trainer_id || null,
              assigned_trainer_name: c.assigned_trainer_name || null,
              timezone: c.timezone || null,
              timetable: c.timetable || null,
              timetable_confirmed: c.timetable_confirmed || false,
            }))}
          />
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl
        border border-gray-100 p-6">
          <h2
            className="font-bold text-lg mb-4"
            style={{ color: '#062850' }}
          >
            Schedule Preferences
          </h2>
          {enrollment.notes ? (
            <div
              className="p-4 rounded-xl text-sm
              text-gray-600 leading-relaxed"
              style={{ backgroundColor: '#F0F6FB' }}
            >
              {enrollment.notes}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              No schedule notes recorded.
            </p>
          )}
        </div>

        {/* Optional Parent */}
        {enrollment.optional_parent_email && (
          <div className="bg-white rounded-2xl
          border border-gray-100 p-6">
            <h2
              className="font-bold text-lg mb-4"
              style={{ color: '#062850' }}
            >
              Linked Parent / Guardian
            </h2>
            <div className="space-y-2">
              {[
                {
                  label: 'Name',
                  value: enrollment.optional_parent_name,
                },
                {
                  label: 'Email',
                  value: enrollment.optional_parent_email,
                },
                {
                  label: 'Phone',
                  value: enrollment.optional_parent_phone,
                },
                {
                  label: 'Relationship',
                  value: enrollment.optional_parent_relationship,
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-500">
                    {item.label}
                  </p>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: '#062850' }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Learners */}
      <div className="bg-white rounded-2xl
      border border-gray-100 p-6">
        <h2
          className="font-bold text-lg mb-5"
          style={{ color: '#062850' }}
        >
          Learners ({(children || []).length})
        </h2>
        <div className="grid grid-cols-1
        md:grid-cols-2 gap-4">
          {(children || []).map((child) => (
            <div
              key={child.id}
              className="rounded-2xl border
              border-gray-100 overflow-hidden"
            >
              <div
                className="px-5 py-3 flex items-center
                justify-between"
                style={{ backgroundColor: '#062850' }}
              >
                <span className="font-bold text-white
                text-sm">
                  {child.full_name}
                </span>
                <span
                  className="text-xs px-2 py-0.5
                  rounded-full font-medium text-white"
                  style={{
                    backgroundColor:
                      child.status === 'active'
                        ? '#16A34A'
                        : '#D97706',
                  }}
                >
                  {child.status === 'active'
                    ? 'Active'
                    : 'Pending'}
                </span>
              </div>
              <div className="p-5 space-y-2">
                {[
                  {
                    label: 'Year Group',
                    value: child.year_group_label,
                  },
                  {
                    label: 'Country',
                    value: child.country_code,
                  },
                  {
                    label: 'Format',
                    value: FORMAT_MAP[child.learning_format]
                      || child.learning_format,
                  },
                  {
                    label: 'Lesson Duration',
                    value: `${child.lesson_duration}hr`,
                  },
                  {
                    label: 'Lessons/week per subject',
                    value: child.lessons_per_week,
                  },
                  {
                    label: 'Monthly Fee',
                    value: `£${Number(
                      child.monthly_fee || 0
                    ).toLocaleString()}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between
                    text-xs pb-2 border-b
                    border-gray-50 last:border-0"
                  >
                    <span className="text-gray-500">
                      {item.label}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: '#062850' }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}

                <div className="pt-2">
                  <p className="text-xs text-gray-500
                  mb-2">
                    Subjects:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(child.subjects as string[]).map(
                      (code) => (
                        <span
                          key={code}
                          className="text-xs px-2
                          py-0.5 rounded-full
                          text-white font-medium"
                          style={{
                            backgroundColor: '#497296',
                          }}
                        >
                          {SUBJECT_MAP[code] || code}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  {child.timetable ? (
                    <div
                      className="p-3 rounded-xl
                      text-xs text-green-700 bg-green-50"
                    >
                      ✅ Timetable confirmed
                    </div>
                  ) : (
                    <div
                      className="p-3 rounded-xl
                      text-xs text-amber-700 bg-amber-50"
                    >
                      <Clock className="inline w-3 h-3
                      mr-1" />
                      Timetable not yet confirmed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}