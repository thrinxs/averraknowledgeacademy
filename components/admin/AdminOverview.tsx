'use client'

import Link from 'next/link'
import {
  Users,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Tag,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'

interface Props {
  stats: {
    totalUsers: number
    totalPaid: number
    pendingVerification: number
    totalScholarships: number
    totalPromos: number
    unreadMessages: number
  }
  recentUsers: any[]
  recentPayments: any[]
}

function formatPrice(amount: number) {
  return '₦' + amount.toLocaleString('en-NG')
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

export default function AdminOverview({
  stats,
  recentUsers,
  recentPayments,
}: Props) {
  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: '#497296',
      href: '/admin/dashboard/users',
    },
    {
      label: 'Paid Users',
      value: stats.totalPaid,
      icon: CreditCard,
      color: '#16A34A',
      href: '/admin/dashboard/users',
    },
    {
      label: 'Pending Verification',
      value: stats.pendingVerification,
      icon: ShieldCheck,
      color: '#D97706',
      href: '/admin/dashboard/verification',
    },
    {
      label: 'Active Scholarships',
      value: stats.totalScholarships,
      icon: BookOpen,
      color: '#2563EB',
      href: '/admin/dashboard/scholarships',
    },
    {
      label: 'Promo Codes',
      value: stats.totalPromos,
      icon: Tag,
      color: '#7C3AED',
      href: '/admin/dashboard/promos',
    },
    {
      label: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: '#DC2626',
      href: '/admin/dashboard/messages',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold
          mb-1"
          style={{ color: '#062850' }}
        >
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of Averra Knowledge Academy
          operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2
      md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-5
            border border-gray-100
            transition-all duration-300
            hover:shadow-lg hover:-translate-y-1
            group"
          >
            <div className="flex items-center
            justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl
                flex items-center justify-center"
                style={{
                  backgroundColor:
                    `${card.color}15`,
                }}
              >
                <card.icon
                  className="w-5 h-5"
                  style={{ color: card.color }}
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
              {card.value}
            </p>
            <p className="text-xs text-gray-500">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1
      md:grid-cols-2 gap-6">

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border
        border-gray-100 p-6">
          <div className="flex items-center
          justify-between mb-4">
            <h3
              className="font-bold"
              style={{ color: '#062850' }}
            >
              Recent Signups
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
          {recentUsers.length === 0 ? (
            <p className="text-sm text-gray-400">
              No users yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map(
                (user: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center
                    justify-between py-2 border-b
                    border-gray-50 last:border-0"
                  >
                    <div>
                      <p
                        className="text-sm
                        font-medium"
                        style={{ color: '#062850' }}
                      >
                        {user.full_name || 'No name'}
                      </p>
                      <p className="text-xs
                      text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-xs
                    text-gray-400">
                      {formatTime(user.created_at)}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
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
              href="/admin/dashboard/verification"
              className="text-xs font-medium
              hover:underline"
              style={{ color: '#497296' }}
            >
              View all
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-gray-400">
              No payments yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map(
                (payment: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center
                    justify-between py-2 border-b
                    border-gray-50 last:border-0"
                  >
                    <div>
                      <p
                        className="text-sm font-medium
                        capitalize"
                        style={{ color: '#062850' }}
                      >
                        {payment.selected_package}{' '}
                        Package
                      </p>
                      <p className="text-xs
                      text-gray-500">
                        {formatPrice(
                          Number(
                            payment.final_price
                          ) || 0
                        )}
                      </p>
                    </div>
                    <span
                      className="px-2 py-0.5
                      rounded-full text-xs
                      font-medium"
                      style={{
                        backgroundColor: '#F0FDF4',
                        color: '#16A34A',
                      }}
                    >
                      Paid
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}