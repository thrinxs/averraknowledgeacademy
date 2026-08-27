'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Copy, Check, Loader2 } from 'lucide-react'
import ExchangeRateDisplay from '@/components/academy/ExchangeRateDisplay'
import PaystackFeeNotice from '@/components/academy/PaystackFeeNotice'

const GBP_DETAILS = [
  { label: 'Account Name',   value: 'Baridubari Joshua Joe-Amos' },
  { label: 'Account Number', value: '35651420' },
  { label: 'Sort Code',      value: '04-13-07' },
  { label: 'IBAN',           value: 'GB68CLJU04130735651420' },
  { label: 'Bank',           value: 'Clear Junction Limited' },
  { label: 'Payment Method', value: 'Faster Payment (FPS)' },
]

const EUR_DETAILS = [
  { label: 'Account Name',   value: 'Baridubari Joshua Joe-Amos' },
  { label: 'Account Number', value: '35651420' },
  { label: 'Sort Code',      value: '04-13-07' },
  { label: 'IBAN',           value: 'GB68CLJU04130735651420' },
  { label: 'Bank',           value: 'Clear Junction Limited' },
  { label: 'Payment Method', value: 'SEPA & SEPA Instant' },
]

type Method = 'paystack' | 'gbp' | 'eur' | null

function AcademyPaymentInner() {
  const [mounted, setMounted]               = useState(false)
  const [method, setMethod]                 = useState<Method>(null)
  const [reference, setReference]           = useState('AVERRA-ACAD')
  const [copiedField, setCopiedField]       = useState<string | null>(null)
  const [loadingPS, setLoadingPS]           = useState(false)
  const [error, setError]                   = useState('')
  const [ngnAmount, setNgnAmount]           = useState(0)

  const sp            = useSearchParams()
  const enrollmentId  = sp.get('enrollment_id') || ''
  const currency      = sp.get('currency') || 'GBP'
  const amount        = Number(sp.get('amount') || 0)
  const preNgn        = Number(sp.get('ngn_amount') || 0)
  const isNGN         = currency === 'NGN'
  const symbol        = isNGN ? '\u20a6' : currency === 'GBP' ? '\u00a3' : '\u20ac'
  const formatted     = `${symbol}${amount.toLocaleString()}`
  const paystackNGN   = isNGN ? amount : ngnAmount

  useEffect(() => {
    setMounted(true)
    if (preNgn > 0) setNgnAmount(preNgn)
    if (!enrollmentId) {
      const id = localStorage.getItem('academy_enrollment_id')
      if (id) {
        const cur = localStorage.getItem('academy_currency') || 'GBP'
        const amt = localStorage.getItem('academy_billing_amount') || '0'
        window.location.replace(
          `/academy/enroll/payment?enrollment_id=${id}&currency=${cur}&amount=${amt}`
        )
      }
    }
  }, [enrollmentId, preNgn])

  const handleRateLoaded = useCallback((ngn: number) => setNgnAmount(ngn), [])
  const copy = useCallback((v: string, f: string) => {
    navigator.clipboard.writeText(v)
    setCopiedField(f)
    setTimeout(() => setCopiedField(null), 2000)
  }, [])

  async function payWithPaystack() {
    setLoadingPS(true); setError('')
    try {
      const res = await fetch('/api/academy/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_id: enrollmentId, ngn_amount: paystackNGN }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment initialization failed')
      window.location.href = data.authorization_url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoadingPS(false)
    }
  }

  if (!mounted) return null

  const psLabel = paystackNGN > 0
    ? `Pay \u20a6${paystackNGN.toLocaleString()} Now \u2192`
    : 'Loading rate...'

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/academy" className="inline-block mb-6">
            <Image src="/logo.png" alt="Averra Knowledge Academy" width={200} height={200} className="h-16 w-auto mx-auto object-contain" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>Complete Your Payment</h1>
          <p className="text-gray-500 text-sm">
            {isNGN ? 'Pay securely via Paystack to activate your enrolment.' : 'Choose your preferred payment method below.'}
          </p>
          {amount > 0 && (
            <div className="inline-block mt-4 px-6 py-3 rounded-2xl border-2" style={{ borderColor: '#497296', backgroundColor: '#EBF4FF' }}>
              <p className="text-xs text-gray-500 mb-0.5">Amount Due</p>
              <p className="text-2xl font-bold" style={{ color: '#062850' }}>{formatted}</p>
              {!isNGN && ngnAmount > 0 && (
                <p className="text-xs text-gray-500 mt-1">\u2248 \u20a6{ngnAmount.toLocaleString()} NGN</p>
              )}
            </div>
          )}
        </div>

        {!isNGN && (
          <div className="mb-4">
            <ExchangeRateDisplay currency={currency} amount={amount} onRateLoaded={handleRateLoaded} />
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">{error}</div>
        )}

        {/* NGN — Paystack only */}
        {isNGN && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="px-8 py-5" style={{ backgroundColor: '#062850' }}>
              <h2 className="font-bold text-white text-lg">\ud83d\udcb3 Pay with Card</h2>
              <p className="text-blue-300 text-sm mt-0.5">Powered by Paystack — Visa, Mastercard & Apple Pay</p>
            </div>
            <div className="px-8 py-6 space-y-4">
              <PaystackFeeNotice amountNGN={amount} isInternational={false} />
              <Button onClick={payWithPaystack} disabled={loadingPS} className="w-full py-4 text-white font-semibold rounded-xl text-base" style={{ backgroundColor: '#497296' }}>
                {loadingPS ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline" />Connecting...</> : psLabel}
              </Button>
            </div>
          </div>
        )}

        {/* International — 3 options */}
        {!isNGN && (
          <>
            {!method && (
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-2 text-center">Choose your preferred payment method:</p>

                {[
                  { key: 'paystack' as Method, emoji: '\ud83d\udcb3', title: 'Pay by Card', sub: 'Visa, Mastercard, Apple Pay — charged in NGN at live rate', badge: 'Instant', badgeColor: '#16A34A', extra: ngnAmount > 0 ? `Approx. charge: \u20a6${ngnAmount.toLocaleString()} + Paystack fee` : '' },
                  { key: 'gbp'      as Method, emoji: '\ud83c\uddec\ud83c\udde7', title: 'GBP Bank Transfer', sub: 'Faster Payment (FPS) — no processing fee', badge: 'GBP', badgeColor: '#062850', extra: '' },
                  { key: 'eur'      as Method, emoji: '\ud83c\uddea\ud83c\uddfa', title: 'EUR Bank Transfer', sub: 'SEPA & SEPA Instant — no processing fee', badge: 'EUR', badgeColor: '#1D4469', extra: '' },
                ].map((opt) => (
                  <button key={String(opt.key)} onClick={() => setMethod(opt.key)}
                    className="w-full bg-white rounded-2xl border-2 border-gray-100 p-5 flex items-center gap-4 text-left hover:border-[#497296] transition-all hover:shadow-md group"
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: '#062850' }}>{opt.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>
                      {opt.extra && <p className="text-xs font-semibold mt-1" style={{ color: '#497296' }}>{opt.extra}</p>}
                    </div>
                    <span className="text-xs font-bold text-white px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: opt.badgeColor }}>{opt.badge}</span>
                    <span className="text-gray-300 group-hover:text-[#497296] transition-colors">\u2192</span>
                  </button>
                ))}
              </div>
            )}

            {/* Card */}
            {method === 'paystack' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="px-8 py-5" style={{ backgroundColor: '#062850' }}>
                  <button onClick={() => setMethod(null)} className="text-blue-300 text-xs mb-2 hover:text-white transition-colors">\u2190 Back to payment options</button>
                  <h2 className="font-bold text-white text-lg">\ud83d\udcb3 Pay by Card</h2>
                  <p className="text-blue-300 text-sm mt-0.5">Powered by Paystack</p>
                </div>
                <div className="px-8 py-6 space-y-4">
                  <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: '#FFF8F0', borderLeft: '4px solid #F59E0B' }}>
                    <p className="font-semibold text-amber-800 mb-1">\u2139\ufe0f Currency Note</p>
                    <p className="text-amber-700 text-xs">
                      Your card will be charged in <span className="font-bold">NGN (Nigerian Naira)</span>.
                      Your bank converts from {currency} at their live rate.
                      {ngnAmount > 0 && <> Approximate NGN amount: <span className="font-bold">\u20a6{ngnAmount.toLocaleString()}</span>.</>}{' '}
                      Paystack will confirm the exact amount before you pay.
                    </p>
                  </div>
                  {paystackNGN > 0 && <PaystackFeeNotice amountNGN={paystackNGN} isInternational={true} />}
                  <Button onClick={payWithPaystack} disabled={loadingPS || paystackNGN === 0} className="w-full py-4 text-white font-semibold rounded-xl text-base" style={{ backgroundColor: '#497296' }}>
                    {loadingPS ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline" />Connecting...</>
                      : paystackNGN === 0 ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline" />Loading rate...</>
                      : psLabel}
                  </Button>
                </div>
              </div>
            )}

            {method === 'gbp' && (
              <BankCard title="GBP Bank Transfer" subtitle="Faster Payment (FPS) — No processing fee" flag="\ud83c\uddec\ud83c\udde7"
                details={GBP_DETAILS} reference={reference} setReference={setReference}
                copiedField={copiedField} copy={copy} onBack={() => setMethod(null)}
                note="Please send via Faster Payment (FPS) for instant transfer" amount={formatted} />
            )}
            {method === 'eur' && (
              <BankCard title="EUR Bank Transfer" subtitle="SEPA & SEPA Instant — No processing fee" flag="\ud83c\uddea\ud83c\uddfa"
                details={EUR_DETAILS} reference={reference} setReference={setReference}
                copiedField={copiedField} copy={copy} onBack={() => setMethod(null)}
                note="Please send via SEPA Instant for fastest processing" amount={formatted} />
            )}
          </>
        )}

        {/* Send proof */}
        {(isNGN || method === 'gbp' || method === 'eur') && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-sm mb-3" style={{ color: '#062850' }}>\ud83d\udce4 After Payment — Send Proof To:</h3>
            <div className="space-y-2">
              <a href="https://wa.me/2349033440966" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                <span className="text-xl">\ud83d\udcac</span>
                <div><p className="font-semibold text-sm text-green-700">WhatsApp (Fastest)</p><p className="text-xs text-green-600">+234 903 344 0966</p></div>
              </a>
              <a href="mailto:info@averraknowledgeacademy.com" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                <span className="text-xl">\ud83d\udce7</span>
                <div><p className="font-semibold text-sm text-blue-700">Email</p><p className="text-xs text-blue-600">info@averraknowledgeacademy.com</p></div>
              </a>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <a href="https://wa.me/2349033440966" target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full text-white font-semibold py-3 rounded-xl" style={{ backgroundColor: '#16A34A' }}>\ud83d\udcac Send Payment Proof</Button>
          </a>
          <Link href="/dashboard/academy" className="flex-1">
            <Button className="w-full text-white font-semibold py-3 rounded-xl" style={{ backgroundColor: '#062850' }}>Go to My Dashboard \u2192</Button>
          </Link>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">Questions? Contact us on WhatsApp or email — we respond within 2 hours.</p>

      </div>
    </div>
  )
}

