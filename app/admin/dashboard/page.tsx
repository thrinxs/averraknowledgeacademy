import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import {
  Users,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  MessageSquare,
  Tag,
  School,
  BookOpen,
  ArrowRight,
  Trophy,
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  const supabase = await createSupabaseServerClient()

  // ── Scholarship stats ─────────────────────────
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: paidUsers } = await supabase
    .from('scholarship_preferences')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'paid')

  const { data: revenueData } = await supabase
    .from('scholarship_preferences')
    .select('final_price')
    .eq('payment_status', 'paid')

  const scholarshipRevenue = (revenueData || [])
    .reduce(
      (sum, r) => sum + (Number(r.final_price) || 0),
      0
    )

  const { count: totalScholarships } = await supabase
    .from('scholarships')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: totalMatches } = await supabase
    .from('scholarship_matches')
    .select('*', { count: 'exact', head: true })

  const { count: pendingVerifications } = await supabase
    .from('scholarship_matches')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', false)

  // ── Academy stats ─────────────────────────────
  const { count: totalAcademyEnrollments } =
    await supabase
      .from('academy_enrollments')
      .select('*', { count: 'exact', head: true })

  const { count: pendingAcademyPayments } =
    await supabase
      .from('academy_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'unpaid')

  const { count: activeAcademyEnrollments } =
    await supabase
      .from('academy_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'paid')

  const { data: academyRevenueData } = await supabase
    .from('academy_enrollments')
    .select('billing_amount')
    .eq('payment_status', 'paid')

  const academyRevenue = (academyRevenueData || [])
    .reduce(
      (sum, r) =>
        sum + (Number(r.billing_amount) || 0),
      0
    )

  const { count: totalChildren } = await supabase
    .from('academy_children')
    .select('*', { count: 'exact', head: true })

  // ── Other stats ───────────────────────────────
  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .is('receiver_id', null)
    .eq('is_read', false)

  const { count: activePromos } = await supabase
    .from('promo_codes')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // ── Recent data ───────────────────────────────
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentPayments } = await supabase
    .from('scholarship_preferences')
    .select(
      'user_id, selected_package, final_price, payment_status, created_at'
    )
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentAcademyEnrollments } =
    await supabase
      .from('academy_enrollments')
      .select(`
        id,
        billing_amount,
        billing_period,
        payment_status,
        created_at,
        profiles!parent_id (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5)

  return (
    <div className="p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          Admin Overview
        </h1>
        <p className="text-gray-500 text-sm">
          Platform statistics and recent activity
          across all services.
        </p>
      </div>

      {/* ── SCHOLARSHIP SECTION ──────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1 h-6 rounded-full"
            style={{ backgroundColor: '#3B82F6' }}
          />
          <h2
            className="font-bold text-lg"
            style={{ color: '#062850' }}
          >
            🎓 Scholarships
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4
        gap-4">
          {[
            {
              label: 'Total Users',
              value: totalUsers || 0,
              icon: Users,
              color: '#497296',
              href: '/admin/dashboard/users',
            },
            {
              label: 'Paid Applications',
              value: paidUsers || 0,
              icon: CreditCard,
              color: '#16A34A',
              href: '/admin/dashboard/users',
            },
            {
              label: 'Revenue (₦)',
              value: `₦${(scholarshipRevenue || 0).toLocaleString()}`,
              icon: CreditCard,
              color: '#062850',
              href: '/admin/dashboard/users',
            },
            {
              label: 'Active Scholarships',
              value: totalScholarships || 0,
              icon: GraduationCap,
              color: '#325E84',
              href: '/admin/dashboard/scholarships',
            },
            {
              label: 'Total Matches',
              value: totalMatches || 0,
              icon: Trophy,
              color: '#D97706',
              href: '/admin/dashboard/verification',
            },
            {
              label: 'Pending Verification',
              value: pendingVerifications || 0,
              icon: ShieldCheck,
              color: '#DC2626',
              href: '/admin/dashboard/verification',
            },
            {
              label: 'Unread Messages',
              value: unreadMessages || 0,
              icon: MessageSquare,
              color: '#7C3AED',
              href: '/admin/dashboard/messages',
            },
            {
              label: 'Active Promos',
              value: activePromos || 0,
              icon: Tag,
              color: '#0891B2',
              href: '/admin/dashboard/promos',
            },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl p-5
              border border-gray-100 transition-all
              duration-300 hover:shadow-lg
              hover:-translate-y-1 group"
            >
              <div className="flex items-center
              justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl
                  flex items-center justify-center"
                  style={{
                    backgroundColor:
                      `${stat.color}15`,
                  }}
                >
                  <stat.icon
                    className="w-5 h-5"
                    style={{ color: stat.color }}
                  />
                </div>
                <ArrowRight
                  className="w-4 h-4 text-gray-300
                  group-hover:text-gray-500
                  transition-colors"
                />
              </div>
              <p
                className="text-2xl font-bold mb-0.5"
                style={{ color: '#062850' }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── ACADEMY SECTION ──────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center
        justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: '#10B981' }}
            />
            <h2
              className="font-bold text-lg"
              style={{ color: '#062850' }}
            >
              🏛️ Academy
            </h2>
          </div>
          <Link
            href="/admin/dashboard/academy"
            className="text-sm font-medium
            hover:underline"
            style={{ color: '#10B981' }}
          >
            Manage →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4
        gap-4">
          {[
            {
              label: 'Total Enrollments',
              value: totalAcademyEnrollments || 0,
              icon: School,
              color: '#10B981',
              href: '/admin/dashboard/academy',
            },
            {
              label: 'Active (Paid)',
              value: activeAcademyEnrollments || 0,
              icon: BookOpen,
              color: '#16A34A',
              href: '/admin/dashboard/academy',
            },
            {
              label: 'Pending Payment',
              value: pendingAcademyPayments || 0,
              icon: CreditCard,
              color: '#DC2626',
              href: '/admin/dashboard/academy',
            },
            {
              label: 'Total Children',
              value: totalChildren || 0,
              icon: Users,
              color: '#F59E0B',
              href: '/admin/dashboard/academy/children',
            },
            {
              label: 'Revenue (£)',
              value: `£${(academyRevenue || 0).toLocaleString()}`,
              icon: CreditCard,
              color: '#062850',
              href: '/admin/dashboard/academy',
            },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl p-5
              border border-gray-100 transition-all
              duration-300 hover:shadow-lg
              hover:-translate-y-1 group"
            >
              <div className="flex items-center
              justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl
                  flex items-center justify-center"
                  style={{
                    backgroundColor:
                      `${stat.color}15`,
                  }}
                >
                  <stat.icon
                    className="w-5 h-5"
                    style={{ color: stat.color }}
                  />
                </div>
                <ArrowRight
                  className="w-4 h-4 text-gray-300
                  group-hover:text-gray-500
                  transition-colors"
                />
              </div>
              <p
                className="text-2xl font-bold mb-0.5"
                style={{ color: '#062850' }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── RECENT ACTIVITY ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2
      lg:grid-cols-3 gap-6">

        {/* Recent Users */}
        <div className="bg-white rounded-2xl
        border border-gray-100 p-6">
          <div className="flex items-center
          justify-between mb-4">
            <h3
              className="font-bold"
              style={{ color: '#062850' }}
            >
              Recent Users
            </h3>
            <Link
              href="/admin/dashboard/users"
              className="text-xs font-medium
              hover:underline"
              style={{ color: '#497296' }}
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {(recentUsers || []).map((user) => (
              <div
                key={user.id}
                className="flex items-center
                justify-between py-2 border-b
                border-gray-50 last:border-0"
              >
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: '#062850' }}
                  >
                    {user.full_name || 'No name'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1
                  rounded-full font-medium"
                  style={{
                    backgroundColor:
                      user.role === 'admin'
                        ? '#FEF2F2'
                        : '#F0F6FB',
                    color:
                      user.role === 'admin'
                        ? '#DC2626'
                        : '#497296',
                  }}
                >
                  {user.role}
                </span>
              </div>
            ))}
            {(!recentUsers ||
              recentUsers.length === 0) && (
              <p className="text-sm text-gray-400
              text-center py-4">
                No users yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Scholarship Payments */}
        <div className="bg-white rounded-2xl
        border border-gray-100 p-6">
          <div className="flex items-center
          justify-between mb-4">
            <h3
              className="font-bold"
              style={{ color: '#062850' }}
            >
              🎓 Scholarship Payments
            </h3>
            <Link
              href="/admin/dashboard/users"
              className="text-xs font-medium
              hover:underline"
              style={{ color: '#497296' }}
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {(recentPayments || []).map(
              (payment, i) => (
                <div
                  key={i}
                  className="flex items-center
                  justify-between py-2 border-b
                  border-gray-50 last:border-0"
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: '#062850' }}
                    >
                      {payment.selected_package
                        ?.charAt(0)
                        .toUpperCase() +
                        payment.selected_package
                          ?.slice(1)}{' '}
                      Package
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        payment.created_at
                      ).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: '#16A34A' }}
                  >
                    ₦
                    {Number(
                      payment.final_price || 0
                    ).toLocaleString()}
                  </span>
                </div>
              )
            )}
            {(!recentPayments ||
              recentPayments.length === 0) && (
              <p className="text-sm text-gray-400
              text-center py-4">
                No payments yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Academy Enrollments */}
        <div className="bg-white rounded-2xl
        border border-gray-100 p-6">
          <div className="flex items-center
          justify-between mb-4">
            <h3
              className="font-bold"
              style={{ color: '#062850' }}
            >
              🏛️ Academy Enrollments
            </h3>
            <Link
              href="/admin/dashboard/academy"
              className="text-xs font-medium
              hover:underline"
              style={{ color: '#10B981' }}
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {(recentAcademyEnrollments || []).map(
              (enrollment) => {
                const profile = enrollment.profiles as
                  | { full_name: string; email: string }
                  | null

                return (
                  <div
                    key={enrollment.id}
                    className="flex items-center
                    justify-between py-2 border-b
                    border-gray-50 last:border-0"
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#062850' }}
                      >
                        {profile?.full_name || 'Parent'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(
                          enrollment.created_at
                        ).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-bold"
                        style={{ color: '#062850' }}
                      >
                        £{Number(
                          enrollment.billing_amount || 0
                        ).toLocaleString()}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5
                        rounded-full font-medium"
                        style={{
                          backgroundColor:
                            enrollment.payment_status ===
                            'paid'
                              ? '#F0FDF4'
                              : '#FEF2F2',
                          color:
                            enrollment.payment_status ===
                            'paid'
                              ? '#16A34A'
                              : '#DC2626',
                        }}
                      >
                        {enrollment.payment_status ===
                        'paid'
                          ? 'Paid'
                          : 'Awaiting Payment'}
                      </span>
                    </div>
                  </div>
                )
              }
            )}
            {(!recentAcademyEnrollments ||
              recentAcademyEnrollments.length ===
                0) && (
              <p className="text-sm text-gray-400
              text-center py-4">
                No enrollments yet
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}