import { createSupabaseServerClient } from
  '@/lib/supabase-server'
import {
  Users,
  CreditCard,
  Trophy,
  GraduationCap,
  ShieldCheck,
  MessageSquare,
  Tag,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  const supabase =
    await createSupabaseServerClient()

  // Total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Total paid users
  const { count: paidUsers } = await supabase
    .from('scholarship_preferences')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'paid')

  // Total revenue
  const { data: revenueData } = await supabase
    .from('scholarship_preferences')
    .select('final_price')
    .eq('payment_status', 'paid')

  const totalRevenue = (revenueData || []).reduce(
    (sum, r) => sum + (Number(r.final_price) || 0),
    0
  )

  // Total scholarships
  const { count: totalScholarships } =
    await supabase
      .from('scholarships')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

  // Total matches
  const { count: totalMatches } = await supabase
    .from('scholarship_matches')
    .select('*', { count: 'exact', head: true })

  // Pending verifications
  const { count: pendingVerifications } =
    await supabase
      .from('scholarship_matches')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', false)

  // Unread messages
  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .is('receiver_id', null)
    .eq('is_read', false)

  // Active promo codes
  const { count: activePromos } = await supabase
    .from('promo_codes')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Recent users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // Recent payments
  const { data: recentPayments } = await supabase
    .from('scholarship_preferences')
    .select(
      'user_id, selected_package, final_price, payment_status, created_at'
    )
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers || 0,
      icon: Users,
      color: '#497296',
      href: '/admin/dashboard/users',
    },
    {
      label: 'Paid Users',
      value: paidUsers || 0,
      icon: CreditCard,
      color: '#16A34A',
      href: '/admin/dashboard/users',
    },
    {
      label: 'Revenue',
      value: `₦${(totalRevenue || 0).toLocaleString()}`,
      icon: CreditCard,
      color: '#062850',
      href: '/admin/dashboard/users',
    },
    {
      label: 'Scholarships',
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
  ]

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold
          mb-2"
          style={{ color: '#062850' }}
        >
          Admin Overview
        </h1>
        <p className="text-gray-500 text-sm">
          Platform statistics and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4
      gap-4 mb-8">
        {stats.map((stat) => (
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
                  backgroundColor: `${stat.color}15`,
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2
      gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border
        border-gray-100 p-6">
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

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border
        border-gray-100 p-6">
          <div className="flex items-center
          justify-between mb-4">
            <h3
              className="font-bold"
              style={{ color: '#062850' }}
            >
              Recent Payments
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
                        payment.selected_package?.slice(
                          1
                        )}{' '}
                      Package
                    </p>
                    <p className="text-xs
                    text-gray-500">
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
      </div>
    </div>
  )
}