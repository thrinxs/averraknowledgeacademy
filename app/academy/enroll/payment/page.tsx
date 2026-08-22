'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Copy, Check, Loader2 } from 'lucide-react'

const GBP_DETAILS = [
  { label: 'Account Name', value: 'Baridubari Joshua Joe-Amos' },
  { label: 'Account Number', value: '35651420' },
  { label: 'Sort Code', value: '04-13-07' },
  { label: 'IBAN', value: 'GB68CLJU04130735651420' },
  { label: 'Bank', value: 'Clear Junction Limited' },
  { label: 'Payment Method', value: 'Faster Payment (FPS)' },
]

const EUR_DETAILS = [
  { label: 'Account Name', value: 'Baridubari Joshua Joe-Amos' },
  { label: 'Account Number', value: '35651420' },
  { label: 'Sort Code', value: '04-13-07' },
  { label: 'IBAN', value: 'GB68CLJU04130735651420' },
  { label: 'Bank', value: 'Clear Junction Limited' },
  { label: 'Payment Method', value: 'SEPA & SEPA Instant' },
]

type PaymentMethod = 'card' | 'gbp' | 'eur' | null

function AcademyPaymentInner() {
  const [mounted, setMounted] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null)
  const [reference, setReference] = useState('AVERRA-ACAD')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [loadingPaystack, setLoadingPaystack] = useState(false)
  const [error, setError] = useState('')

  const searchParams = useSearchParams()

  const enrollmentId = searchParams.get('enrollment_id') || ''
  const currency = searchParams.get('currency') || 'GBP'
  const amount = Number(searchParams.get('amount') || 0)

  const isNGN = currency === 'NGN'

  const formattedAmount = isNGN
    ? `₦${amount.toLocaleString()}`
    : `£${amount.toLocaleString()}`

  useEffect(() => {
    setMounted(true)
    // Fallback to localStorage if params missing
    if (!enrollmentId) {
      const id = localStorage.getItem('academy_enrollment_id')
      if (id) {
        const cur = localStorage.getItem('academy_currency') || 'GBP'
        const amt = localStorage.getItem('academy_billing_amount') || '0'
        const params = new URLSearchParams({
          enrollment_id: id,
          currency: cur,
          amount: amt,
        })
        window.location.replace(`/academy/enroll/payment?${params.toString()}`)
      }
    }
  }, [enrollmentId])

  const copyToClipboard = useCallback((value: string, field: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }, [])

  async function handlePaystack() {
    setLoadingPaystack(true)
    setError('')
    try {
      const res = await fetch('/api/academy/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_id: enrollmentId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment')
      window.location.href = data.authorization_url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoadingPaystack(false)
    }
  }

  if (!mounted) return null

  const internationalMethods = [
    {
      key: 'card' as PaymentMethod,
      emoji: '💳',
      title: 'Pay by Card',
      subtitle: 'Visa, Mastercard — powered by Paystack',
      badge: 'Instant',
      badgeColor: '#16A34A',
    },
    {
      key: 'gbp' as PaymentMethod,
      emoji: '🇬🇧',
      title: 'GBP Bank Transfer',
      subtitle: 'Faster Payment (FPS) — UK bank accounts',
      badge: 'FPS',
      badgeColor: '#062850',
    },
    {
      key: 'eur' as PaymentMethod,
      emoji: '🇪🇺',
      title: 'EUR Bank Transfer',
      subtitle: 'SEPA & SEPA Instant — European bank accounts',
      badge: 'SEPA',
      badgeColor: '#1D4469',
    },
  ]

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/academy" className="inline-block mb-6">
            <Image
              src="/logo.png"
              alt="Averra Knowledge Academy"
              width={200}
              height={200}
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
            Complete Your Payment
          </h1>
          <p className="text-gray-500 text-sm">
            Choose how you would like to pay to activate your enrolment
          </p>
          {amount > 0 && (
            <div
              className="inline-block mt-4 px-6 py-3 rounded-2xl border-2"
              style={{ borderColor: '#497296', backgroundColor: '#EBF4FF' }}
            >
              <p className="text-xs text-gray-500 mb-0.5">Amount Due</p>
              <p className="text-2xl font-bold" style={{ color: '#062850' }}>
                {formattedAmount}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* NGN — Paystack only */}
        {isNGN && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="px-8 py-5" style={{ backgroundColor: '#062850' }}>
              <h2 className="font-bold text-white text-lg">💳 Pay with Card</h2>
              <p className="text-blue-300 text-sm mt-0.5">Powered by Paystack — Visa &amp; Mastercard accepted</p>
            </div>
            <div className="px-8 py-8 text-center">
              <p className="text-gray-600 text-sm mb-6">
                You will be securely redirected to Paystack to complete your payment of{' '}
                <span className="font-bold" style={{ color: '#062850' }}>{formattedAmount}</span>.
              </p>
              <Button
                onClick={handlePaystack}
                disabled={loadingPaystack}
                className="w-full py-4 text-white font-semibold rounded-xl text-base"
                style={{ backgroundColor: '#497296' }}
              >
                {loadingPaystack
                  ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> Connecting...</>
                  : `Pay ${formattedAmount} Now →`}
              </Button>
            </div>
          </div>
        )}

        {/* International — 3 options */}
        {!isNGN && (
          <>
            {/* Method selector */}
            {!selectedMethod && (
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
                  Choose your preferred payment method:
                </p>
                {internationalMethods.map((method) => (
                  <button
                    key={method.key}
                    onClick={() => setSelectedMethod(method.key)}
                    className="w-full bg-white rounded-2xl border-2 border-gray-100 p-5 flex items-center gap-4 text-left hover:border-[#497296] transition-all hover:shadow-md group"
                  >
                    <span className="text-3xl">{method.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: '#062850' }}>
                        {method.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{method.subtitle}</p>
                    </div>
                    <span
                      className="text-xs font-bold text-white px-2 py-1 rounded-full"
                      style={{ backgroundColor: method.badgeColor }}
                    >
                      {method.badge}
                    </span>
                    <span className="text-gray-300 group-hover:text-[#497296] transition-colors">→</span>
                  </button>
                ))}
              </div>
            )}

            {/* Card payment */}
            {selectedMethod === 'card' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="px-8 py-5" style={{ backgroundColor: '#062850' }}>
                  <button
                    onClick={() => setSelectedMethod(null)}
                    className="text-blue-300 text-xs mb-2 hover:text-white transition-colors"
                  >
                    ← Back to payment options
                  </button>
                  <h2 className="font-bold text-white text-lg">💳 Pay by Card</h2>
                  <p className="text-blue-300 text-sm mt-0.5">Powered by Paystack</p>
                </div>
                <div className="px-8 py-8 text-center">
                  <p className="text-gray-600 text-sm mb-6">
                    You will be securely redirected to Paystack to complete your payment of{' '}
                    <span className="font-bold" style={{ color: '#062850' }}>{formattedAmount}</span>.
                  </p>
                  <Button
                    onClick={handlePaystack}
                    disabled={loadingPaystack}
                    className="w-full py-4 text-white font-semibold rounded-xl text-base"
                    style={{ backgroundColor: '#497296' }}
                  >
                    {loadingPaystack
                      ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> Connecting...</>
                      : `Pay ${formattedAmount} Now →`}
                  </Button>
                </div>
              </div>
            )}

            {/* GBP bank transfer */}
            {selectedMethod === 'gbp' && (
              <BankTransferCard
                title="GBP Bank Transfer"
                subtitle="Faster Payment (FPS)"
                flag="🇬🇧"
                details={GBP_DETAILS}
                reference={reference}
                setReference={setReference}
                copiedField={copiedField}
                copyToClipboard={copyToClipboard}
                onBack={() => setSelectedMethod(null)}
                methodNote="Please send via Faster Payment (FPS) for instant transfer"
              />
            )}

            {/* EUR bank transfer */}
            {selectedMethod === 'eur' && (
              <BankTransferCard
                title="EUR Bank Transfer"
                subtitle="SEPA & SEPA Instant"
                flag="🇪🇺"
                details={EUR_DETAILS}
                reference={reference}
                setReference={setReference}
                copiedField={copiedField}
                copyToClipboard={copyToClipboard}
                onBack={() => setSelectedMethod(null)}
                methodNote="Please send via SEPA Instant for fastest processing"
              />
            )}
          </>
        )}

        {/* After payment — send proof */}
        {(isNGN || selectedMethod === 'gbp' || selectedMethod === 'eur') && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-sm mb-3" style={{ color: '#062850' }}>
              📤 After Payment — Send Proof To:
            </h3>
            <div className="space-y-2">
              <a
                href="https://wa.me/2349033440966"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors"
              >
                <span className="text-xl">💬</span>
                <div>
                  <p className="font-semibold text-sm text-green-700">WhatsApp (Fastest)</p>
                  <p className="text-xs text-green-600">+234 903 344 0966</p>
                </div>
              </a>
              <a
                href="mailto:info@averraknowledgeacademy.com"
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                <span className="text-xl">📧</span>
                <div>
                  <p className="font-semibold text-sm text-blue-700">Email</p>
                  <p className="text-xs text-blue-600">info@averraknowledgeacademy.com</p>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/2349033440966"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              className="w-full text-white font-semibold py-3 rounded-xl"
              style={{ backgroundColor: '#16A34A' }}
            >
              💬 Send Payment Proof
            </Button>
          </a>
          <Link href="/dashboard/academy" className="flex-1">
            <Button
              className="w-full text-white font-semibold py-3 rounded-xl"
              style={{ backgroundColor: '#062850' }}
            >
              Go to My Dashboard →
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Questions? Contact us on WhatsApp or email — we respond within 2 hours.
        </p>

      </div>
    </div>
  )
}


