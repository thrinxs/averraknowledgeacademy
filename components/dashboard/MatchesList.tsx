'use client'


import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TravelRequirementsCard from
  './TravelRequirementsCard'
import {
  Trophy,
  GraduationCap,
  Globe,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CreditCard,
  Shield,
} from 'lucide-react'

interface Props {
  matches: any[]
  paymentStatus: string
  userCountry: string
  travelRequirements: Record<string, any>
}

export default function MatchesList({
  matches,
  paymentStatus,
  userCountry,
  travelRequirements,
}: Props) {
  const [expandedId, setExpandedId] = useState<
    string | null
  >(null)

  if (paymentStatus !== 'paid') {
    return (
      <div className="text-center py-16">
        <div
          className="w-16 h-16 rounded-2xl flex
          items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#FFFBEB' }}
        >
          <CreditCard
            className="w-8 h-8"
            style={{ color: '#D97706' }}
          />
        </div>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: '#062850' }}
        >
          Payment Required
        </h2>
        <p className="text-gray-500 text-sm mb-6
        max-w-md mx-auto">
          Your scholarship matches will appear here
          after payment is confirmed. Complete your
          payment to receive your 5 personalised
          matches.
        </p>
        <Link href="/dashboard/scholarship">
          <Button
            className="text-white font-semibold
            px-8 py-5 rounded-xl transition-all
            duration-300 hover:opacity-90
            hover:scale-105"
            style={{ backgroundColor: '#062850' }}
          >
            Go to Payment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-16">
        <div
          className="w-16 h-16 rounded-2xl flex
          items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#EFF6FF' }}
        >
          <Clock
            className="w-8 h-8 animate-spin"
            style={{
              color: '#2563EB',
              animationDuration: '3s',
            }}
          />
        </div>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: '#062850' }}
        >
          Matching in Progress
        </h2>
        <p className="text-gray-500 text-sm
        max-w-md mx-auto">
          Our system is finding the best scholarships
          for your profile. This usually takes less than
          1 hour. You will receive a notification when
          your matches are ready.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          Your Scholarship Matches
        </h1>
        <p className="text-gray-500 text-sm">
          {matches.length} scholarship
          {matches.length === 1 ? '' : 's'} matched
          to your profile. Click any match to see
          full details.
        </p>
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {matches.map((match, index) => {
          const s = match.scholarship
          if (!s) return null

          const isExpanded = expandedId === match.id

          return (
            <div
              key={match.id}
              className="bg-white rounded-2xl border
              border-gray-100 overflow-hidden
              transition-all duration-300
              hover:shadow-lg"
            >
              {/* Match Header */}
              <button
                onClick={() =>
                  setExpandedId(
                    isExpanded ? null : match.id
                  )
                }
                className="w-full text-left p-6
                flex items-start gap-4"
              >
                {/* Match Number */}
                <div
                  className="w-10 h-10 rounded-xl
                  flex items-center justify-center
                  text-white font-bold text-sm
                  flex-shrink-0"
                  style={{
                    backgroundColor: '#497296',
                  }}
                >
                  {index + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start
                  justify-between gap-2">
                    <div>
                      <h3
                        className="font-bold text-base
                        mb-1"
                        style={{ color: '#062850' }}
                      >
                        {s.name}
                      </h3>
                      <div className="flex flex-wrap
                      items-center gap-3 text-sm
                      text-gray-500">
                        <span className="flex
                        items-center gap-1">
                          <Globe className="w-3.5
                          h-3.5" />
                          {s.country}
                        </span>
                        {s.university && (
                          <span className="flex
                          items-center gap-1">
                            <GraduationCap
                              className="w-3.5 h-3.5"
                            />
                            {s.university}
                          </span>
                        )}
                        {s.deadline && (
                          <span className="flex
                          items-center gap-1">
                            <Calendar
                              className="w-3.5 h-3.5"
                            />
                            {new Date(
                              s.deadline
                            ).toLocaleDateString(
                              'en-GB',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center
                    gap-2 flex-shrink-0">
                      {match.is_verified ? (
                        <span
                          className="flex items-center
                          gap-1 px-2.5 py-1
                          rounded-full text-xs
                          font-semibold"
                          style={{
                            backgroundColor: '#F0FDF4',
                            color: '#16A34A',
                          }}
                        >
                          <Shield className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span
                          className="flex items-center
                          gap-1 px-2.5 py-1
                          rounded-full text-xs
                          font-semibold"
                          style={{
                            backgroundColor: '#FFFBEB',
                            color: '#D97706',
                          }}
                        >
                          <Clock className="w-3 h-3" />
                          Verifying
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5
                        text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5
                        text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-0
                border-t border-gray-100">
                  <div className="pt-6 space-y-6">

                    {/* Description */}
                    {s.description && (
                      <div>
                        <p
                          className="text-xs font-bold
                          uppercase tracking-wider mb-2"
                          style={{ color: '#497296' }}
                        >
                          About
                        </p>
                        <p className="text-sm
                        text-gray-600 leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    )}

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2
                    gap-4">
                      {s.funding_type && (
                        <div>
                          <p className="text-xs
                          text-gray-500 mb-0.5">
                            Funding Type
                          </p>
                          <p
                            className="text-sm
                            font-medium"
                            style={{ color: '#062850' }}
                          >
                            {s.funding_type}
                          </p>
                        </div>
                      )}
                      {s.level?.length > 0 && (
                        <div>
                          <p className="text-xs
                          text-gray-500 mb-0.5">
                            Degree Level
                          </p>
                          <p
                            className="text-sm
                            font-medium"
                            style={{ color: '#062850' }}
                          >
                            {s.level.join(', ')}
                          </p>
                        </div>
                      )}
                      {s.duration && (
                        <div>
                          <p className="text-xs
                          text-gray-500 mb-0.5">
                            Duration
                          </p>
                          <p
                            className="text-sm
                            font-medium"
                            style={{ color: '#062850' }}
                          >
                            {s.duration}
                          </p>
                        </div>
                      )}
                      {s.num_awards && (
                        <div>
                          <p className="text-xs
                          text-gray-500 mb-0.5">
                            Awards Available
                          </p>
                          <p
                            className="text-sm
                            font-medium"
                            style={{ color: '#062850' }}
                          >
                            {s.num_awards}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Coverage */}
                    {s.covers?.length > 0 && (
                      <div>
                        <p
                          className="text-xs font-bold
                          uppercase tracking-wider mb-2"
                          style={{ color: '#497296' }}
                        >
                          What It Covers
                        </p>
                        <div className="flex flex-wrap
                        gap-2">
                          {s.covers.map(
                            (item: string) => (
                              <span
                                key={item}
                                className="px-3 py-1.5
                                rounded-full text-xs
                                font-medium border"
                                style={{
                                  backgroundColor:
                                    '#F0FDF4',
                                  borderColor:
                                    '#86EFAC',
                                  color: '#166534',
                                }}
                              >
                                <CheckCircle
                                  className="w-3 h-3
                                  inline mr-1"
                                />
                                {item}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Eligibility */}
                    {s.eligibility_summary && (
                      <div>
                        <p
                          className="text-xs font-bold
                          uppercase tracking-wider mb-2"
                          style={{ color: '#497296' }}
                        >
                          Eligibility
                        </p>
                        <p className="text-sm
                        text-gray-600 leading-relaxed">
                          {s.eligibility_summary}
                        </p>
                      </div>
                    )}

                    {/* Language Requirements */}
                    {s.language_requirements && (
                      <div>
                        <p
                          className="text-xs font-bold
                          uppercase tracking-wider mb-2"
                          style={{ color: '#497296' }}
                        >
                          Language Requirements
                        </p>
                        <p className="text-sm
                        text-gray-600">
                          {s.language_requirements}
                        </p>
                      </div>
                    )}

                    {/* Required Documents */}
                    {s.required_documents?.length >
                      0 && (
                      <div>
                        <p
                          className="text-xs font-bold
                          uppercase tracking-wider mb-2"
                          style={{ color: '#497296' }}
                        >
                          Required Documents
                        </p>
                        <div className="space-y-2">
                          {s.required_documents.map(
                            (doc: string) => (
                              <div
                                key={doc}
                                className="flex
                                items-center gap-2
                                text-sm text-gray-600"
                              >
                                <FileText
                                  className="w-4 h-4
                                  flex-shrink-0"
                                  style={{
                                    color: '#497296',
                                  }}
                                />
                                {doc}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Application Steps */}
                    {s.application_steps?.length >
                      0 && (
                      <div>
                        <p
                          className="text-xs font-bold
                          uppercase tracking-wider mb-2"
                          style={{ color: '#497296' }}
                        >
                          How to Apply
                        </p>
                        <ol className="space-y-2
                        list-decimal list-inside">
                          {s.application_steps.map(
                            (step: string) => (
                              <li
                                key={step}
                                className="text-sm
                                text-gray-600"
                              >
                                {step}
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    )}

                    {/* Match Reason */}
                    {match.match_reason && (
                      <div
                        className="rounded-xl p-4
                        border"
                        style={{
                          backgroundColor: '#F0F6FB',
                          borderColor: '#97C3E0',
                        }}
                      >
                        <p
                          className="text-xs font-bold
                          uppercase tracking-wider mb-1"
                          style={{ color: '#497296' }}
                        >
                          Why We Matched This
                        </p>
                        <p className="text-sm
                        text-gray-600">
                          {match.match_reason}
                        </p>
                      </div>
                    )}

                                            {/* Travel Requirements */}
                    {userCountry && (
                      <div>
                        <p
                          className="text-xs font-bold
                          uppercase tracking-wider mb-2"
                          style={{ color: '#497296' }}
                        >
                          Travel Requirements from{' '}
                          {userCountry}
                        </p>
                        <TravelRequirementsCard
                          requirements={
                            travelRequirements[
                              s.country
                            ] || null
                          }
                          toCountry={s.country}
                          fromCountry={userCountry}
                          compact={true}
                        />
                      </div>
                    )}  

                    {/* Apply Link */}
                    {s.link && (
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          className="w-full text-white
                          font-semibold py-5
                          rounded-xl transition-all
                          duration-300 hover:opacity-90
                          hover:scale-[1.02]"
                          style={{
                            backgroundColor: '#062850',
                          }}
                        >
                          Apply on Scholarship Website
                          <ExternalLink
                            className="w-4 h-4 ml-2"
                          />
                        </Button>
                      </a>
                    )}

                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}