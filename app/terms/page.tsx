import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Averra Knowledge Academy',
  description:
    'Terms of Service for Averra Knowledge Academy — ' +
    'scholarships, skills training, career coaching, ' +
    'and academic learning services.',
}

export default function TermsPage() {
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
            Terms of Service
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
              Welcome to Averra Knowledge Academy. By accessing
              or using our website, services, and platform at
              averraknowledgeacademy.com, you agree to be bound
              by these Terms of Service. If you do not agree to
              these terms, please do not use our services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Averra Knowledge Academy provides scholarship
              matching, practical skills training, career
              training and coaching, and digital academic
              learning services. These terms govern your use of
              all services offered through our platform.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              2. Services
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our services include but are not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-2 mt-2">
              <li>
                <strong>Scholarship Matching Service:</strong>{' '}
                We research, match, and verify scholarships
                based on your academic profile and preferences.
                Each package includes exactly 5 scholarship
                matches.
              </li>
              <li>
                <strong>Skills Training:</strong>{' '}
                Practical courses including typing, computer
                skills, website building, and more.
              </li>
              <li>
                <strong>Career Training & Coaching:</strong>{' '}
                Career tests, industrial training, and career
                switch programmes.
              </li>
              <li>
                <strong>Averra Academy:</strong>{' '}
                Digital academic learning (coming soon).
                </li>
                <li>
                <strong>Affiliate Programme:</strong>{' '}
                Earn commissions by referring clients to
                Averra Knowledge Academy services.
              </li>
              <li>
                <strong>Trainer Programme:</strong>{' '}
                Deliver courses on the platform and earn
                a share of course fees. Full details
                provided upon application.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              3. Account Registration
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To access certain services, you must create an
              account. You agree to provide accurate, current,
              and complete information during registration and
              to update such information to keep it accurate.
              You are responsible for safeguarding your password
              and for any activities or actions under your
              account.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              4. Payments and Pricing
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All payments are processed securely through
              Paystack. Prices are displayed in Nigerian Naira
              (₦) and are subject to change without prior
              notice. Payment is required before services are
              delivered.
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              Scholarship service packages:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1 mt-2">
              <li>Basic — ₦30,000</li>
              <li>Standard — ₦50,000</li>
              <li>Premium — ₦150,000</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-2">
              Skills course and training prices are set by
              Averra Knowledge Academy and displayed on the
              relevant course or service page. A minimum
              course price of ₦3,000 applies to all courses
              on the platform.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              5. Refund Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We do not offer refunds once payment is made. Our
              team begins working on your profile immediately
              after payment is confirmed. What we commit to is
              delivering 5 personally matched and manually
              verified scholarship options for every client,
              without exception. If scholarships in your
              preferred countries are not available due to your
              academic profile, we will provide matches in
              other suitable countries.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              6. Scholarship Disclaimer
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Averra Knowledge Academy does not guarantee that
              you will win or be awarded any scholarship. We
              provide research, matching, and preparation
              services to improve your chances. The final
              decision on any scholarship application rests
              with the scholarship provider or institution.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              7. Promo Codes
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Promo codes are subject to availability, expiry
              dates, and usage limits. Promo codes may be
              restricted to specific packages as determined by
              Averra Knowledge Academy. We reserve the right to
              modify or discontinue any promo code at any time.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              8. Affiliate and Trainer Programmes
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Affiliates earn a 10% commission on every
              successful referral payment. Commission payments
              are subject to verification and are paid out
              on a monthly basis. Averra Knowledge Academy
              reserves the right to modify commission
              structures with prior notice.
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              Trainers earn a share of course and training
              fees delivered through the platform. The exact
              revenue share structure, payment schedule, and
              eligibility criteria are provided to approved
              trainers during the onboarding process. Trainer
              earnings are calculated based on the course
              type — fixed-price, subscription-based, or
              live training sessions — and are paid out
              monthly. Averra Knowledge Academy reserves the
              right to adjust trainer compensation structures
              with prior notice to affected trainers.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              9. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on the Averra Knowledge Academy
              platform — including text, graphics, logos,
              images, course materials, and software — is the
              property of Averra Knowledge Academy or its
              content suppliers and is protected by
              intellectual property laws. You may not
              reproduce, distribute, or create derivative
              works from any content without prior written
              consent.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              10. Prohibited Conduct
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1 mt-2">
              <li>Provide false or misleading information</li>
              <li>Use the platform for any unlawful purpose</li>
              <li>Attempt to access other users&apos; accounts</li>
              <li>Interfere with the platform&apos;s operation</li>
              <li>Resell or redistribute our services without
              authorisation</li>
              <li>Use automated systems to access the platform</li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              11. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Averra Knowledge Academy shall not be liable for
              any indirect, incidental, special, consequential,
              or punitive damages resulting from your use of or
              inability to use the service. Our total liability
              shall not exceed the amount you paid for the
              specific service in question.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              12. Modifications
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms of
              Service at any time. Changes will be posted on
              this page with an updated date. Continued use of
              the platform after changes constitutes acceptance
              of the modified terms.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              13. Contact
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of
              Service, please contact us at:
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