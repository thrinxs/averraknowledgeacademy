'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  CreditCard,
  Trophy,
  Bell,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
} from 'lucide-react'

interface Props {
  profile: any
  preferences: any
  matchCount: number
  notifCount: number
  msgCount: number
}

const packageInfo: Record<
  string,
  { name: string; price: string; color: string }
> = {
  basic: {
    name: 'Basic',
    price: '₦30,000',
    color: '#497296',
  },
  standard: {
    name: 'Standard',
    price: '₦50,000',
    color: '#325E84',
  },
  premium: {
    name: 'Premium',
    price: '₦150,000',
    color: '#062850',
  },
}

export default function DashboardHome({
  profile,
  preferences,
  matchCount,
  notifCount,
  msgCount,
}: Props) {
  const pkg = preferences?.selected_package
    ? packageInfo[preferences.selected_package]
    : null

  const paymentStatus =
    preferences?.payment_status || 'unpaid'

  const hasMatches = matchCount > 0

  // Determine dashboard state
  const getStatus = () => {
    if (!preferences) return 'no_application'
    if (paymentStatus === 'unpaid') return 'awaiting_payment'
    if (paymentStatus === 'pending') return 'payment_pending'
    if (paymentStatus === 'paid' && !hasMatches)
      return 'matching'
    if (paymentStatus === 'paid' && hasMatches)
      return 'matches_ready'
    return 'no_application'
  }

  const status = getStatus()

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">

      {/* Welcome */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold
          mb-2"
          style={{ color: '#062850' }}
        >
          Welcome back, {profile?.full_name || 'Student'}
        </h1>
        <p className="text-gray-500 text-sm">
          Here is an overview of your scholarship
          journey with Averra Knowledge Academy.
        </p>
      </div>

      {/* Status Banner */}
      {status === 'awaiting_payment' && pkg && (
        <div
          className="rounded-2xl p-6 mb-8 border-2
          flex flex-col sm:flex-row items-start
          sm:items-center justify-between gap-4"
          style={{
            backgroundColor: '#FFFBEB',
            borderColor: '#FCD34D',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex
              items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#FEF3C7' }}
            >
              <CreditCard
                className="w-6 h-6"
                style={{ color: '#D97706' }}
              />
            </div>
            <div>
              <p
                className="font-bold text-base mb-1"
                style={{ color: '#92400E' }}
              >
                Payment Required
              </p>
              <p
                className="text-sm"
                style={{ color: '#92400E' }}
              >
                You selected the{' '}
                <span className="font-semibold">
                  {pkg.name}
                </span>{' '}
                package
                {preferences?.final_price
                  ? ` (₦${Number(
                      preferences.final_price
                    ).toLocaleString()})`
                  : ` (${pkg.price})`}
                . Complete your payment to receive
                your 5 scholarship matches.
              </p>
            </div>
          </div>
          <Link href="/dashboard/scholarship">
            <Button
              className="text-white font-semibold
              px-6 py-5 rounded-xl transition-all
              duration-300 hover:opacity-90
              hover:scale-105 whitespace-nowrap"
              style={{ backgroundColor: '#062850' }}
            >
              Pay Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {status === 'matching' && (
        <div
          className="rounded-2xl p-6 mb-8 border-2
          flex items-start gap-4"
          style={{
            backgroundColor: '#EFF6FF',
            borderColor: '#93C5FD',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex
            items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#DBEAFE' }}
          >
            <Clock
              className="w-6 h-6 animate-spin"
              style={{
                color: '#2563EB',
                animationDuration: '3s',
              }}
            />
          </div>
          <div>
            <p
              className="font-bold text-base mb-1"
              style={{ color: '#1E40AF' }}
            >
              Matching in Progress
            </p>
            <p
              className="text-sm"
              style={{ color: '#1E40AF' }}
            >
              Your payment has been confirmed. Our
              system is finding the best scholarships
              for your profile. Matches are usually
              delivered within 1 hour.
            </p>
          </div>
        </div>
      )}

      {status === 'matches_ready' && (
        <div
          className="rounded-2xl p-6 mb-8 border-2
          flex flex-col sm:flex-row items-start
          sm:items-center justify-between gap-4"
          style={{
            backgroundColor: '#F0FDF4',
            borderColor: '#86EFAC',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex
              items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#DCFCE7' }}
            >
              <CheckCircle
                className="w-6 h-6"
                style={{ color: '#16A34A' }}
              />
            </div>
            <div>
              <p
                className="font-bold text-base mb-1"
                style={{ color: '#166534' }}
              >
                Your Matches Are Ready!
              </p>
              <p
                className="text-sm"
                style={{ color: '#166534' }}
              >
                You have {matchCount} scholarship
                {matchCount === 1 ? '' : 's'} matched
                to your profile. View them now and
                start your applications.
              </p>
            </div>
          </div>
          <Link href="/dashboard/matches">
            <Button
              className="text-white font-semibold
              px-6 py-5 rounded-xl transition-all
              duration-300 hover:opacity-90
              hover:scale-105 whitespace-nowrap"
              style={{ backgroundColor: '#16A34A' }}
            >
              View Matches
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {status === 'no_application' && (
        <div
          className="rounded-2xl p-6 mb-8 border-2
          flex flex-col sm:flex-row items-start
          sm:items-center justify-between gap-4"
          style={{
            backgroundColor: '#F0F6FB',
            borderColor: '#97C3E0',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex
              items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#E0EEF7' }}
            >
              <AlertCircle
                className="w-6 h-6"
                style={{ color: '#497296' }}
              />
            </div>
            <div>
              <p
                className="font-bold text-base mb-1"
                style={{ color: '#062850' }}
              >
                No Scholarship Application Yet
              </p>
              <p
                className="text-sm"
                style={{ color: '#325E84' }}
              >
                You have not started a scholarship
                application. Fill the form to get
                matched with fully funded scholarships.
              </p>
            </div>
          </div>
          <Link href="/scholarship/apply">
            <Button
              className="text-white font-semibold
              px-6 py-5 rounded-xl transition-all
              duration-300 hover:opacity-90
              hover:scale-105 whitespace-nowrap"
              style={{ backgroundColor: '#062850' }}
            >
              Start Application
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4
      gap-4 mb-8">
        {[
          {
            icon: GraduationCap,
            label: 'Package',
            value: pkg?.name || 'None',
            color: pkg?.color || '#497296',
            href: '/dashboard/scholarship',
          },
          {
            icon: Trophy,
            label: 'Matches',
            value: matchCount.toString(),
            color: '#16A34A',
            href: '/dashboard/matches',
          },
          {
            icon: Bell,
            label: 'Notifications',
            value: notifCount.toString(),
            color: '#D97706',
            href: '/dashboard/notifications',
          },
          {
            icon: MessageSquare,
            label: 'Messages',
            value: msgCount.toString(),
            color: '#2563EB',
            href: '/dashboard/messages',
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
                className="w-10 h-10 rounded-xl flex
                items-center justify-center"
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2
      gap-4">

        {/* Profile Card */}
        <Link
          href="/dashboard/profile"
          className="bg-white rounded-2xl p-6
          border border-gray-100 transition-all
          duration-300 hover:shadow-lg
          hover:-translate-y-1 group"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex
              items-center justify-center"
              style={{ backgroundColor: '#F0F6FB' }}
            >
              <User
                className="w-6 h-6"
                style={{ color: '#497296' }}
              />
            </div>
            <div className="flex-1">
              <p
                className="font-semibold mb-0.5"
                style={{ color: '#062850' }}
              >
                My Profile
              </p>
              <p className="text-xs text-gray-500">
                View and edit your personal information
              </p>
            </div>
            <ArrowRight
              className="w-5 h-5 text-gray-300
              group-hover:text-gray-500
              transition-colors"
            />
          </div>
        </Link>

        {/* Scholarship Info Card */}
        <Link
          href="/dashboard/scholarship"
          className="bg-white rounded-2xl p-6
          border border-gray-100 transition-all
          duration-300 hover:shadow-lg
          hover:-translate-y-1 group"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex
              items-center justify-center"
              style={{ backgroundColor: '#F0F6FB' }}
            >
              <GraduationCap
                className="w-6 h-6"
                style={{ color: '#497296' }}
              />
            </div>
            <div className="flex-1">
              <p
                className="font-semibold mb-0.5"
                style={{ color: '#062850' }}
              >
                My Scholarship
              </p>
              <p className="text-xs text-gray-500">
                View your package, payment status,
                and preferences
              </p>
            </div>
            <ArrowRight
              className="w-5 h-5 text-gray-300
              group-hover:text-gray-500
              transition-colors"
            />
          </div>
        </Link>

      </div>

    </div>
  )
}