function BankCard({ title, subtitle, flag, details, reference, setReference, copiedField, copy, onBack, note, amount }: {
  title: string; subtitle: string; flag: string
  details: { label: string; value: string }[]
  reference: string; setReference: (v: string) => void
  copiedField: string | null; copy: (v: string, f: string) => void
  onBack: () => void; note: string; amount: string
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="px-8 py-5" style={{ backgroundColor: '#062850' }}>
        <button onClick={onBack} className="text-blue-300 text-xs mb-2 hover:text-white transition-colors">\u2190 Back to payment options</button>
        <h2 className="font-bold text-white text-lg">{flag} {title}</h2>
        <p className="text-blue-300 text-sm mt-0.5">{subtitle}</p>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="p-4 rounded-xl text-center border-2" style={{ borderColor: '#497296', backgroundColor: '#EBF4FF' }}>
          <p className="text-xs text-gray-500 mb-1">Please transfer exactly</p>
          <p className="text-2xl font-bold" style={{ color: '#062850' }}>{amount}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">\u2713 No processing fee on bank transfers</p>
        </div>
        <div className="rounded-2xl p-6 border-2" style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}>
          <h3 className="font-bold mb-4" style={{ color: '#062850' }}>\ud83c\udfe6 Bank Account Details</h3>
          <div className="space-y-3">
            {details.map((d) => (
              <div key={d.label} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 group">
                <div>
                  <p className="text-xs text-gray-500">{d.label}</p>
                  <p className="font-bold text-sm font-mono mt-0.5" style={{ color: '#062850' }}>{d.value}</p>
                </div>
                <button onClick={() => copy(d.value, d.label)} className="p-2 rounded-lg transition-all hover:bg-gray-100 opacity-0 group-hover:opacity-100">
                  {copiedField === d.label ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: '#497296' }}>
            <p className="text-xs text-gray-500 mb-2">Your Payment Reference <span className="text-[#497296]">(you can personalise this)</span></p>
            <div className="flex items-center gap-2">
              <input type="text" value={reference} onChange={(e) => setReference(e.target.value)}
                className="flex-1 font-bold font-mono text-center px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#497296]"
                style={{ color: '#062850' }} />
              <button onClick={() => copy(reference, 'ref')} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                {copiedField === 'ref' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-xl text-sm text-center font-semibold" style={{ backgroundColor: '#EBF4FF', color: '#062850' }}>
            \u26a1 {note}
          </div>
        </div>
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
