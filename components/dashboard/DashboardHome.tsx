'use client'
import ProfileIncompleteModal from '@/components/dashboard/ProfileIncompleteModal'

import Link from 'next/link'
import {
  GraduationCap,
  Bell,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  School,
  BookOpen,
  Briefcase,
} from 'lucide-react'

interface Props {
  profile: any
  preferences: any
  matchCount: number
  notifCount: number
  msgCount: number
}

export default function DashboardHome({
  profile,
  preferences,
  matchCount,
  notifCount,
  msgCount,
}: Props) {
  const firstName =
    profile?.full_name?.split(' ')[0] || 'there'

  const scholarshipStatus =
    preferences?.payment_status || null

  return (
    <>
    {profile && <ProfileIncompleteModal profile={profile as Record<string, unknown>} />}
    <div className="p-6 md:p-10 max-w-5xl mx-auto">

      {/* Welcome */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Here is an overview of your Averra Knowledge
          Academy services and activity.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4
      gap-4 mb-8">
        {[
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
          {
            icon: GraduationCap,
            label: 'Scholarship Matches',
            value: matchCount.toString(),
            color: '#16A34A',
            href: '/dashboard/matches',
          },
          {
            icon: User,
            label: 'My Profile',
            value: '→',
            color: '#497296',
            href: '/dashboard/profile',
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

      {/* Services Grid */}
      <h2
        className="font-bold text-lg mb-4"
        style={{ color: '#062850' }}
      >
        My Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2
      gap-4 mb-8">

        {/* Scholarships */}
        <Link
          href="/dashboard/scholarship"
          className="bg-white rounded-2xl p-6
          border border-gray-100 transition-all
          duration-300 hover:shadow-lg
          hover:-translate-y-1 group"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex
              items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#EBF4FF' }}
            >
              <GraduationCap
                className="w-6 h-6"
                style={{ color: '#325E84' }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center
              justify-between mb-1">
                <p
                  className="font-bold"
                  style={{ color: '#062850' }}
                >
                  Scholarships
                </p>
                {scholarshipStatus === 'paid' && (
                  <span
                    className="text-xs px-2 py-0.5
                    rounded-full font-medium text-white"
                    style={{ backgroundColor: '#16A34A' }}
                  >
                    Active
                  </span>
                )}
                {scholarshipStatus === 'unpaid' && (
                  <span
                    className="text-xs px-2 py-0.5
                    rounded-full font-medium"
                    style={{
                      backgroundColor: '#FEF3C7',
                      color: '#D97706',
                    }}
                  >
                    Payment Pending
                  </span>
                )}
                {!scholarshipStatus && (
                  <span
                    className="text-xs px-2 py-0.5
                    rounded-full font-medium"
                    style={{
                      backgroundColor: '#F0F6FB',
                      color: '#497296',
                    }}
                  >
                    Not Started
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-2">
                {scholarshipStatus === 'paid'
                  ? `${matchCount} scholarship${matchCount !== 1 ? 's' : ''} matched to your profile`
                  : scholarshipStatus === 'unpaid'
                  ? 'Complete your payment to receive your matches'
                  : 'Get matched with fully funded scholarships worldwide'
                }
              </p>
              <p
                className="text-xs font-semibold
                flex items-center gap-1"
                style={{ color: '#325E84' }}
              >
                {scholarshipStatus === 'paid'
                  ? 'View my matches'
                  : scholarshipStatus === 'unpaid'
                  ? 'Complete payment'
                  : 'Start application'
                }
                <ArrowRight className="w-3 h-3
                group-hover:translate-x-1
                transition-transform" />
              </p>
            </div>
          </div>
        </Link>

        {/* Academy */}
        <Link
          href="/dashboard/academy"
          className="bg-white rounded-2xl p-6
          border border-gray-100 transition-all
          duration-300 hover:shadow-lg
          hover:-translate-y-1 group"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex
              items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#ECFDF5' }}
            >
              <School
                className="w-6 h-6"
                style={{ color: '#10B981' }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center
              justify-between mb-1">
                <p
                  className="font-bold"
                  style={{ color: '#062850' }}
                >
                  Academy
                </p>
                <span
                  className="text-xs px-2 py-0.5
                  rounded-full font-medium"
                  style={{
                    backgroundColor: '#F0F6FB',
                    color: '#497296',
                  }}
                >
                  View
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Averra Super Curriculum — personalised
                academic tutoring for your learner
              </p>
              <p
                className="text-xs font-semibold
                flex items-center gap-1"
                style={{ color: '#10B981' }}
              >
                View my enrolment
                <ArrowRight className="w-3 h-3
                group-hover:translate-x-1
                transition-transform" />
              </p>
            </div>
          </div>
        </Link>

        {/* Skills */}
        <Link
          href="/dashboard/courses"
          className="bg-white rounded-2xl p-6
          border border-gray-100 transition-all
          duration-300 hover:shadow-lg
          hover:-translate-y-1 group"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex
              items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#FEF3C7' }}
            >
              <BookOpen
                className="w-6 h-6"
                style={{ color: '#D97706' }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center
              justify-between mb-1">
                <p
                  className="font-bold"
                  style={{ color: '#062850' }}
                >
                  Skills & Courses
                </p>
                <span
                  className="text-xs px-2 py-0.5
                  rounded-full font-medium"
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#D97706',
                  }}
                >
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Typing, computer skills, website
                building and more practical courses
              </p>
              <p
                className="text-xs font-semibold
                flex items-center gap-1"
                style={{ color: '#D97706' }}
              >
                Browse courses
                <ArrowRight className="w-3 h-3
                group-hover:translate-x-1
                transition-transform" />
              </p>
            </div>
          </div>
        </Link>

        {/* Careers */}
        <Link
          href="/dashboard/careers"
          className="bg-white rounded-2xl p-6
          border border-gray-100 transition-all
          duration-300 hover:shadow-lg
          hover:-translate-y-1 group"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex
              items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#F3E8FF' }}
            >
              <Briefcase
                className="w-6 h-6"
                style={{ color: '#7C3AED' }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center
              justify-between mb-1">
                <p
                  className="font-bold"
                  style={{ color: '#062850' }}
                >
                  Careers
                </p>
                <span
                  className="text-xs px-2 py-0.5
                  rounded-full font-medium"
                  style={{
                    backgroundColor: '#F3E8FF',
                    color: '#7C3AED',
                  }}
                >
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Career test, industrial training and
                career switch programmes
              </p>
              <p
                className="text-xs font-semibold
                flex items-center gap-1"
                style={{ color: '#7C3AED' }}
              >
                View programmes
                <ArrowRight className="w-3 h-3
                group-hover:translate-x-1
                transition-transform" />
              </p>
            </div>
          </div>
        </Link>

      </div>

      {/* Scholarship Status Banner */}
      {scholarshipStatus === 'unpaid' && preferences && (
        <div
          className="rounded-2xl p-5 border-2
          flex flex-col sm:flex-row items-start
          sm:items-center justify-between gap-4"
          style={{
            backgroundColor: '#FFFBEB',
            borderColor: '#FCD34D',
          }}
        >
          <div className="flex items-start gap-3">
            <Clock
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: '#D97706' }}
            />
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: '#92400E' }}
              >
                Scholarship Payment Pending
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: '#92400E' }}
              >
                Complete your payment to receive your
                5 scholarship matches.
              </p>
            </div>
          </div>
          <Link href="/dashboard/scholarship">
            <button
              className="px-5 py-2.5 rounded-xl
              text-sm font-bold text-white
              transition-all hover:opacity-90
              whitespace-nowrap"
              style={{ backgroundColor: '#062850' }}
            >
              Pay Now →
            </button>
          </Link>
        </div>
      )}

      {scholarshipStatus === 'paid' && matchCount > 0 && (
        <div
          className="rounded-2xl p-5 border-2
          flex flex-col sm:flex-row items-start
          sm:items-center justify-between gap-4"
          style={{
            backgroundColor: '#F0FDF4',
            borderColor: '#86EFAC',
          }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: '#16A34A' }}
            />
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: '#166534' }}
              >
                Your Scholarship Matches Are Ready!
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: '#166534' }}
              >
                {matchCount} scholarship
                {matchCount !== 1 ? 's' : ''} matched
                to your profile. View and start
                your applications.
              </p>
            </div>
          </div>
          <Link href="/dashboard/matches">
            <button
              className="px-5 py-2.5 rounded-xl
              text-sm font-bold text-white
              transition-all hover:opacity-90
              whitespace-nowrap"
              style={{ backgroundColor: '#16A34A' }}
            >
              View Matches →
            </button>
          </Link>
        </div>
      )}

      {!scholarshipStatus && (
        <div
          className="rounded-2xl p-5 border-2
          flex flex-col sm:flex-row items-start
          sm:items-center justify-between gap-4"
          style={{
            backgroundColor: '#F0F6FB',
            borderColor: '#97C3E0',
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: '#497296' }}
            />
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: '#062850' }}
              >
                Start Your Scholarship Journey
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: '#325E84' }}
              >
                Get matched with fully funded
                scholarships in 30+ countries
                worldwide.
              </p>
            </div>
          </div>
          <Link href="/scholarship/apply">
            <button
              className="px-5 py-2.5 rounded-xl
              text-sm font-bold text-white
              transition-all hover:opacity-90
              whitespace-nowrap"
              style={{ backgroundColor: '#062850' }}
            >
              Start Application →
            </button>
          </Link>
        </div>
      )}

    </div>
  )
}