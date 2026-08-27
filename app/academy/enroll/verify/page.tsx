'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import ExchangeRateDisplay from '@/components/academy/ExchangeRateDisplay'

export default function AcademyVerifyPage() {
  const [mounted, setMounted] = useState(false)
  const [enrollmentId, setEnrollmentId] = useState('')
  const [currency, setCurrency] = useState('GBP')
  const [billingAmount, setBillingAmount] = useState(0)
  const [ngnAmount, setNgnAmount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const id = localStorage.getItem('academy_enrollment_id') || ''
    const cur = localStorage.getItem('academy_currency') || 'GBP'
    const amt = localStorage.getItem('academy_billing_amount') || '0'
    setEnrollmentId(id)
    setCurrency(cur)
    setBillingAmount(Number(amt))
  }, [])

  const handleRateLoaded = useCallback((ngn: number) => {
    setNgnAmount(ngn)
  }, [])

  function handlePayNow() {
    const params = new URLSearchParams({
      enrollment_id: enrollmentId,
      currency,
      amount: String(billingAmount),
      ngn_amount: String(ngnAmount),
    })
    router.push(`/academy/enroll/payment?${params.toString()}`)
  }

  if (!mounted) return null

  const isNGN = currency === 'NGN'
  const symbol = isNGN ? '₦' : currency === 'GBP' ? '£' : '€'
  const formattedAmount = `${symbol}${billingAmount.toLocaleString()}`

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ backgroundColor: '#F0F6FB' }}
    >
      <div className="max-w-md w-full text-center">

        <Link href="/academy" className="inline-block mb-8">
          <Image
            src="/logo.png"
            alt="Averra Knowledge Academy"
            width={200}
            height={200}
            className="h-16 w-auto mx-auto object-contain"
          />
        </Link>

        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
          style={{ backgroundColor: '#062850' }}
        >
          🎉
        </div>

        <h1
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: '#062850' }}
        >
          Enrolment Registered!
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Your account has been created successfully.
          Complete your payment to activate your dashboard and begin classes.
        </p>

        {/* Amount due */}
        {billingAmount > 0 && (
          <div
            className="rounded-2xl p-4 mb-4 border-2"
            style={{ borderColor: '#497296', backgroundColor: '#EBF4FF' }}
          >
            <p className="text-sm text-gray-500 mb-1">Amount Due</p>
            <p className="text-3xl font-bold" style={{ color: '#062850' }}>
              {formattedAmount}
            </p>
          </div>
        )}

        {/* Exchange rate display for international users */}
        {!isNGN && billingAmount > 0 && (
          <div className="mb-6 text-left">
            <ExchangeRateDisplay
              currency={currency}
              amount={billingAmount}
              onRateLoaded={handleRateLoaded}
            />
          </div>
        )}

        {/* Steps */}
        <div
          className="rounded-2xl p-6 mb-6 text-left space-y-3"
          style={{ backgroundColor: '#062850' }}
        >
          <h3 className="font-bold text-white text-sm mb-4">What to do now:</h3>
          {[
            'Click Pay Now to choose your payment method',
            isNGN
              ? 'Pay securely via Paystack using your card'
              : 'Pay via card (charged in NGN) or bank transfer (GBP/EUR)',
            'Send your payment proof to our WhatsApp if paying by transfer',
            'We activate your dashboard within 2 hours of confirmation',
            'Classes begin within 48 hours of timetable confirmation',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                style={{ backgroundColor: '#497296' }}
              >
                {i + 1}
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button
            onClick={handlePayNow}
            className="w-full text-white font-semibold py-3 rounded-xl text-base"
            style={{ backgroundColor: '#497296' }}
          >
            💳 Pay Now — {formattedAmount}
            {!isNGN && ngnAmount > 0 && (
              <span className="text-xs ml-2 opacity-80">
                (≈ ₦{ngnAmount.toLocaleString()})
              </span>
            )}
          </Button>

          <Link href="/dashboard/academy">
            <Button
              variant="outline"
              className="w-full py-3 rounded-xl mt-2 text-sm"
            >
              Skip for now — Pay from My Dashboard →
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Questions? WhatsApp us on +234 903 344 0966 or email
          info@averraknowledgeacademy.com
        </p>

      </div>
    </div>
  )
}
