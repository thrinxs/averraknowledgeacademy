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
              protecting your privacy and the privacy of
              the children in your care. This Privacy
              Policy explains how we collect, use, store,
              and protect your personal information —
              and that of your child or ward — when you
              use our website and services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              This policy applies to all services including
              our Scholarship Matching Service, Skills
              Training, Career Coaching, and Averra
              Academy academic tutoring programmes.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              2. Information We Collect
            </h2>

            <h3
              className="text-base font-semibold mt-4
              mb-2"
              style={{ color: '#325E84' }}
            >
              Personal Information — All Users
            </h3>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1">
              <li>Full name, email address, phone number,
              WhatsApp number</li>
              <li>Date of birth, gender, country,
              state or city</li>
              <li>Account credentials (password is
              encrypted and never stored in plain text)
              </li>
              <li>Referral codes and promo codes used</li>
              <li>Payment transaction references
              (we do not store card details)</li>
            </ul>

            <h3
              className="text-base font-semibold mt-4
              mb-2"
              style={{ color: '#325E84' }}
            >
              Scholarship Service — Additional Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1">
              <li>Academic background — education level,
              institution, field of study, CGPA,
              test scores</li>
              <li>Scholarship preferences — preferred
              countries, degree level, course interests
              </li>
              <li>Special circumstances and reasons for
              studying abroad</li>
            </ul>

            <h3
              className="text-base font-semibold mt-4
              mb-2"
              style={{ color: '#325E84' }}
            >
              Averra Academy — Parent / Guardian
              Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1">
              <li>Full name, email, phone and
              WhatsApp number</li>
              <li>Country of residence</li>
              <li>Relationship to child or ward</li>
              <li>Billing period and payment history</li>
              <li>Schedule preferences and timezone</li>
            </ul>

            <h3
              className="text-base font-semibold mt-4
              mb-2"
              style={{ color: '#325E84' }}
            >
              Averra Academy — Child / Learner Information
            </h3>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1">
              <li>Full name and date of birth</li>
              <li>Country of study and year group
              or class</li>
              <li>School name (optional)</li>
              <li>Subjects enrolled in</li>
              <li>Known learning needs or challenges
              (optional, provided voluntarily)</li>
              <li>Academic progress records — attendance,
              topics covered, test scores, teacher
              comments, assignments</li>
              <li>Diagnostic assessment results and
              learning profile</li>
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
              <li>Match students with relevant
              scholarships based on their profile</li>
              <li>Deliver purchased services — scholarship
              matching, skills training, career coaching,
              and academic tutoring</li>
              <li>Communicate with you about your account,
              matches, services, and timetable</li>
              <li>Send notifications, messages, and emails
              related to your service</li>
              <li>Build and maintain your child&apos;s
              academic profile, progress records,
              and personalised learning plan</li>
              <li>Conduct and record baseline assessments
              and ongoing academic progress</li>
              <li>Generate academic progress reports
              for parents and guardians</li>
              <li>Process payments through Paystack
              (NGN services) and bank transfer
              (GBP Academy services)</li>
              <li>Track affiliate referrals and
              commissions</li>
              <li>Improve our platform and services</li>
              <li>Send scholarship tips and updates
              (only if you opted in)</li>
              <li>Comply with legal obligations including
              child safeguarding requirements</li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              4. Child Data Protection
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We treat the personal information of children
              with the highest level of care and
              responsibility. The following applies
              specifically to data collected about children
              through Averra Academy:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-2 mt-2">
              <li>
                <strong>Consent:</strong>{' '}
                A parent or legal guardian must create
                the account and provide consent for any
                child under the age of 18 to use our
                services. By enrolling a child, the
                parent or guardian confirms they have
                legal authority to do so.
              </li>
              <li>
                <strong>Purpose limitation:</strong>{' '}
                Child data is used exclusively for the
                purpose of delivering and improving
                their educational programme. It is
                never used for marketing or shared with
                third parties for commercial purposes.
              </li>
              <li>
                <strong>Access:</strong>{' '}
                Only the enrolled parent or guardian,
                assigned teachers, and authorised Averra
                staff can access a child&apos;s profile
                and progress records.
              </li>
              <li>
                <strong>Retention:</strong>{' '}
                Child data is retained for the duration
                of the enrolment and for up to 12 months
                after the last session, to support
                continuity of education. Data is deleted
                on written request by the parent or
                guardian.
              </li>
              <li>
                <strong>Sessions:</strong>{' '}
                Live tutoring sessions are not recorded
                without the explicit written consent of
                the parent or guardian.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              5. Data Storage and Security
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
            <p className="text-gray-600 leading-relaxed mt-2">
              Passwords are encrypted and never stored in
              plain text. Payment information is processed
              securely — we do not store card details.
              Bank transfer references are stored for
              record-keeping purposes only.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              6. Data Sharing
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell, rent, or trade your personal
              information or your child&apos;s information
              to third parties. We may share information
              only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1 mt-2">
              <li>
                <strong>Assigned tutors:</strong>{' '}
                Teachers assigned to your child will have
                access to their academic profile, year
                group, subjects, and known learning needs
                only — solely for the purpose of
                delivering effective lessons.
              </li>
              <li>
                <strong>Service providers:</strong>{' '}
                With Paystack for payment processing,
                Resend for email delivery, and Vercel
                for hosting — only as necessary to
                deliver our services.
              </li>
              <li>
                <strong>Legal requirements:</strong>{' '}
                When required by law, regulation, or
                legal process, including child
                safeguarding obligations.
              </li>
              <li>
                <strong>With your consent:</strong>{' '}
                When you explicitly authorise us to
                share specific information.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              7. Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies to improve your experience
              on our platform. Cookies help us remember
              your preferences, keep you logged in, and
              analyse how our platform is used. You can
              control cookie settings through your browser
              preferences.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              8. Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600
            space-y-1 mt-2">
              <li>Access the personal information we
              hold about you and your child</li>
              <li>Request correction of inaccurate
              information</li>
              <li>Request deletion of your account
              and data</li>
              <li>Request deletion of your child&apos;s
              data (as their parent or legal guardian)
              </li>
              <li>Withdraw consent for marketing emails
              at any time</li>
              <li>Request a copy of your data in a
              portable format</li>
              <li>Object to processing of your data
              in certain circumstances</li>
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
              9. Data Retention
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as
              long as your account is active or as needed
              to provide you services. For Averra Academy
              learners, data is retained for up to 12
              months after the last session to support
              continuity of education. If you request
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
              10. Children&apos;s Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              For our Scholarship, Skills, and Career
              services, users must be at least 16 years
              of age or have a parent or guardian create
              their account. For Averra Academy, a parent
              or legal guardian must always enrol and
              manage the account on behalf of a child.
            </p>
            <p className="text-gray-600 leading-relaxed
            mt-2">
              We take child privacy very seriously. We
              do not use children&apos;s data for any
              purpose other than delivering their
              educational programme. If you believe a
              child has been enrolled without appropriate
              parental consent, please contact us
              immediately and we will investigate and
              act promptly.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              11. International Data Transfers
            </h2>
            <p className="text-gray-600 leading-relaxed">
              As we serve clients in multiple countries
              including the United Kingdom, Nigeria, and
              internationally, your data may be processed
              in different jurisdictions. We ensure that
              appropriate safeguards are in place for
              any international transfer of personal data
              in accordance with applicable data
              protection laws, including the UK GDPR and
              Nigeria&apos;s NDPR.
            </p>
          </section>

          <section>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: '#062850' }}
            >
              12. Changes to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time
              to time. Changes will be posted on this
              page with an updated date. We encourage you
              to review this policy periodically.
              Continued use of our services after changes
              constitutes acceptance of the updated policy.
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
              If you have any questions or concerns about
              this Privacy Policy, or wish to exercise
              your data rights, please contact us at:
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