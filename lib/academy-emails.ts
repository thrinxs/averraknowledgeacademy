import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Averra Knowledge Academy <info@averraknowledgeacademy.com>'
const ADMIN_EMAIL = 'info@averraknowledgeacademy.com'
const BASE_URL = 'https://www.averraknowledgeacademy.com'
const BRAND_COLOR = '#062850'
const ACCENT_COLOR = '#497296'
const LOGO_URL = `${BASE_URL}/logo.png`

// Pick student image based on learner year group codes
function getAcademyImage(learners: { year_group_code?: string }[]): string {
  if (!learners || learners.length === 0) {
    return `${BASE_URL}/academy/students/middle.png`
  }
  const code = learners[0]?.year_group_code || ''
  // Primary: P1-P6, Y1-Y6, Grade1-6
  const primaryCodes = ['P1','P2','P3','P4','P5','P6','Y1','Y2','Y3','Y4','Y5','Y6','G1','G2','G3','G4','G5','G6']
  // Senior: SS1-SS3, Y12-Y13, G11-G12
  const seniorCodes = ['SS1','SS2','SS3','Y12','Y13','G11','G12','A1','A2']
  const upper = code.toUpperCase()
  if (primaryCodes.some(c => upper.includes(c))) return `${BASE_URL}/academy/students/primary.png`
  if (seniorCodes.some(c => upper.includes(c))) return `${BASE_URL}/academy/students/senior.png`
  return `${BASE_URL}/academy/students/middle.png`
}

