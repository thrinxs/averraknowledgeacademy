'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

export default function AcademyPaymentPage() {
  const [mounted, setMounted] = useState(false)
  const [reference, setReference] = useState('AVERRA-ACAD')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  function copyToClipboard(value: string, field: string) {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (!mounted) return null

  const bankDetails = [
    { label: 'Account Name', value: 'Baridubari Joshua Joe-Amos' },
    { label: 'Account Number', value: '35651420' },
    { label: 'Sort Code', value: '04-13-07' },
    { label: 'IBAN', value: 'GB68CLJU0413073565420' },
    { label: 'Bank', value: 'Clear Junction Limited' },
    { label: 'Payment Method', value: 'Faster Payment (FPS)' },
  ]

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: '#F0F6FB' }}
    >
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
          <div
            className="w-16 h-16 rounded-full flex
            items-center justify-center mx-auto mb-4
            text-2xl"
            style={{ backgroundColor: '#062850' }}
          >
            🎉
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: '#062850' }}
          >
            Enrolment Registered!
          </h1>
          <p className="text-gray-500">
            Complete your payment to activate your
            enrolment and begin classes.
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-sm
        border border-gray-100 overflow-hidden mb-6">

          {/* Header */}
          <div
            className="px-8 py-5"
            style={{ backgroundColor: '#062850' }}
          >
            <h2 className="font-bold text-white text-lg">
              💳 Payment Instructions
            </h2>
            <p className="text-blue-300 text-sm mt-0.5">
              Bank transfer via Faster Payment (FPS)
            </p>
          </div>

          <div className="px-8 py-6 space-y-6">

            {/* Steps */}
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Make Your Transfer',
                  desc: 'Send your payment to the bank details below using Faster Payment (FPS).',
                },
                {
                  step: '2',
                  title: 'Use Your Reference',
                  desc: 'Enter your personalised reference below so we can identify your payment instantly.',
                },
                {
                  step: '3',
                  title: 'Send Proof of Payment',
                  desc: 'Send your payment screenshot or receipt to our WhatsApp or email.',
                },
                {
                  step: '4',
                  title: 'We Activate Your Account',
                  desc: 'Within 2 hours of confirmation, your dashboard will be fully activated.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-8 h-8 rounded-full flex
                    items-center justify-center text-white
                    font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: '#062850' }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: '#062850' }}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bank Details */}
            <div
              className="rounded-2xl p-6 border-2"
              style={{
                borderColor: '#497296',
                backgroundColor: '#F0F6FB',
              }}
            >
              <h3
                className="font-bold mb-4"
                style={{ color: '#062850' }}
              >
                🏦 Bank Account Details (GBP)
              </h3>

              <div className="space-y-3">
                {bankDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center
                    justify-between bg-white rounded-xl
                    px-4 py-3 border border-gray-100
                    group"
                  >
                    <div>
                      <p className="text-xs text-gray-500">
                        {detail.label}
                      </p>
                      <p
                        className="font-bold text-sm
                        font-mono mt-0.5"
                        style={{ color: '#062850' }}
                      >
                        {detail.value}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          detail.value,
                          detail.label
                        )
                      }
                      className="p-2 rounded-lg
                      transition-all hover:bg-gray-100
                      opacity-0 group-hover:opacity-100"
                    >
                      {copiedField === detail.label
                        ? <Check className="w-4 h-4 text-green-500" />
                        : <Copy className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                  </div>
                ))}
              </div>

              {/* Reference — Editable */}
              <div
                className="mt-4 p-4 rounded-xl border-2
                border-dashed"
                style={{ borderColor: '#497296' }}
              >
                <p className="text-xs text-gray-500 mb-2">
                  Your Payment Reference
                  <span className="ml-1 text-[#497296]">
                    (you can personalise this)
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) =>
                      setReference(e.target.value)
                    }
                    className="flex-1 font-bold font-mono
                    text-center px-3 py-2 rounded-lg
                    border border-gray-200
                    focus:outline-none focus:ring-2
                    focus:ring-[#497296]"
                    style={{ color: '#062850' }}
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(reference, 'ref')
                    }
                    className="p-2 rounded-lg border
                    border-gray-200 hover:bg-gray-100
                    transition-all"
                  >
                    {copiedField === 'ref'
                      ? <Check className="w-4 h-4 text-green-500" />
                      : <Copy className="w-4 h-4 text-gray-400" />
                    }
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2
                text-center">
                  Include this exact reference with
                  your transfer
                </p>
              </div>

              {/* FPS Note */}
              <div
                className="mt-4 p-3 rounded-xl text-sm
                text-center font-semibold"
                style={{
                  backgroundColor: '#EBF4FF',
                  color: '#062850',
                }}
              >
                ⚡ Please send via{' '}
                <span style={{ color: '#497296' }}>
                  Faster Payment (FPS)
                </span>{' '}
                for instant transfer
              </div>
            </div>

            {/* Send Proof */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: '#F0F6FB' }}
            >
              <h3
                className="font-bold text-sm mb-3"
                style={{ color: '#062850' }}
              >
                📤 After Payment — Send Proof To:
              </h3>
              <div className="space-y-2">
                <a
                  href="https://wa.me/2349033440966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3
                  p-3 bg-green-50 rounded-xl border
                  border-green-100 hover:bg-green-100
                  transition-colors"
                >
                  <span className="text-xl">💬</span>
                  <div>
                    <p className="font-semibold text-sm
                    text-green-700">
                      WhatsApp (Fastest)
                    </p>
                    <p className="text-xs text-green-600">
                      +234 903 344 0966
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:info@averraknowledgeacademy.com"
                  className="flex items-center gap-3
                  p-3 bg-blue-50 rounded-xl border
                  border-blue-100 hover:bg-blue-100
                  transition-colors"
                >
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="font-semibold text-sm
                    text-blue-700">
                      Email
                    </p>
                    <p className="text-xs text-blue-600">
                      info@averraknowledgeacademy.com
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* What happens next */}
            <div className="rounded-xl p-5 border
            border-gray-100">
              <h3
                className="font-bold text-sm mb-3"
                style={{ color: '#062850' }}
              >
                ✅ What Happens After We Confirm:
              </h3>
              <ul className="space-y-2">
                {[
                  'Your dashboard will be fully activated',
                  'Our team will contact you within 24 hours to confirm your timetable',
                  'Your learner\'s baseline assessment will be scheduled',
                  'Classes begin within 48 hours of timetable confirmation',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2
                    text-sm text-gray-600"
                  >
                    <span className="text-green-500
                    font-bold flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/2349033440966"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              className="w-full text-white font-semibold
              py-3 rounded-xl"
              style={{ backgroundColor: '#16A34A' }}
            >
              💬 Send Payment Proof
            </Button>
          </a>
          <Link href="/dashboard/academy" className="flex-1">
            <Button
              className="w-full text-white font-semibold
              py-3 rounded-xl"
              style={{ backgroundColor: '#062850' }}
            >
              Go to My Dashboard →
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400
        mt-6">
          Questions? Contact us on WhatsApp or email —
          we respond within 2 hours.
        </p>

      </div>
    </div>
  )
}
