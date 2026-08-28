'use client'

import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
import Link from 'next/link'
import {
  CheckCircle,
  Clock,
  XCircle,
  School,
  Users,
  Phone,
  Mail,
} from 'lucide-react'

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

export default async function AdminAcademyPage() {
  const supabase = getAdminClient()

  const { data: enrollments } = await supabase
    .from('academy_enrollments')
    .select(`
      id,
      billing_amount,
      billing_currency,
      billing_period,
      payment_status,
      registration_fee,
      status,
      notes,
      created_at,
      profiles (
        id,
        full_name,
        email,
        phone,
        whatsapp,
        country
      )
    `)
    .order('created_at', { ascending: false })

  const { data: children } = await supabase
    .from('academy_children')
    .select(`
      id,
      full_name,
      year_group_label,
      country_code,
      subjects,
      learning_format,
      monthly_fee,
      status,
      enrollment_id,
      timetable
    `)

  // Group children by enrollment_id
  const childrenByEnrollment: Record<
    string,
    typeof children
  > = {}
  ;(children || []).forEach((child) => {
    if (!childrenByEnrollment[child.enrollment_id]) {
      childrenByEnrollment[child.enrollment_id] = []
    }
    childrenByEnrollment[child.enrollment_id]!.push(
      child
    )
  })

  const statusColors: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    unpaid: {
      bg: '#FEF2F2',
      text: '#DC2626',
      label: 'Awaiting Payment',
    },
    pending: {
      bg: '#FEF3C7',
      text: '#D97706',
      label: 'Pending',
    },
    paid: {
      bg: '#F0FDF4',
      text: '#16A34A',
      label: 'Paid ✓',
    },
    failed: {
      bg: '#FEF2F2',
      text: '#DC2626',
      label: 'Failed',
    },
  }

  const formatMap: Record<string, string> = {
    private: '👤 Private',
    small_class: '👥 Small Class',
    classroom: '🏛️ Classroom',
  }

  const billingPeriodMap: Record<string, string> = {
    monthly: 'Monthly',
    termly: 'Termly (3 Months)',
    annually: 'Annually (12 Months)',
    '2_weeks': '2 Weeks',
    '1_month': '1 Month',
    '2_months': '2 Months',
    '3_months': '3 Months',
    '6_months': '6 Months',
    '12_months': '12 Months',
  }

  const totalEnrollments = enrollments?.length || 0
  const paidEnrollments = enrollments?.filter(
    (e) => e.payment_status === 'paid'
  ).length || 0
  const unpaidEnrollments = enrollments?.filter(
    (e) => e.payment_status === 'unpaid'
  ).length || 0

  return (
    <div className="p-6 md:p-10">

      {/* Header */}
      <div className="flex items-center
      justify-between mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl
            font-bold mb-2"
            style={{ color: '#062850' }}
          >
            🏛️ Academy Enrollments
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all academy enrollments,
            confirm payments and set timetables.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Enrollments',
            value: totalEnrollments,
            color: '#062850',
            bg: '#F0F6FB',
          },
          {
            label: 'Active (Paid)',
            value: paidEnrollments,
            color: '#16A34A',
            bg: '#F0FDF4',
          },
          {
            label: 'Awaiting Payment',
            value: unpaidEnrollments,
            color: '#DC2626',
            bg: '#FEF2F2',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 border
            border-gray-100"
            style={{ backgroundColor: stat.bg }}
          >
            <p
              className="text-3xl font-bold mb-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-sm text-gray-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Enrollments List */}
      <div className="space-y-6">
        {(enrollments || []).map((enrollment) => {
          const parent = (
            Array.isArray(enrollment.profiles)
              ? enrollment.profiles[0]
              : enrollment.profiles
          ) as { id: string; full_name: string; email: string; phone: string; whatsapp: string; country: string } | null

          const enrollmentChildren =
            childrenByEnrollment[enrollment.id] || []

          const status =
            statusColors[enrollment.payment_status] ||
            statusColors.unpaid

          return (
            <div
              key={enrollment.id}
              className="bg-white rounded-2xl border
              overflow-hidden shadow-sm"
              style={{
                borderColor:
                  enrollment.payment_status === 'unpaid'
                    ? '#FCA5A5'
                    : '#E5E7EB',
              }}
            >
              {/* Enrollment Header */}
              <div
                className="px-6 py-4 flex items-center
                justify-between border-b border-gray-100"
                style={{
                  backgroundColor:
                    enrollment.payment_status === 'paid'
                      ? '#F0FDF4'
                      : '#FFFBEB',
                }}
              >
                <div className="flex items-center gap-3">
                  {enrollment.payment_status === 'paid'
                    ? <CheckCircle
                        className="w-5 h-5 text-green-500"
                      />
                    : enrollment.payment_status ===
                      'unpaid'
                    ? <Clock
                        className="w-5 h-5 text-amber-500"
                      />
                    : <XCircle
                        className="w-5 h-5 text-red-500"
                      />
                  }
                  <div>
                    <p
                      className="font-bold"
                      style={{ color: '#062850' }}
                    >
                      {parent?.full_name || 'Parent'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Enrolled:{' '}
                      {new Date(
                        enrollment.created_at
                      ).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs px-3 py-1.5
                    rounded-full font-semibold"
                    style={{
                      backgroundColor: status.bg,
                      color: status.text,
                    }}
                  >
                    {status.label}
                  </span>
                  <div className="text-right">
                    <p
                      className="font-bold text-lg"
                      style={{ color: '#062850' }}
                    >
                      £{Number(
                        enrollment.billing_amount || 0
                      ).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {billingPeriodMap[
                        enrollment.billing_period
                      ] || enrollment.billing_period}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1
                md:grid-cols-2 gap-6">

                  {/* Parent Contact */}
                  <div>
                    <p
                      className="text-xs font-bold
                      uppercase tracking-wide mb-3"
                      style={{ color: '#497296' }}
                    >
                      Parent / Guardian
                    </p>
                    <div className="space-y-2">
                      <a
                        href={`mailto:${parent?.email}`}
                        className="flex items-center
                        gap-2 text-sm text-gray-600
                        hover:text-[#062850]"
                      >
                        <Mail
                          className="w-4 h-4"
                          style={{ color: '#497296' }}
                        />
                        {parent?.email}
                      </a>
                      <a
                        href={`tel:${parent?.phone}`}
                        className="flex items-center
                        gap-2 text-sm text-gray-600
                        hover:text-[#062850]"
                      >
                        <Phone
                          className="w-4 h-4"
                          style={{ color: '#497296' }}
                        />
                        {parent?.phone}
                      </a>
                      {parent?.whatsapp && (
                        <a
                          href={`https://wa.me/${parent.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center
                          gap-2 text-sm text-green-600
                          hover:text-green-800"
                        >
                          💬 WhatsApp:{' '}
                          {parent.whatsapp}
                        </a>
                      )}
                    </div>

                    {/* Schedule Notes */}
                    {enrollment.notes && (
                      <div
                        className="mt-4 p-3 rounded-xl
                        text-xs text-gray-600"
                        style={{
                          backgroundColor: '#F0F6FB',
                        }}
                      >
                        <p className="font-semibold
                        mb-1"
                        style={{ color: '#062850' }}>
                          Schedule Preferences:
                        </p>
                        {enrollment.notes}
                      </div>
                    )}
                  </div>

                  {/* Children */}
                  <div>
                    <p
                      className="text-xs font-bold
                      uppercase tracking-wide mb-3"
                      style={{ color: '#497296' }}
                    >
                      <Users
                        className="inline w-3 h-3
                        mr-1"
                      />
                      Children (
                      {enrollmentChildren.length})
                    </p>
                    <div className="space-y-3">
                      {enrollmentChildren.map(
                        (child) => (
                          <div
                            key={child.id}
                            className="p-3 rounded-xl
                            border border-gray-100"
                            style={{
                              backgroundColor:
                                '#F8FAFC',
                            }}
                          >
                            <div className="flex
                            items-center justify-between
                            mb-1">
                              <p
                                className="font-semibold
                                text-sm"
                                style={{
                                  color: '#062850',
                                }}
                              >
                                {child.full_name}
                              </p>
                              <span
                                className="text-xs
                                font-medium px-2 py-0.5
                                rounded-full"
                                style={{
                                  backgroundColor:
                                    '#EBF4FF',
                                  color: '#497296',
                                }}
                              >
                                {child.year_group_label}
                              </span>
                            </div>
                            <p className="text-xs
                            text-gray-500 mb-1">
                              {formatMap[
                                child.learning_format
                              ] ||
                                child.learning_format}{' '}
                              •{' '}
                              {child.country_code}
                            </p>
                            <p className="text-xs
                            text-gray-500">
                              Subjects:{' '}
                              {(
                                child.subjects as string[]
                              ).join(', ')}
                            </p>
                            <p
                              className="text-xs
                              font-semibold mt-1"
                              style={{
                                color: '#062850',
                              }}
                            >
                              £{Number(
                                child.monthly_fee || 0
                              ).toLocaleString()}
                              /month
                            </p>

                            {/* Timetable Status */}
                            {child.timetable ? (
                              <div
                                className="mt-2 p-2
                                rounded-lg text-xs
                                text-green-700
                                bg-green-50"
                              >
                                ✅ Timetable confirmed
                              </div>
                            ) : (
                              <div
                                className="mt-2 p-2
                                rounded-lg text-xs
                                text-amber-700
                                bg-amber-50"
                              >
                                ⏳ Timetable pending
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className="mt-4 pt-4 border-t
                  border-gray-100 flex flex-wrap gap-3"
                >
                  {enrollment.payment_status ===
                    'unpaid' && (
                    <ConfirmPaymentButton
                      enrollmentId={enrollment.id}
                      billingAmount={Number(enrollment.billing_amount || 0)}
                      currency={enrollment.billing_currency || 'GBP'}
                      parentEmail={
                        (Array.isArray(enrollment.profiles)
                          ? enrollment.profiles[0]
                          : enrollment.profiles
                        )?.email || ''
                      }
                    />
                  )}

                  <a
                    href={`mailto:${parent?.email}?subject=Averra Academy — Your Enrollment&body=Dear ${parent?.full_name},%0D%0A%0D%0AThank you for enrolling with Averra Academy.`}
                    className="flex items-center gap-2
                    px-4 py-2 rounded-xl text-sm
                    font-semibold transition-all
                    hover:opacity-90 border
                    border-gray-200 text-gray-600
                    hover:text-[#062850]"
                  >
                    <Mail className="w-4 h-4" />
                    Email Parent
                  </a>

                  <a
                    href={`https://wa.me/${(parent?.whatsapp || parent?.phone || '').replace(/\D/g, '')}?text=Hello ${parent?.full_name}, thank you for enrolling with Averra Academy.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2
                    px-4 py-2 rounded-xl text-sm
                    font-semibold text-white
                    transition-all hover:opacity-90"
                    style={{ backgroundColor: '#16A34A' }}
                  >
                    💬 WhatsApp Parent
                  </a>

                  <Link
                    href={`/admin/dashboard/academy/${enrollment.id}`}
                    className="flex items-center gap-2
                    px-4 py-2 rounded-xl text-sm
                    font-semibold text-white
                    transition-all hover:opacity-90"
                    style={{ backgroundColor: '#062850' }}
                  >
                    <School className="w-4 h-4" />
                    Manage Enrollment
                  </Link>
                </div>
              </div>
            </div>
          )
        })}

        {(!enrollments || enrollments.length === 0) && (
          <div className="text-center py-16 bg-white
          rounded-2xl border border-gray-100">
            <School
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: '#497296' }}
            />
            <p
              className="text-lg font-bold mb-2"
              style={{ color: '#062850' }}
            >
              No Academy Enrollments Yet
            </p>
            <p className="text-gray-500 text-sm">
              Enrollments will appear here once parents
              complete the academy enrollment form.
            </p>
            <Link
              href="/academy/enroll"
              className="inline-block mt-4 px-6 py-2
              rounded-xl text-sm font-semibold
              text-white"
              style={{ backgroundColor: '#062850' }}
            >
              View Enrollment Page →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