export default function AcademyPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#497296] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading payment page...</p>
        </div>
      </div>
    }>
      <AcademyPaymentInner />
    </Suspense>
  )
}

// ─── Reusable bank transfer card ───────────────────────────────────────────
function BankTransferCard({
  title,
  subtitle,
  flag,
  details,
  reference,
  setReference,
  copiedField,
  copyToClipboard,
  onBack,
  methodNote,
}: {
  title: string
  subtitle: string
  flag: string
  details: { label: string; value: string }[]
  reference: string
  setReference: (v: string) => void
  copiedField: string | null
  copyToClipboard: (value: string, field: string) => void
  onBack: () => void
  methodNote: string
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="px-8 py-5" style={{ backgroundColor: '#062850' }}>
        <button
          onClick={onBack}
          className="text-blue-300 text-xs mb-2 hover:text-white transition-colors"
        >
          ← Back to payment options
        </button>
        <h2 className="font-bold text-white text-lg">
          {flag} {title}
        </h2>
        <p className="text-blue-300 text-sm mt-0.5">{subtitle}</p>
      </div>

      <div className="px-8 py-6 space-y-4">
        <div
          className="rounded-2xl p-6 border-2"
          style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}
        >
          <h3 className="font-bold mb-4" style={{ color: '#062850' }}>
            🏦 Bank Account Details
          </h3>
          <div className="space-y-3">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 group"
              >
                <div>
                  <p className="text-xs text-gray-500">{detail.label}</p>
                  <p className="font-bold text-sm font-mono mt-0.5" style={{ color: '#062850' }}>
                    {detail.value}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(detail.value, detail.label)}
                  className="p-2 rounded-lg transition-all hover:bg-gray-100 opacity-0 group-hover:opacity-100"
                >
                  {copiedField === detail.label
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            ))}
          </div>

          {/* Reference */}
          <div
            className="mt-4 p-4 rounded-xl border-2 border-dashed"
            style={{ borderColor: '#497296' }}
          >
            <p className="text-xs text-gray-500 mb-2">
              Your Payment Reference
              <span className="ml-1 text-[#497296]">(you can personalise this)</span>
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="flex-1 font-bold font-mono text-center px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#497296]"
                style={{ color: '#062850' }}
              />
              <button
                onClick={() => copyToClipboard(reference, 'ref')}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all"
              >
                {copiedField === 'ref'
                  ? <Check className="w-4 h-4 text-green-500" />
                  : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <div
            className="mt-4 p-3 rounded-xl text-sm text-center font-semibold"
            style={{ backgroundColor: '#EBF4FF', color: '#062850' }}
          >
            ⚡ {methodNote}
          </div>
        </div>
      </div>
    </div>
  )
}
