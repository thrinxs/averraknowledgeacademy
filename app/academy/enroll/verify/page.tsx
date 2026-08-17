import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Enrolment Registered — Averra Academy',
}

export default function AcademyVerifyPage() {
  return (
    <div
      className="min-h-screen flex items-center
      justify-center py-12 px-4"
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
          className="w-20 h-20 rounded-full flex
          items-center justify-center mx-auto mb-6
          text-3xl"
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
          Please make your payment to activate your
          dashboard and begin your classes.
        </p>

        <div
          className="rounded-2xl p-6 mb-6 text-left
          space-y-3"
          style={{ backgroundColor: '#062850' }}
        >
          <h3 className="font-bold text-white text-sm mb-4">
            What to do now:
          </h3>
          {[
            'Make your bank transfer using the payment details below',
            'Send your payment proof to our WhatsApp',
            'We activate your dashboard within 2 hours',
            'We contact you within 24 hours to confirm your timetable',
            'Your classes begin!',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex
                items-center justify-center text-xs
                font-bold text-white flex-shrink-0 mt-0.5"
                style={{ backgroundColor: '#497296' }}
              >
                {i + 1}
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-6 mb-6 text-left border-2"
          style={{
            borderColor: '#497296',
            backgroundColor: '#F0F6FB',
          }}
        >
          <p
            className="font-bold mb-4"
            style={{ color: '#062850' }}
          >
            🏦 Payment Details (GBP)
          </p>
          {[
            ['Account Name', 'Baridubari Joshua Joe-Amos'],
            ['Account Number', '35651420'],
            ['Sort Code', '04-13-07'],
            ['IBAN', 'GB68CLJU0413073565420'],
            ['Bank', 'Grey (UK Account)'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center
              py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm text-gray-500">
                {label}
              </span>
              <span
                className="text-sm font-bold font-mono"
                style={{ color: '#062850' }}
              >
                {value}
              </span>
            </div>
          ))}
          <div
            className="mt-4 p-3 rounded-xl text-center
            border-2 border-dashed"
            style={{ borderColor: '#497296' }}
          >
            <p className="text-xs text-gray-500 mb-1">
              Use this as your payment reference
            </p>
            <p
              className="font-bold font-mono"
              style={{ color: '#062850' }}
            >
              AVERRA-ACAD
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href="https://wa.me/2349033440966"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="w-full text-white font-semibold
              py-3 rounded-xl"
              style={{ backgroundColor: '#16A34A' }}
            >
              💬 Send Payment Proof on WhatsApp
            </Button>
          </a>
          <Link href="/dashboard/academy">
            <Button
              className="w-full text-white font-semibold
              py-3 rounded-xl mt-2"
              style={{ backgroundColor: '#062850' }}
            >
              Go to My Dashboard →
            </Button>
          </Link>
          <Link href="/academy">
            <Button
              variant="outline"
              className="w-full py-3 rounded-xl"
            >
              Back to Academy Page
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Questions? WhatsApp us on +234 903 344 0966
          or email info@averraknowledgeacademy.com
        </p>

      </div>
    </div>
  )
}