function baseTemplate(content: string, heroImageUrl?: string): string {
  const heroSection = heroImageUrl ? `
    <tr>
      <td style="padding:0;line-height:0;">
        <img
          src="${heroImageUrl}"
          alt="Averra Academy Students"
          width="600"
          style="width:100%;max-width:600px;height:220px;object-fit:cover;display:block;"
        />
      </td>
    </tr>
  ` : ''

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Averra Knowledge Academy</title>
    </head>
    <body style="margin:0;padding:0;background-color:#F0F6FB;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F6FB;padding:40px 16px;">
        <tr><td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(6,40,80,0.10);">

            <!-- Logo Header -->
            <tr>
              <td style="background-color:${BRAND_COLOR};padding:28px 40px;text-align:center;">
                <img
                  src="${LOGO_URL}"
                  alt="Averra Knowledge Academy"
                  width="72"
                  height="72"
                  style="display:inline-block;width:72px;height:72px;object-fit:contain;"
                />
                <p style="color:#97C3E0;margin:10px 0 0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:bold;">
                  Averra Knowledge Academy
                </p>
              </td>
            </tr>

            <!-- Hero Image -->
            ${heroSection}

            <!-- Body -->
            <tr>
              <td style="background-color:#ffffff;padding:40px 40px 36px;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:${BRAND_COLOR};padding:28px 40px;text-align:center;">
                <p style="color:#97C3E0;margin:0 0 8px;font-size:12px;">
                  &copy; ${new Date().getFullYear()} Averra Knowledge Academy. All rights reserved.
                </p>
                <p style="color:#497296;margin:0 0 8px;font-size:12px;">
                  <a href="mailto:info@averraknowledgeacademy.com" style="color:#497296;text-decoration:none;">info@averraknowledgeacademy.com</a>
                  &nbsp;&bull;&nbsp;
                  <a href="https://wa.me/2349033440966" style="color:#497296;text-decoration:none;">+234 903 344 0966</a>
                </p>
                <p style="color:#325E84;margin:0;font-size:11px;">
                  <a href="${BASE_URL}" style="color:#325E84;text-decoration:none;">www.averraknowledgeacademy.com</a>
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
  learners = [],
}: {
  to: string
  parentName: string
  currency: string
  billingAmount: number
  billingPeriod: string
  classType: string
  learnerNames: string[]
  learners?: { year_group_code?: string }[]
}) {
  const symbol = currency === 'NGN' ? '\u20a6' : '\u00a3'
  const formattedAmount = `${symbol}${Number(billingAmount).toLocaleString()}`
  const firstName = parentName.split(' ')[0]
  const heroImage = getAcademyImage(learners)

  const classTypeMap: Record<string, string> = {
    private: 'Private (1-on-1)',
    general: 'General Class',
  }
  const periodMap: Record<string, string> = {
    monthly: 'Monthly',
    termly: 'Termly (3 months)',
    annually: 'Annually (12 months)',
  }

  const body = `
    <!-- Greeting -->
    <h2 style="color:${BRAND_COLOR};margin:0 0 6px;font-size:24px;font-weight:bold;line-height:1.3;">
      Welcome to Averra Academy,<br />${firstName}! &#127891;
    </h2>
    <p style="color:#497296;font-size:13px;margin:0 0 24px;font-weight:bold;letter-spacing:0.3px;">
      JUNIOR ACADEMY &mdash; ENROLMENT REGISTERED
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.8;margin:0 0 28px;">
      We are incredibly excited to welcome
      <strong>${learnerNames.length === 1 ? learnerNames[0] : learnerNames.join(' and ')}</strong>
      to <strong>Averra Knowledge Academy</strong>.
      You have taken a brilliant step towards a stronger academic future.
    </p>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 28px;" />

    <!-- What they will achieve -->
    <h3 style="color:${BRAND_COLOR};margin:0 0 16px;font-size:16px;font-weight:bold;">
      What Averra Academy will do for ${learnerNames.length === 1 ? learnerNames[0] : 'your learners'}:
    </h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td width="50%" valign="top" style="padding:0 8px 12px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:32px;height:32px;background:${BRAND_COLOR};border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;">&#127758;</td>
              <td style="padding-left:10px;font-size:13px;color:#374151;line-height:1.5;"><strong style="color:${BRAND_COLOR};">7 World Systems</strong><br />Fused into one powerful curriculum</td>
            </tr>
          </table>
        </td>
        <td width="50%" valign="top" style="padding:0 0 12px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:32px;height:32px;background:${BRAND_COLOR};border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;">&#127919;</td>
              <td style="padding-left:10px;font-size:13px;color:#374151;line-height:1.5;"><strong style="color:${BRAND_COLOR};">Personalised Learning</strong><br />Tailored to each learner's exact level</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td width="50%" valign="top" style="padding:0 8px 12px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:32px;height:32px;background:${BRAND_COLOR};border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;">&#128200;</td>
              <td style="padding-left:10px;font-size:13px;color:#374151;line-height:1.5;"><strong style="color:${BRAND_COLOR};">Progress Tracking</strong><br />Monitor improvement every step</td>
            </tr>
          </table>
        </td>
        <td width="50%" valign="top" style="padding:0 0 12px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:32px;height:32px;background:${BRAND_COLOR};border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;">&#127942;</td>
              <td style="padding-left:10px;font-size:13px;color:#374151;line-height:1.5;"><strong style="color:${BRAND_COLOR};">Exam Preparation</strong><br />WAEC, JAMB, GCSE, A-Level & more</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Enrolment Summary Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:${BRAND_COLOR};border-radius:12px;margin-bottom:28px;overflow:hidden;">
      <tr>
        <td style="padding:16px 24px 12px;border-bottom:1px solid #1D4469;">
          <p style="margin:0;color:#97C3E0;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">Enrolment Summary</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#97C3E0;font-size:12px;padding:5px 0;width:140px;">Learner(s)</td>
              <td style="color:#ffffff;font-size:13px;font-weight:bold;padding:5px 0;">${learnerNames.join(', ')}</td>
            </tr>
            <tr>
              <td style="color:#97C3E0;font-size:12px;padding:5px 0;">Division</td>
              <td style="color:#ffffff;font-size:13px;font-weight:bold;padding:5px 0;">Junior Academy</td>
            </tr>
            <tr>
              <td style="color:#97C3E0;font-size:12px;padding:5px 0;">Class Type</td>
              <td style="color:#ffffff;font-size:13px;font-weight:bold;padding:5px 0;">${classTypeMap[classType] || classType}</td>
            </tr>
            <tr>
              <td style="color:#97C3E0;font-size:12px;padding:5px 0;">Billing Period</td>
              <td style="color:#ffffff;font-size:13px;font-weight:bold;padding:5px 0;">${periodMap[billingPeriod] || billingPeriod}</td>
            </tr>
            <tr>
              <td style="color:#97C3E0;font-size:12px;padding:5px 0;">Amount Due</td>
              <td style="color:#ffffff;font-size:18px;font-weight:bold;padding:5px 0;">${formattedAmount}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- What happens next -->
    <h3 style="color:${BRAND_COLOR};margin:0 0 16px;font-size:16px;font-weight:bold;">
      Here is what to do next:
    </h3>

    <!-- Step 1 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td valign="top" style="width:40px;">
          <div style="width:36px;height:36px;background:${ACCENT_COLOR};border-radius:50%;text-align:center;line-height:36px;color:#ffffff;font-weight:bold;font-size:15px;">1</div>
        </td>
        <td valign="top" style="padding-left:14px;">
          <p style="margin:0 0 3px;font-size:14px;font-weight:bold;color:${BRAND_COLOR};">Complete Your Payment</p>
          <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">Head to your dashboard and complete your payment. Classes will only begin once payment has been confirmed by our team.</p>
        </td>
      </tr>
    </table>

    <!-- Step 2 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td valign="top" style="width:40px;">
          <div style="width:36px;height:36px;background:${ACCENT_COLOR};border-radius:50%;text-align:center;line-height:36px;color:#ffffff;font-weight:bold;font-size:15px;">2</div>
        </td>
        <td valign="top" style="padding-left:14px;">
          <p style="margin:0 0 3px;font-size:14px;font-weight:bold;color:${BRAND_COLOR};">Baseline Assessment</p>
          <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">Once payment is confirmed, your learner will take a short baseline assessment. This helps us understand their exact level in each subject so teaching is spot-on from day one.</p>
        </td>
      </tr>
    </table>

    <!-- Step 3 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td valign="top" style="width:40px;">
          <div style="width:36px;height:36px;background:${ACCENT_COLOR};border-radius:50%;text-align:center;line-height:36px;color:#ffffff;font-weight:bold;font-size:15px;">3</div>
        </td>
        <td valign="top" style="padding-left:14px;">
          <p style="margin:0 0 3px;font-size:14px;font-weight:bold;color:${BRAND_COLOR};">Personalised Classes Begin</p>
          <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">Your dedicated teacher will be assigned based on your assessment results and your plan. Classes will be structured, personal and built around your learner.</p>
        </td>
      </tr>
    </table>

    <!-- Step 4 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td valign="top" style="width:40px;">
          <div style="width:36px;height:36px;background:${ACCENT_COLOR};border-radius:50%;text-align:center;line-height:36px;color:#ffffff;font-weight:bold;font-size:15px;">4</div>
        </td>
        <td valign="top" style="padding-left:14px;">
          <p style="margin:0 0 3px;font-size:14px;font-weight:bold;color:${BRAND_COLOR};">Track Progress From Your Dashboard</p>
          <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">Monitor your learner's growth, view reports and stay in touch with the Averra team — all from your personal dashboard.</p>
        </td>
      </tr>
    </table>

    <!-- Important note -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:#FFF8F0;border-radius:10px;border-left:4px solid #F59E0B;margin-bottom:32px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0;font-size:13px;color:#92400E;line-height:1.6;">
            <strong>&#128276; Please note:</strong> Your enrolment is confirmed but classes will not begin until payment has been verified by our team. This usually takes less than 2 hours after we receive your payment.
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="${BASE_URL}/dashboard/academy"
            style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:10px;font-weight:bold;font-size:16px;letter-spacing:0.3px;">
            Go to My Dashboard &amp; Pay &#8594;
          </a>
        </td>
      </tr>
    </table>

    <!-- Sign off -->
    <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 24px;" />
    <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 8px;">
      We look forward to being part of ${learnerNames.length === 1 ? learnerNames[0] + "'s" : 'your learners\''} academic journey.
    </p>
    <p style="color:#374151;font-size:14px;margin:0 0 4px;">Warm regards,</p>
    <p style="color:${BRAND_COLOR};font-size:14px;font-weight:bold;margin:0;">The Averra Academy Team</p>
    <p style="color:#6B7280;font-size:12px;margin:6px 0 0;">
      Questions? WhatsApp <strong>+234 903 344 0966</strong> or reply to this email &mdash; we respond within 2 hours.
    </p>
  `

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to Averra Academy, ${firstName}! Here is what to do next.`,
    html: baseTemplate(body, heroImage),
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
  const symbol = currency === 'NGN' ? '\u20a6' : '\u00a3'
  const formattedAmount = `${symbol}${Number(billingAmount).toLocaleString()}`

  const body = `
    <h2 style="color:${BRAND_COLOR};margin:0 0 6px;font-size:20px;font-weight:bold;">
      &#128276; New Academy Enrolment
    </h2>
    <p style="color:#6B7280;font-size:13px;margin:0 0 24px;">
      Received at ${new Date().toUTCString()}
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:${BRAND_COLOR};border-radius:12px;margin-bottom:28px;overflow:hidden;">
      <tr>
        <td style="padding:14px 24px;border-bottom:1px solid #1D4469;">
          <p style="margin:0;color:#97C3E0;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">Enrolment Details</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="color:#97C3E0;font-size:12px;padding:5px 0;width:150px;">Name</td><td style="color:#ffffff;font-size:13px;font-weight:bold;padding:5px 0;">${parentName}</td></tr>
            <tr><td style="color:#97C3E0;font-size:12px;padding:5px 0;">Email</td><td style="color:#ffffff;font-size:13px;padding:5px 0;">${parentEmail}</td></tr>
            <tr><td style="color:#97C3E0;font-size:12px;padding:5px 0;">Learners</td><td style="color:#ffffff;font-size:13px;font-weight:bold;padding:5px 0;">${learnerCount}</td></tr>
            <tr><td style="color:#97C3E0;font-size:12px;padding:5px 0;">Class Type</td><td style="color:#ffffff;font-size:13px;font-weight:bold;padding:5px 0;">${classType}</td></tr>
            <tr><td style="color:#97C3E0;font-size:12px;padding:5px 0;">Currency</td><td style="color:#ffffff;font-size:13px;font-weight:bold;padding:5px 0;">${currency}</td></tr>
            <tr><td style="color:#97C3E0;font-size:12px;padding:5px 0;">Billing Period</td><td style="color:#ffffff;font-size:13px;font-weight:bold;padding:5px 0;">${billingPeriod}</td></tr>
            <tr><td style="color:#97C3E0;font-size:12px;padding:5px 0;">Amount Due</td><td style="color:#ffffff;font-size:18px;font-weight:bold;padding:5px 0;">${formattedAmount}</td></tr>
            <tr><td style="color:#97C3E0;font-size:12px;padding:5px 0;">Status</td><td style="padding:5px 0;"><span style="background:#F59E0B;color:#ffffff;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:20px;">AWAITING PAYMENT</span></td></tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="color:#6B7280;font-size:12px;margin:0 0 20px;font-family:monospace;">
      Enrollment ID: ${enrollmentId}
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="${BASE_URL}/admin/dashboard/academy/${enrollmentId}"
            style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:bold;font-size:15px;">
            View in Admin Dashboard &#8594;
          </a>
        </td>
      </tr>
    </table>
  `

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `[NEW ENROLMENT] ${parentName} — ${formattedAmount} (${currency})`,
    html: baseTemplate(body),
  })
}

// ── 3. Payment confirmed email ────────────────────────────────────────────
export async function sendPaymentConfirmedEmail({
  to,
  parentName,
  currency,
  billingAmount,
  paymentMethod,
  learners = [],
}: {
  to: string
  parentName: string
  currency: string
  billingAmount: number
  paymentMethod: 'paystack' | 'bank_transfer'
  learners?: { year_group_code?: string }[]
}) {
  const symbol = currency === 'NGN' ? '\u20a6' : '\u00a3'
  const formattedAmount = `${symbol}${Number(billingAmount).toLocaleString()}`
  const firstName = parentName.split(' ')[0]
  const heroImage = getAcademyImage(learners)
  const methodLabel = paymentMethod === 'paystack' ? 'Paystack (Card)' : 'Bank Transfer'

  const body = `
    <!-- Success icon -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <div style="width:72px;height:72px;background:#F0FDF4;border-radius:50%;text-align:center;line-height:72px;font-size:36px;display:inline-block;border:2px solid #16A34A;">
            &#10003;
          </div>
        </td>
      </tr>
    </table>

    <h2 style="color:${BRAND_COLOR};margin:0 0 6px;font-size:24px;font-weight:bold;text-align:center;">
      Payment Confirmed!
    </h2>
    <p style="color:#16A34A;font-size:13px;margin:0 0 24px;font-weight:bold;letter-spacing:0.3px;text-align:center;">
      ENROLMENT ACTIVE &#8212; JUNIOR ACADEMY
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.8;margin:0 0 28px;text-align:center;">
      Congratulations, <strong>${firstName}</strong>! Your payment of
      <strong>${formattedAmount}</strong> has been confirmed.
      Your Averra Academy enrolment is now fully active.
    </p>

    <!-- Payment confirmation card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:#F0FDF4;border-radius:12px;border:1px solid #BBF7D0;margin-bottom:28px;overflow:hidden;">
      <tr>
        <td style="padding:14px 24px;border-bottom:1px solid #BBF7D0;">
          <p style="margin:0;color:#16A34A;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">Payment Receipt</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="color:#6B7280;font-size:12px;padding:5px 0;width:150px;">Amount Paid</td><td style="color:#16A34A;font-size:18px;font-weight:bold;padding:5px 0;">${formattedAmount}</td></tr>
            <tr><td style="color:#6B7280;font-size:12px;padding:5px 0;">Currency</td><td style="color:#374151;font-size:13px;font-weight:bold;padding:5px 0;">${currency}</td></tr>
            <tr><td style="color:#6B7280;font-size:12px;padding:5px 0;">Method</td><td style="color:#374151;font-size:13px;font-weight:bold;padding:5px 0;">${methodLabel}</td></tr>
            <tr><td style="color:#6B7280;font-size:12px;padding:5px 0;">Status</td><td style="padding:5px 0;"><span style="background:#16A34A;color:#ffffff;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:20px;">CONFIRMED</span></td></tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- What happens next -->
    <h3 style="color:${BRAND_COLOR};margin:0 0 16px;font-size:16px;font-weight:bold;">
      What happens next:
    </h3>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td valign="top" style="width:40px;">
          <div style="width:36px;height:36px;background:${ACCENT_COLOR};border-radius:50%;text-align:center;line-height:36px;color:#ffffff;font-weight:bold;font-size:15px;">1</div>
        </td>
        <td valign="top" style="padding-left:14px;">
          <p style="margin:0 0 3px;font-size:14px;font-weight:bold;color:${BRAND_COLOR};">Our team contacts you within 24 hours</p>
          <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">We will reach out to confirm your preferred timetable and answer any questions you have about your classes.</p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td valign="top" style="width:40px;">
          <div style="width:36px;height:36px;background:${ACCENT_COLOR};border-radius:50%;text-align:center;line-height:36px;color:#ffffff;font-weight:bold;font-size:15px;">2</div>
        </td>
        <td valign="top" style="padding-left:14px;">
          <p style="margin:0 0 3px;font-size:14px;font-weight:bold;color:${BRAND_COLOR};">Baseline Assessment</p>
          <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">Your learner will take a short assessment to map their current knowledge level in each subject. This shapes how we teach them from day one.</p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td valign="top" style="width:40px;">
          <div style="width:36px;height:36px;background:${ACCENT_COLOR};border-radius:50%;text-align:center;line-height:36px;color:#ffffff;font-weight:bold;font-size:15px;">3</div>
        </td>
        <td valign="top" style="padding-left:14px;">
          <p style="margin:0 0 3px;font-size:14px;font-weight:bold;color:${BRAND_COLOR};">Classes begin within 48 hours</p>
          <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">Once the timetable is confirmed, your personalised classes begin. Your teacher will follow the Averra Super Curriculum tailored to your learner's level.</p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="${BASE_URL}/dashboard/academy"
            style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:10px;font-weight:bold;font-size:16px;letter-spacing:0.3px;">
            View My Dashboard &#8594;
          </a>
        </td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 24px;" />
    <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 8px;">
      Thank you for choosing Averra Academy. We cannot wait to see the progress ahead.
    </p>
    <p style="color:#374151;font-size:14px;margin:0 0 4px;">Warm regards,</p>
    <p style="color:${BRAND_COLOR};font-size:14px;font-weight:bold;margin:0;">The Averra Academy Team</p>
    <p style="color:#6B7280;font-size:12px;margin:6px 0 0;">
      WhatsApp <strong>+234 903 344 0966</strong> &bull; info@averraknowledgeacademy.com
    </p>
  `

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Payment Confirmed ✓ — Welcome to Averra Academy, ${firstName}!`,
    html: baseTemplate(body, heroImage),
  })
}
