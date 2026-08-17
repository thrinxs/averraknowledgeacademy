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
              Welcome to Averra Knowledge Academy. By
              accessing or using our website, services,
              and platform at averraknowledgeacademy.com,
              you agree to be bound by these Terms of
              Service. If you do not agree to these terms,
              please do not use our services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Averra Knowledge Academy provides scholarship
              matching, practical skills training, career
              training and coaching, and academic tutoring
              services through Averra Academy. These terms
              govern your use of all services offered
              through our platform.
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
                based on your academic profile and
                preferences. Each package includes exactly
                5 scholarship matches.
              </li>
              <li>
                <strong>Skills Training:</strong>{' '}
                Practical courses including typing, computer
                skills, website building, and more.
              </li>
              <li>
                <strong>Career Training & Coaching:</strong>{' '}
                Career tests, industrial training, and
                career switch programmes.
              </li>
              <li>
                <strong>Averra Academy — Academic Tutoring:</strong>{' '}
                Live and recorded academic tutoring for
                primary, secondary, and university-level
                learners. Sessions are delivered in private,
                small class, or classroom formats. The
                Averra Super Curriculum — a fusion of seven
                of the world&apos;s best education systems —
                is applied to every learner&apos;s programme.
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
              To access certain services, you must create
              an account. You agree to provide accurate,
              current, and complete information during
              registration and to update such information
              to keep it accurate. You are responsible for
              safeguarding your password and for any
              activities or actions under your account.
            </p>
            <p className="text-gray-600 leading-relaxed">
              For Averra Academy enrolments, the parent or
              guardian must create the account. By
              enrolling a child, the parent or guardian
              confirms that they have the legal authority
              to do so and that all information provided
              about the child is accurate.
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
              Scholarship and skills services are priced in
              Nigerian Naira (₦) and processed through
              Paystack. Averra Academy tutoring services
              are priced in British Pounds Sterling (£) and
              are paid via bank transfer to our designated
              GBP account. All prices are subject to change
              with reasonable notice.
            </p>

            <h3
              className="text-base font-semibold mt-4 mb-2"
              style={{ color: '#325E84' }}
            >
              Scholarship Service Packages (₦):
            </h3>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1">
              <li>Basic — ₦30,000</li>
              <li>Standard — ₦50,000</li>
              <li>Premium — ₦150,000</li>
            </ul>

            <h3
              className="text-base font-semibold mt-4 mb-2"
              style={{ color: '#325E84' }}
            >
              Averra Academy — Hourly Tutoring Rates (£):
            </h3>
            <div className="overflow-x-auto mt-2">
              <table className="text-sm text-gray-600
              border border-gray-200 rounded-xl w-full">
                <thead>
                  <tr
                    style={{ backgroundColor: '#F0F6FB' }}
                  >
                    <th className="px-4 py-2 text-left
                    font-semibold border-b border-gray-200">
                      Format
                    </th>
                    <th className="px-4 py-2 text-left
                    font-semibold border-b border-gray-200">
                      Primary
                    </th>
                    <th className="px-4 py-2 text-left
                    font-semibold border-b border-gray-200">
                      Secondary
                    </th>
                    <th className="px-4 py-2 text-left
                    font-semibold border-b border-gray-200">
                      University
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      format: 'Private (1 student)',
                      primary: '£15/hr',
                      secondary: '£20/hr',
                      university: '£30/hr',
                    },
                    {
                      format: 'Small Class (2–5)',
                      primary: '£10/hr/child',
                      secondary: '£14/hr/child',
                      university: '£20/hr/child',
                    },
                    {
                      format: 'Classroom (up to 20)',
                      primary: '£5/hr/child',
                      secondary: '£7/hr/child',
                      university: '£10/hr/child',
                    },
                  ].map((row) => (
                    <tr
                      key={row.format}
                      className="border-b border-gray-100"
                    >
                      <td className="px-4 py-2 font-medium">
                        {row.format}
                      </td>
                      <td className="px-4 py-2">
                        {row.primary}
                      </td>
                      <td className="px-4 py-2">
                        {row.secondary}
                      </td>
                      <td className="px-4 py-2">
                        {row.university}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 leading-relaxed mt-3">
              A one-time non-refundable registration fee
              of £25 applies to all Averra Academy
              enrolments. Monthly fees are calculated
              based on the formula: hourly rate × lesson
              duration × number of subjects × lessons per
              subject per week × 4.
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              Skills course and training prices are set by
              Averra Knowledge Academy. A minimum course
              price of ₦3,000 applies to all courses on
              the platform.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              5. Refund Policy
            </h2>

            <h3
              className="text-base font-semibold mt-3 mb-2"
              style={{ color: '#325E84' }}
            >
              Scholarship Services:
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We do not offer refunds once payment is made.
              Our team begins working on your profile
              immediately after payment is confirmed. We
              commit to delivering 5 personally matched and
              manually verified scholarship options for
              every client, without exception. If
              scholarships in your preferred countries are
              not available due to your academic profile,
              we will provide matches in other suitable
              countries.
            </p>

            <h3
              className="text-base font-semibold mt-4 mb-2"
              style={{ color: '#325E84' }}
            >
              Averra Academy:
            </h3>
            <p className="text-gray-600 leading-relaxed">
              The £25 registration fee is non-refundable
              under all circumstances. Tuition fees paid
              for a billing period are non-refundable once
              classes have commenced. If classes have not
              yet commenced due to timetable coordination,
              a refund may be requested within 7 days of
              payment. Refund requests must be submitted
              in writing to
              info@averraknowledgeacademy.com and are
              subject to review and approval by Averra
              Knowledge Academy.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              6. Averra Academy — Specific Terms
            </h2>

            <h3
              className="text-base font-semibold mt-3 mb-2"
              style={{ color: '#325E84' }}
            >
              Timetable and Scheduling:
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Class schedules are confirmed by the Averra
              team within 24 hours of enrolment payment
              based on parent preferences and teacher
              availability. Averra Knowledge Academy
              reserves the right to adjust session timings
              with reasonable notice.
            </p>

            <h3
              className="text-base font-semibold mt-4 mb-2"
              style={{ color: '#325E84' }}
            >
              Averra Super Curriculum:
            </h3>
            <p className="text-gray-600 leading-relaxed">
              The Averra Super Curriculum is the
              intellectual property of Averra Knowledge
              Academy. It is a proprietary fusion of
              elements from multiple internationally
              recognised curricula. Averra Knowledge
              Academy does not claim ownership of the
              individual source curricula referenced.
            </p>

            <h3
              className="text-base font-semibold mt-4 mb-2"
              style={{ color: '#325E84' }}
            >
              Child Safeguarding:
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Averra Knowledge Academy is committed to the
              safety and wellbeing of all learners. All
              sessions are conducted in a safe, respectful,
              and professional environment. Any concerns
              relating to child safety must be reported
              immediately to info@averraknowledgeacademy.com.
            </p>

            <h3
              className="text-base font-semibold mt-4 mb-2"
              style={{ color: '#325E84' }}
            >
              Academic Outcomes:
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Averra Knowledge Academy does not guarantee
              specific academic results or examination
              outcomes. We commit to providing
              high-quality, structured teaching based on
              the Averra Super Curriculum. Academic
              progress depends on individual effort,
              attendance, and engagement.
            </p>

            <h3
              className="text-base font-semibold mt-4 mb-2"
              style={{ color: '#325E84' }}
            >
              Attendance:
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Regular attendance is essential for academic
              progress. Missed sessions are not refunded.
              If a session must be cancelled, at least
              24 hours&apos; notice is required. Averra
              Knowledge Academy will endeavour to
              reschedule missed sessions where possible,
              subject to teacher availability.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              7. Scholarship Disclaimer
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Averra Knowledge Academy does not guarantee
              that you will win or be awarded any
              scholarship. We provide research, matching,
              and preparation services to improve your
              chances. The final decision on any
              scholarship application rests with the
              scholarship provider or institution.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              8. Promo Codes
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Promo codes are subject to availability,
              expiry dates, and usage limits. Promo codes
              may be restricted to specific packages as
              determined by Averra Knowledge Academy.
              We reserve the right to modify or
              discontinue any promo code at any time.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              9. Affiliate and Trainer Programmes
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Affiliates earn a 10% commission on every
              successful referral payment. Commission
              payments are subject to verification and
              are paid out on a monthly basis. Averra
              Knowledge Academy reserves the right to
              modify commission structures with prior
              notice.
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              Trainers earn a share of course and training
              fees delivered through the platform. The
              exact revenue share structure, payment
              schedule, and eligibility criteria are
              provided to approved trainers during the
              onboarding process. Trainer earnings are
              calculated based on the course type and are
              paid out monthly. Averra Knowledge Academy
              reserves the right to adjust trainer
              compensation structures with prior notice.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              10. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on the Averra Knowledge Academy
              platform — including text, graphics, logos,
              images, course materials, the Averra Super
              Curriculum, and software — is the property
              of Averra Knowledge Academy or its content
              suppliers and is protected by intellectual
              property laws. You may not reproduce,
              distribute, or create derivative works from
              any content without prior written consent.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              11. Prohibited Conduct
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1 mt-2">
              <li>Provide false or misleading
              information</li>
              <li>Use the platform for any unlawful
              purpose</li>
              <li>Attempt to access other users&apos;
              accounts</li>
              <li>Interfere with the platform&apos;s
              operation</li>
              <li>Resell or redistribute our services
              without authorisation</li>
              <li>Use automated systems to access the
              platform</li>
              <li>Record or distribute any live tutoring
              session without express written consent</li>
              <li>Share login credentials with
              unauthorised persons</li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              12. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Averra Knowledge Academy shall not be liable
              for any indirect, incidental, special,
              consequential, or punitive damages resulting
              from your use of or inability to use the
              service. Our total liability shall not
              exceed the amount you paid for the specific
              service in question.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              13. Modifications
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms
              of Service at any time. Changes will be
              posted on this page with an updated date.
              Continued use of the platform after changes
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              14. Contact
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms
              of Service, please contact us at:
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
            className="mt-12 pt-8 border-t border-gray-200"
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