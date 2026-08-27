import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Averra Knowledge Academy <info@averraknowledgeacademy.com>'
const ADMIN_EMAIL = 'info@averraknowledgeacademy.com'
const BRAND_COLOR = '#062850'
const ACCENT_COLOR = '#497296'

function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Averra Knowledge Academy</title>
    </head>
    <body style="margin:0;padding:0;background:#F0F6FB;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F6FB;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

            <!-- Header -->
            <tr>
              <td style="background:${BRAND_COLOR};border-radius:16px 16px 0 0;padding:32px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:bold;">
                  Averra Knowledge Academy
                </h1>
                <p style="color:#97C3E0;margin:6px 0 0;font-size:13px;">
                  Africa's Complete Academic Success Platform
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="background:#ffffff;padding:36px 40px;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:${BRAND_COLOR};border-radius:0 0 16px 16px;padding:24px;text-align:center;">
                <p style="color:#97C3E0;margin:0;font-size:12px;">
                  &copy; ${new Date().getFullYear()} Averra Knowledge Academy. All rights reserved.
                </p>
                <p style="color:#497296;margin:8px 0 0;font-size:12px;">
                  info@averraknowledgeacademy.com &bull; +234 903 344 0966
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `
}

// ── 1. Welcome email after enrollment ────────────────────────────────────
export async function sendEnrollmentWelcomeEmail({
  to,
  parentName,
  currency,
  billingAmount,
  billingPeriod,
  classType,
  learnerNames,
}: {
  to: string
  parentName: string
  currency: string
  billingAmount: number
  billingPeriod: string
  classType: string
  learnerNames: string[]
}) {
  const symbol = currency === 'NGN' ? '₦' : '£'
  const formattedAmount = `${symbol}${Number(billingAmount).toLocaleString()}`
  const periodMap: Record<string, string> = {
    monthly: 'Monthly',
    termly: 'Termly (3 months)',
    annually: 'Annually (12 months)',
  }
  const classTypeMap: Record<string, string> = {
    private: 'Private (1-on-1)',
    general: 'General Class',
  }

  const bankDetails = currency === 'NGN'
    ? `<p style="margin:8px 0;color:#374151;font-size:14px;">
        Pay securely via <strong>Paystack</strong> on your dashboard.
       </p>`
    : `
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F6FB;border-radius:10px;padding:16px;margin-top:8px;">
        <tr><td style="padding:4px 0;font-size:13px;color:#6B7280;">Account Name:</td><td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">Baridubari Joshua Joe-Amos</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#6B7280;">Account Number:</td><td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">35651420</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#6B7280;">Sort Code:</td><td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">04-13-07</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#6B7280;">IBAN:</td><td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">GB68CLJU04130735651420</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#6B7280;">Bank:</td><td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">Clear Junction Limited</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#6B7280;">GBP Method:</td><td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">Faster Payment (FPS)</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#6B7280;">EUR Method:</td><td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">SEPA &amp; SEPA Instant</td></tr>
      </table>
      <p style="margin:12px 0 0;font-size:13px;color:#6B7280;">
        Reference: <strong style="color:${BRAND_COLOR};">AVERRA-ACAD</strong> &mdash;
        After payment, send proof to WhatsApp: <strong>+234 903 344 0966</strong>
      </p>
    `

  const content = `
    <h2 style="color:${BRAND_COLOR};margin:0 0 8px;font-size:20px;">
      Welcome to Averra Academy, ${parentName.split(' ')[0]}! 🎉
    </h2>
    <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Your enrolment has been registered successfully.
      Complete your payment to activate your dashboard and begin classes.
    </p>

    <!-- Enrollment Summary -->
    <div style="background:#F0F6FB;border-radius:12px;padding:20px;margin-bottom:24px;">
      <h3 style="color:${BRAND_COLOR};margin:0 0 12px;font-size:15px;">Enrolment Summary</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#6B7280;">Learner(s):</td>
          <td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">${learnerNames.join(', ')}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#6B7280;">Class Type:</td>
          <td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">${classTypeMap[classType] || classType}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#6B7280;">Billing Period:</td>
          <td style="padding:4px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">${periodMap[billingPeriod] || billingPeriod}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#6B7280;">Amount Due:</td>
          <td style="padding:4px 0;font-size:16px;font-weight:bold;color:${BRAND_COLOR};">${formattedAmount}</td>
        </tr>
      </table>
    </div>

    <!-- Payment Instructions -->
    <h3 style="color:${BRAND_COLOR};margin:0 0 12px;font-size:15px;">How to Pay</h3>
    ${bankDetails}

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0 24px;">
      <a href="https://www.averraknowledgeacademy.com/dashboard/academy"
        style="background:${ACCENT_COLOR};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:15px;display:inline-block;">
        Go to My Dashboard &rarr;
      </a>
    </div>

    <!-- Next Steps -->
    <div style="border-left:4px solid ${ACCENT_COLOR};padding-left:16px;margin-bottom:24px;">
      <h3 style="color:${BRAND_COLOR};margin:0 0 10px;font-size:14px;">What happens next:</h3>
      <ol style="margin:0;padding-left:16px;color:#374151;font-size:13px;line-height:2;">
        <li>Make your payment</li>
        <li>Send proof to our WhatsApp: +234 903 344 0966</li>
        <li>We activate your dashboard within 2 hours</li>
        <li>We contact you within 24 hours to confirm timetable</li>
        <li>Classes begin within 48 hours of timetable confirmation</li>
      </ol>
    </div>

    <p style="color:#6B7280;font-size:13px;margin:0;">
      Questions? WhatsApp us on <strong>+234 903 344 0966</strong> or reply to this email.
    </p>
  `

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Your Averra Academy Enrolment is Registered!',
    html: baseTemplate(content),
  })
}

// ── 2. Admin alert on new enrollment ─────────────────────────────────────
export async function sendAdminEnrollmentAlert({
  parentName,
  parentEmail,
  currency,
  billingAmount,
  billingPeriod,
  classType,
  learnerCount,
  enrollmentId,
}: {
  parentName: string
  parentEmail: string
  currency: string
  billingAmount: number
  billingPeriod: string
  classType: string
  learnerCount: number
  enrollmentId: string
}) {
  const symbol = currency === 'NGN' ? '₦' : '£'
  const formattedAmount = `${symbol}${Number(billingAmount).toLocaleString()}`

  const content = `
    <h2 style="color:${BRAND_COLOR};margin:0 0 8px;font-size:20px;">
      New Academy Enrolment Received
    </h2>
    <p style="color:#374151;font-size:14px;margin:0 0 24px;">
      A new enrolment has been submitted and is awaiting payment confirmation.
    </p>

    <div style="background:#F0F6FB;border-radius:12px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:5px 0;font-size:13px;color:#6B7280;width:140px;">Parent/Student:</td><td style="padding:5px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">${parentName}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6B7280;">Email:</td><td style="padding:5px 0;font-size:13px;color:${BRAND_COLOR};">${parentEmail}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6B7280;">Learners:</td><td style="padding:5px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">${learnerCount}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6B7280;">Class Type:</td><td style="padding:5px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">${classType}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6B7280;">Billing Period:</td><td style="padding:5px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">${billingPeriod}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6B7280;">Currency:</td><td style="padding:5px 0;font-size:13px;font-weight:bold;color:${BRAND_COLOR};">${currency}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6B7280;">Amount Due:</td><td style="padding:5px 0;font-size:16px;font-weight:bold;color:${BRAND_COLOR};">${formattedAmount}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6B7280;">Enrollment ID:</td><td style="padding:5px 0;font-size:12px;font-family:monospace;color:#6B7280;">${enrollmentId}</td></tr>
      </table>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="https://www.averraknowledgeacademy.com/admin/dashboard/academy/${enrollmentId}"
        style="background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:15px;display:inline-block;">
        View Enrolment in Admin &rarr;
      </a>
    </div>
  `

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Academy Enrolment — ${parentName} (${formattedAmount})`,
    html: baseTemplate(content),
  })
}

