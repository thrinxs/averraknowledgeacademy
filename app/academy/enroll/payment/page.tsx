import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Payment Instructions — Averra Academy',
}

export default function AcademyPaymentPage() {
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
            className="w-16 h-16 rounded-full flex items-center
            justify-center mx-auto mb-4 text-2xl"
            style={{ backgroundColor: '#062850' }}
          >
            🎉
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: '#062850' }}
          >
            Account Created Successfully!
          </h1>
          <p className="text-gray-500">
            One last step — complete your payment to
            activate your enrollment.
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
              Bank transfer — secure and simple
            </p>
          </div>

          <div className="px-8 py-6 space-y-6">

            {/* Steps */}
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Transfer Your Payment',
                  desc: 'Make a bank transfer to the account details below.',
                },
                {
                  step: '2',
                  title: 'Use Your Reference',
                  desc: 'Include your reference so we can identify your payment instantly.',
                },
                {
                  step: '3',
                  title: 'Send Proof of Payment',
                  desc: 'Send your payment receipt/screenshot to our WhatsApp or email.',
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
                    <p className="font-semibold text-sm"
                    style={{ color: '#062850' }}>
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500
                    mt-0.5">
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
              <h3 className="font-bold mb-4"
              style={{ color: '#062850' }}>
                🏦 Bank Account Details (GBP)
              </h3>

              <div className="space-y-3">
                {[
                  {
                    label: 'Account Name',
                    value: 'Baridubari Joshua Joe-Amos',
                  },
                  {
                    label: 'Account Number',
                    value: '35651420',
                  },
                  {
                    label: 'Sort Code',
                    value: '04-13-07',
                  },
                  {
                    label: 'IBAN',
                    value: 'GB68CLJU0413073565420',
                  },
                  {
                    label: 'Bank',
                    value: 'Grey (UK Account)',
                  },
                ].map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between
                    bg-white rounded-xl px-4 py-3 border
                    border-gray-100"
                  >
                    <span className="text-sm text-gray-500">
                      {detail.label}
                    </span>
                    <span className="font-bold text-sm
                    font-mono"
                    style={{ color: '#062850' }}>
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reference */}
              <div
                className="mt-4 p-4 rounded-xl text-center
                border-2 border-dashed"
                style={{ borderColor: '#497296' }}
              >
                <p className="text-xs text-gray-500 mb-1">
                  Your Payment Reference
                </p>
                <p
                  className="font-bold text-lg font-mono"
                  style={{ color: '#062850' }}
                >
                  AVERRA-ACAD
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Include this exact reference with your
                  transfer
                </p>
              </div>
            </div>

            {/* Send Proof */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: '#F0F6FB' }}
            >
              <h3 className="font-bold text-sm mb-3"
              style={{ color: '#062850' }}>
                📤 After Payment — Send Proof To:
              </h3>
              <div className="space-y-2">
                <a
                  href="https://wa.me/2349033440966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3
                  bg-green-50 rounded-xl border
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
                  className="flex items-center gap-3 p-3
                  bg-blue-50 rounded-xl border
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

            {/* What Happens Next */}
            <div
              className="rounded-xl p-5 border border-gray-100"
            >
              <h3 className="font-bold text-sm mb-3"
              style={{ color: '#062850' }}>
                ✅ What Happens After We Confirm Payment:
              </h3>
              <ul className="space-y-2">
                {[
                  'Your dashboard will be fully activated',
                  'You will receive a welcome email',
                  'Our team will contact you within 24 hours to confirm your timetable',
                  'Your child\'s baseline assessment will be scheduled',
                  'Classes begin within 48 hours of timetable confirmation',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2
                    text-sm text-gray-600"
                  >
                    <span className="text-green-500
                    font-bold flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard" className="flex-1">
            <Button
              className="w-full text-white font-semibold
              py-3 rounded-xl"
              style={{ backgroundColor: '#062850' }}
            >
              Go to My Dashboard →
            </Button>
          </Link>
          <Link href="/academy" className="flex-1">
            <Button
              variant="outline"
              className="w-full py-3 rounded-xl"
            >
              Back to Academy Page
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