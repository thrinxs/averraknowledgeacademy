'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TravelRequirementsCard from
  './TravelRequirementsCard'
import {
  GraduationCap,
  CreditCard,
  CheckCircle,
  Globe,
  BookOpen,
  ArrowRight,
  Clock,
  FileText,
  Loader2,
} from 'lucide-react'

interface Props {
  preferences: any
  academic: any
  userId: string
  travelRequirements?: Record<string, any>
  userCountry?: string
}

const packageDetails: Record<
  string,
  {
    name: string
    price: number
    color: string
    features: string[]
  }
> = {
  basic: {
    name: 'Basic',
    price: 30000,
    color: '#497296',
    features: [
      '5 Scholarship Matches',
      'Detailed Match Report',
      'Country & Deadline Info',
      'Eligibility Breakdown',
    ],
  },
  standard: {
    name: 'Standard',
    price: 50000,
    color: '#325E84',
    features: [
      '5 Scholarship Matches',
      'Detailed Match Report',
      'SOP Review & Modification',
      'CV Review & Modification',
      'Application Guidance',
    ],
  },
  premium: {
    name: 'Premium',
    price: 150000,
    color: '#062850',
    features: [
      '5 Scholarship Matches',
      'Everything in Standard',
      'Profile Boosting Coaching',
      'Interview Preparation',
      'WhatsApp Advisor Access',
      'Priority Support',
    ],
  },
}

function formatPrice(amount: number) {
  return '₦' + amount.toLocaleString('en-NG')
}