// ── 3. Payment confirmed email ────────────────────────────────────────────
export async function sendPaymentConfirmedEmail({
  to,
  parentName,
  currency,
  billingAmount,
  paymentMethod,
}: {
  to: string
  parentName: string
  currency: string
  billingAmount: number
  paymentMethod: 'paystack' | 'bank_transfer'
}) {
  const symbol = currency === 'NGN' ? '₦' : '£'
  const formattedAmount = `${symbol}${Number(billingAmount).toLocaleString()}`

  const content = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:#F0FDF4;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;">
        ✅
      </div>
    </div>

    <h2 style="color:${BRAND_COLOR};margin:0 0 8px;font-size:20px;text-align:center;">
      Payment Confirmed, ${parentName.split(' ')[0]}!
    </h2>
    <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;text-align:center;">
      Your payment of <strong>${formattedAmount}</strong> has been confirmed.
      Your Averra Academy enrolment is now <strong style="color:#16A34A;">active</strong>.
    </p>

    <!-- What happens next -->
    <div style="background:#F0FDF4;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #16A34A;">
      <h3 style="color:#16A34A;margin:0 0 12px;font-size:14px;">What happens next:</h3>
      <ol style="margin:0;padding-left:16px;color:#374151;font-size:13px;line-height:2.2;">
        <li>Our team will contact you <strong>within 24 hours</strong> to confirm your timetable</li>
        <li>Your learner&rsquo;s <strong>Baseline Assessment</strong> will be scheduled</li>
        <li>Classes begin <strong>within 48 hours</strong> of timetable confirmation</li>
        <li>You will receive a welcome pack with all class details</li>
      </ol>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0 24px;">
      <a href="https://www.averraknowledgeacademy.com/dashboard/academy"
        style="background:${ACCENT_COLOR};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:15px;display:inline-block;">
        View My Dashboard &rarr;
      </a>
    </div>

    <p style="color:#6B7280;font-size:13px;margin:0;text-align:center;">
      Questions? WhatsApp us on <strong>+234 903 344 0966</strong>
    </p>
  `

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Payment Confirmed — Averra Academy Enrolment Active!',
    html: baseTemplate(content),
  })
}
