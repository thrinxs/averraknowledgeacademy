import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Averra Knowledge Academy',
  description:
    'Privacy Policy for Averra Knowledge Academy — ' +
    'how we collect, use, and protect your personal ' +
    'information.',
}

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4
      sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="mb-12">
          <p
            className="text-sm font-medium mb-2"
            style={{ color: '#497296' }}
          >
            Legal
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold
            mb-4"
            style={{ color: '#062850' }}
          >
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">
            Last updated: June {currentYear}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none
        space-y-8">

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Averra Knowledge Academy is committed to
              protecting your privacy. This Privacy Policy
              explains how we collect, use, store, and
              protect your personal information when you use
              our website and services.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              2. Information We Collect
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We collect the following types of information:
            </p>
            <h3
              className="text-base font-semibold mt-4
              mb-2"
              style={{ color: '#325E84' }}
            >
              Personal Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1">
              <li>Full name, email address, phone number,
              WhatsApp number</li>
              <li>Date of birth, gender, country, state or
              city</li>
              <li>Academic background — education level,
              institution, field of study, CGPA, test
              scores</li>
              <li>Scholarship preferences — preferred
              countries, degree level, course interests</li>
              <li>Special circumstances and reasons for
              studying abroad</li>
              <li>Account credentials (password is
              encrypted)</li>
              <li>Referral codes and promo codes used</li>
            </ul>
            <h3
              className="text-base font-semibold mt-4
              mb-2"
              style={{ color: '#325E84' }}
            >
              Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1">
              <li>Browser type and version</li>
              <li>IP address</li>
              <li>Pages visited and time spent</li>
              <li>Device information</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              3. How We Use Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1 mt-2">
              <li>Match you with relevant scholarships
              based on your profile</li>
              <li>Deliver purchased services (scholarship
              matching, skills training, career coaching)
              </li>
              <li>Communicate with you about your account,
              matches, and services</li>
              <li>Send notifications, messages, and
              emails related to your service</li>
              <li>Process payments through Paystack</li>
              <li>Track affiliate referrals and
              commissions</li>
              <li>Improve our platform and services</li>
              <li>Send scholarship tips and updates
              (only if you opted in)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              4. Data Storage and Security
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your data is stored securely on Supabase, a
              trusted cloud database platform with
              enterprise-grade security. We implement
              appropriate technical and organisational
              measures to protect your personal information
              against unauthorised access, alteration,
              disclosure, or destruction.
            </p>
            <p className="text-gray-600 leading-relaxed
            mt-2">
              Passwords are encrypted and never stored in
              plain text. Payment information is processed
              securely through Paystack — we do not store
              your card details.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              5. Data Sharing
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell, rent, or trade your personal
              information to third parties. We may share
              your information only in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1 mt-2">
              <li>
                <strong>Service providers:</strong>{' '}
                With Paystack for payment processing, Resend
                for email delivery, and Vercel for hosting —
                only as necessary to deliver our services.
              </li>
              <li>
                <strong>Legal requirements:</strong>{' '}
                When required by law, regulation, or legal
                process.
              </li>
              <li>
                <strong>With your consent:</strong>{' '}
                When you explicitly authorise us to share
                specific information.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              6. Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies to improve your experience on
              our platform. Cookies help us remember your
              preferences, keep you logged in, and analyse
              how our platform is used. You can control
              cookie settings through your browser
              preferences.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              7. Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1 mt-2">
              <li>Access the personal information we hold
              about you</li>
              <li>Request correction of inaccurate
              information</li>
              <li>Request deletion of your account and
              data</li>
              <li>Withdraw consent for marketing emails at
              any time</li>
              <li>Request a copy of your data in a
              portable format</li>
            </ul>
            <p className="text-gray-600 leading-relaxed
            mt-2">
              To exercise any of these rights, contact us
              at info@averraknowledgeacademy.com.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              8. Data Retention
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as
              long as your account is active or as needed
              to provide you services. If you request
              account deletion, we will delete your data
              within 30 days, except where retention is
              required by law or for legitimate business
              purposes.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              9. Children&apos;s Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are not directed at children
              under the age of 16. We do not knowingly
              collect personal information from children.
              If you believe a child has provided us with
              personal information, please contact us and
              we will promptly delete it.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              10. Changes to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time
              to time. Changes will be posted on this page
              with an updated date. We encourage you to
              review this policy periodically. Continued
              use of our services after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              11. Contact
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions or concerns about
              this Privacy Policy, please contact us at:
            </p>
            <ul className="list-none text-gray-600
            space-y-1 mt-2">
              <li>
                <strong>Email:</strong>{' '}
                info@averraknowledgeacademy.com
              </li>
              <li>
                <strong>Phone:</strong>{' '}
                +234 903 344 0966
              </li>
              <li>
                <strong>WhatsApp:</strong>{' '}
                +234 903 344 0966
              </li>
            </ul>
          </section>

          {/* Footer Note */}
          <div
            className="mt-12 pt-8 border-t
            border-gray-200"
          >
            <p className="text-gray-400 text-sm">
              © {currentYear} Averra Knowledge Academy.
              All Rights Reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}