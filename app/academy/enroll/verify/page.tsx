import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Verify Your Email — Averra Academy',
}

export default function AcademyVerifyPage() {
  return (
    <div
      className="min-h-screen flex items-center
      justify-center py-12 px-4"
      style={{ backgroundColor: '#F0F6FB' }}
    >
      <div className="max-w-md w-full text-center">

        {/* Logo */}
        <Link href="/academy" className="inline-block
        mb-8">
          <Image
            src="/logo.png"
            alt="Averra Knowledge Academy"
            width={200}
            height={200}
            className="h-16 w-auto mx-auto
            object-contain"
          />
        </Link>

        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex
          items-center justify-center mx-auto mb-6
          text-3xl"
          style={{ backgroundColor: '#062850' }}
        >
          📧
        </div>

        {/* Heading */}
        <h1
          className="text-2xl md:text-3xl font-bold
          mb-3"
          style={{ color: '#062850' }}
        >
          Check Your Email
        </h1>

        <p className="text-gray-600 mb-6
        leading-relaxed">
          We have sent a confirmation link to your
          email address. Please click the link to
          verify your account and complete your
          enrollment.
        </p>

        {/* Info Box */}
        <div
          className="rounded-2xl p-6 mb-6 text-left
          space-y-3"
          style={{ backgroundColor: '#062850' }}
        >
          <h3 className="font-bold text-white text-sm">
            What happens next:
          </h3>
          {[
            {
              step: '1',
              text: 'Open the email from Averra Knowledge Academy',
            },
            {
              step: '2',
              text: 'Click the confirmation link inside the email',
            },
            {
              step: '3',
              text: 'You will be redirected to the payment instructions page',
            },
            {
              step: '4',
              text: 'Make your payment and send proof via WhatsApp or email',
            },
            {
              step: '5',
              text: 'We activate your dashboard within 2 hours',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3"
            >
              <div
                className="w-6 h-6 rounded-full flex
                items-center justify-center text-xs
                font-bold text-white flex-shrink-0"
                style={{ backgroundColor: '#497296' }}
              >
                {item.step}
              </div>
              <p className="text-blue-200 text-sm
              leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Spam Note */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: '#EBF4FF' }}
        >
          <p
            className="text-sm"
            style={{ color: '#062850' }}
          >
            <strong>Can&apos;t find the email?</strong>
            <br />
            Check your spam or junk folder. The email
            comes from{' '}
            <span className="font-medium">
              info@averraknowledgeacademy.com
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="https://wa.me/2349033440966"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="w-full text-white font-semibold
              py-3 rounded-xl"
              style={{ backgroundColor: '#062850' }}
            >
              Need Help? WhatsApp Us
            </Button>
          </a>
          <Link href="/academy">
            <Button
              variant="outline"
              className="w-full py-3 rounded-xl"
            >
              Back to Academy Page
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}