function PayNowButton({
  userId,
  amount,
}: {
  userId: string
  amount: number
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        '/api/paystack/initialize',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      )

      const data = await response.json()

      if (
        data.success &&
        data.authorization_url
      ) {
        window.location.href =
          data.authorization_url
      } else {
        setError(
          data.error ||
            'Payment initialization failed. Please try again.'
        )
      }
    } catch {
      setError(
        'Could not connect to payment service. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handlePay}
        disabled={loading}
        className="text-white font-semibold
        px-6 py-4 rounded-xl transition-all
        duration-300 hover:opacity-90
        hover:scale-105 disabled:opacity-60
        disabled:cursor-not-allowed"
        style={{ backgroundColor: '#062850' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2
            animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            Pay {formatPrice(amount)}
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
      {error && (
        <p className="text-red-500 text-xs
        text-right max-w-xs">
          {error}
        </p>
      )}
    </div>
  )
}

export default function ScholarshipStatus({
  preferences,
  academic,
  userId,
  travelRequirements = {},
  userCountry = '',
}: Props) {
  if (!preferences) {
    return (
      <div className="text-center py-16">
        <div
          className="w-16 h-16 rounded-2xl flex
          items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#F0F6FB' }}
        >
          <GraduationCap
            className="w-8 h-8"
            style={{ color: '#497296' }}
          />
        </div>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: '#062850' }}
        >
          No Scholarship Application
        </h2>
        <p className="text-gray-500 text-sm mb-6
        max-w-md mx-auto">
          You have not submitted a scholarship
          application yet. Start the process to get
          matched with fully funded scholarships.
        </p>
        <Link href="/scholarship/apply">
          <Button
            className="text-white font-semibold
            px-8 py-5 rounded-xl transition-all
            duration-300 hover:opacity-90
            hover:scale-105"
            style={{ backgroundColor: '#062850' }}
          >
            Start Application
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )
  }

  const pkg =
    packageDetails[preferences.selected_package]
  const paymentStatus = preferences.payment_status
  const finalPrice = preferences.final_price
    ? Number(preferences.final_price)
    : pkg?.price || 0

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          My Scholarship
        </h1>
        <p className="text-gray-500 text-sm">
          Your scholarship application details,
          package, and payment status.
        </p>
      </div>

      {/* Package & Payment Card */}
      {pkg && (
        <div className="bg-white rounded-2xl border
        border-gray-100 overflow-hidden mb-6">

          {/* Package Header */}
          <div
            className="p-6"
            style={{ backgroundColor: pkg.color }}
          >
            <div className="flex items-center
            justify-between">
              <div>
                <p className="text-sm text-blue-200
                mb-1">
                  Selected Package
                </p>
                <h3 className="text-2xl font-bold
                text-white">
                  {pkg.name}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-200
                mb-1">
                  {preferences.promo_code
                    ? 'Discounted Price'
                    : 'Price'}
                </p>
                <p className="text-2xl font-bold
                text-white">
                  {formatPrice(finalPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="p-6 border-b
          border-gray-100">
            <div className="flex items-center
            justify-between flex-wrap gap-4">
              <div className="flex items-center
              gap-3">
                {paymentStatus === 'paid' ? (
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: '#16A34A' }}
                  />
                ) : paymentStatus === 'pending' ? (
                  <Clock
                    className="w-5 h-5"
                    style={{ color: '#D97706' }}
                  />
                ) : (
                  <CreditCard
                    className="w-5 h-5"
                    style={{ color: '#DC2626' }}
                  />
                )}
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: '#062850' }}
                  >
                    Payment Status
                  </p>
                  <p className="text-xs
                  text-gray-500">
                    {paymentStatus === 'paid'
                      ? 'Payment confirmed'
                      : paymentStatus === 'pending'
                      ? 'Payment is being processed'
                      : 'Payment not yet made'}
                  </p>
                </div>
              </div>

              {paymentStatus === 'unpaid' && (
                <PayNowButton
                  userId={userId}
                  amount={finalPrice}
                />
              )}

              {paymentStatus === 'pending' && (
                <div
                  className="px-4 py-2 rounded-xl
                  text-sm font-medium border"
                  style={{
                    backgroundColor: '#FFFBEB',
                    borderColor: '#FCD34D',
                    color: '#D97706',
                  }}
                >
                  Processing...
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="p-6">
            <p
              className="text-xs font-bold uppercase
              tracking-wider mb-3"
              style={{ color: '#497296' }}
            >
              Included in your package
            </p>
            <div className="grid grid-cols-1
            sm:grid-cols-2 gap-2">
              {pkg.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center
                  gap-2 text-sm text-gray-600"
                >
                  <CheckCircle
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: pkg.color }}
                  />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Promo / Referral */}
          {(preferences.promo_code ||
            preferences.referral_code) && (
            <div className="px-6 pb-6">
              <div
                className="rounded-xl p-4 flex
                flex-wrap gap-4"
                style={{
                  backgroundColor: '#F0F6FB',
                }}
              >
                {preferences.promo_code && (
                  <div className="flex items-center
                  gap-2 text-sm">
                    <FileText
                      className="w-4 h-4"
                      style={{ color: '#497296' }}
                    />
                    <span className="text-gray-600">
                      Promo:{' '}
                      <span
                        className="font-semibold"
                        style={{ color: '#062850' }}
                      >
                        {preferences.promo_code}
                      </span>
                    </span>
                  </div>
                )}
                {preferences.referral_code && (
                  <div className="flex items-center
                  gap-2 text-sm">
                    <FileText
                      className="w-4 h-4"
                      style={{ color: '#497296' }}
                    />
                    <span className="text-gray-600">
                      Referral:{' '}
                      <span
                        className="font-semibold"
                        style={{ color: '#062850' }}
                      >
                        {preferences.referral_code}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preferences Summary */}
      <div className="bg-white rounded-2xl border
      border-gray-100 p-6 mb-6">
        <h3
          className="font-bold mb-4"
          style={{ color: '#062850' }}
        >
          Your Preferences
        </h3>
        <div className="grid grid-cols-1
        sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Globe
              className="w-5 h-5 mt-0.5
              flex-shrink-0"
              style={{ color: '#497296' }}
            />
            <div>
              <p className="text-xs text-gray-500
              mb-0.5">
                Preferred Countries
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: '#062850' }}
              >
                {preferences.preferred_countries
                  ?.join(', ') || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <GraduationCap
              className="w-5 h-5 mt-0.5
              flex-shrink-0"
              style={{ color: '#497296' }}
            />
            <div>
              <p className="text-xs text-gray-500
              mb-0.5">
                Degree Level
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: '#062850' }}
              >
                {preferences.degree_level ||
                  'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen
              className="w-5 h-5 mt-0.5
              flex-shrink-0"
              style={{ color: '#497296' }}
            />
            <div>
              <p className="text-xs text-gray-500
              mb-0.5">
                Field of Study
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: '#062850' }}
              >
                {preferences.field_abroad ||
                  'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock
              className="w-5 h-5 mt-0.5
              flex-shrink-0"
              style={{ color: '#497296' }}
            />
            <div>
              <p className="text-xs text-gray-500
              mb-0.5">
                Preferred Start
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: '#062850' }}
              >
                {preferences.preferred_start_date ||
                  preferences.start_date ||
                  'Flexible'}
              </p>
            </div>
          </div>
        </div>
      </div>

              {/* Travel Requirements Summary */}
        {userCountry &&
          Object.keys(travelRequirements).length >
            0 && (
          <div className="bg-white rounded-2xl
          border border-gray-100 p-6 mb-6">
            <h3
              className="font-bold mb-4"
              style={{ color: '#062850' }}
            >
              Travel Requirements
              <span
                className="text-xs font-normal
                text-gray-500 ml-2"
              >
                from {userCountry}
              </span>
            </h3>
            <p className="text-xs text-gray-500
            mb-4">
              Based on your preferred countries,
              here are the visa and travel
              requirements you will need to prepare.
            </p>
            <div className="space-y-3">
              {Object.entries(
                travelRequirements
              ).map(([country, req]) => (
                <TravelRequirementsCard
                  key={country}
                  requirements={req}
                  toCountry={country}
                  fromCountry={userCountry}
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}

      {/* Academic Summary */}
      {academic && (
        <div className="bg-white rounded-2xl border
        border-gray-100 p-6">
          <h3
            className="font-bold mb-4"
            style={{ color: '#062850' }}
          >
            Academic Profile
          </h3>
          <div className="grid grid-cols-1
          sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500
              mb-0.5">
                Education Level
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: '#062850' }}
              >
                {academic.education_level || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500
              mb-0.5">
                Institution
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: '#062850' }}
              >
                {academic.institution || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500
              mb-0.5">
                CGPA
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: '#062850' }}
              >
                {academic.cgpa || '—'}
                {academic.grading_scale
                  ? ` (${academic.grading_scale} scale)`
                  : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500
              mb-0.5">
                Field of Study
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: '#062850' }}
              >
                {academic.field_of_study || '—'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}