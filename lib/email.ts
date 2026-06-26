import { Resend } from 'resend'

const resend = new Resend(
  process.env.RESEND_API_KEY
)

const FROM_NOREPLY =
  'Averra Knowledge Academy <noreply@averraknowledgeacademy.com>'
const FROM_SCHOLARSHIP =
  'Averra Scholarship Team <scholarship@averraknowledgeacademy.com>'
const FROM_SUPPORT =
  'Averra Support <support@averraknowledgeacademy.com>'

// Base email template
function baseTemplate(
  content: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#F0F6FB; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F6FB;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #062850 0%, #1D4469 50%, #325E84 100%); padding:40px 40px 30px 40px; text-align:center;">
              <img src="https://averraknowledgeacademy.com/logo.png" alt="Averra Knowledge Academy" width="64" height="64" style="display:block; margin:0 auto 16px auto; border-radius:12px;" />
              <h1 style="color:#ffffff; font-size:22px; margin:0 0 8px 0; font-weight:bold;">
                Averra Knowledge Academy
              </h1>
              <p style="color:#97C3E0; font-size:13px; margin:0;">
                Academic &amp; Professional Success Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#062850; padding:24px 40px; text-align:center;">
              <p style="color:#97C3E0; font-size:12px; margin:0 0 4px 0;">
                Averra Knowledge Academy
              </p>
              <p style="color:#497296; font-size:11px; margin:0 0 4px 0;">
                info@averraknowledgeacademy.com &middot; +234 903 344 0966
              </p>
              <p style="color:#325E84; font-size:10px; margin:0;">
                Built by <a href="https://www.thrinxs.com.ng" style="color:#97C3E0; text-decoration:none;">Thrinxs</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Button helper
function emailButton(
  text: string,
  url: string
): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
      <tr>
        <td align="center" style="background-color:#062850; border-radius:12px;">
          <a href="${url}" target="_blank" style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:15px; font-weight:bold; text-decoration:none; border-radius:12px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `
}

// ── EMAIL 1: Payment Confirmed ──
export async function sendPaymentConfirmedEmail({
  to,
  name,
  packageName,
  amount,
}: {
  to: string
  name: string
  packageName: string
  amount: number
}) {
  const formattedAmount =
    '₦' + amount.toLocaleString('en-NG')

  const content = `
    <h2 style="color:#062850; font-size:20px; margin:0 0 16px 0; font-weight:bold;">
      Payment Confirmed ✓
    </h2>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      Hi ${name},
    </p>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      Your payment of <strong>${formattedAmount}</strong> for the <strong>${packageName} Package</strong> has been confirmed successfully.
    </p>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 24px 0;">
      Our system is now working to find your 5 best scholarship matches based on your profile and preferences. This usually takes less than 1 hour.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F6FB; border-radius:12px; padding:16px; margin-bottom:24px;">
      <tr>
        <td style="padding:12px;">
          <p style="color:#062850; font-size:13px; font-weight:bold; margin:0 0 8px 0;">What happens next:</p>
          <p style="color:#555555; font-size:13px; margin:0 0 6px 0;">✓ &nbsp;Your scholarship matches will be delivered within 1 hour</p>
          <p style="color:#555555; font-size:13px; margin:0 0 6px 0;">✓ &nbsp;Our team will manually verify each match within 24 hours</p>
          <p style="color:#555555; font-size:13px; margin:0;">✓ &nbsp;You will receive a second email when verification is complete</p>
        </td>
      </tr>
    </table>

    ${emailButton('View My Dashboard', 'https://averraknowledgeacademy.com/dashboard')}

    <hr style="border:none; border-top:1px solid #E5E7EB; margin:24px 0;">
    <p style="color:#999999; font-size:11px; line-height:16px; margin:0;">
      If you did not make this payment, please contact us immediately at info@averraknowledgeacademy.com
    </p>
  `

  return resend.emails.send({
    from: FROM_NOREPLY,
    to,
    subject:
      'Payment Confirmed — Your Matches Are Being Prepared',
    html: baseTemplate(content),
  })
}

// ── EMAIL 2: Matches Ready ──
export async function sendMatchesReadyEmail({
  to,
  name,
  packageName,
}: {
  to: string
  name: string
  packageName: string
}) {
  const content = `
    <h2 style="color:#062850; font-size:20px; margin:0 0 16px 0; font-weight:bold;">
      Your Scholarship Matches Are Ready! 🎓
    </h2>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      Hi ${name},
    </p>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      Great news! We have successfully identified your <strong>5 best scholarship matches</strong> based on your academic profile, preferred countries, field of study, and degree level.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0FDF4; border-radius:12px; border:1px solid #86EFAC; margin-bottom:24px;">
      <tr>
        <td style="padding:16px;">
          <p style="color:#166534; font-size:13px; font-weight:bold; margin:0 0 8px 0;">What's happening now:</p>
          <p style="color:#166534; font-size:13px; margin:0 0 6px 0;">⏳ &nbsp;Our team is manually reviewing each match</p>
          <p style="color:#166534; font-size:13px; margin:0 0 6px 0;">✓ &nbsp;We are confirming eligibility and accuracy</p>
          <p style="color:#166534; font-size:13px; margin:0;">📧 &nbsp;You will receive another email once verification is complete (within 24 hours)</p>
        </td>
      </tr>
    </table>

    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 24px 0;">
      You can already view your matches in your dashboard. Based on your <strong>${packageName} Package</strong>, our support team is ready to guide you through your applications.
    </p>

    ${emailButton('View My Matches', 'https://averraknowledgeacademy.com/dashboard/matches')}

    <hr style="border:none; border-top:1px solid #E5E7EB; margin:24px 0;">
    <p style="color:#999999; font-size:11px; line-height:16px; margin:0;">
      Questions? Reply to this email or contact us at scholarship@averraknowledgeacademy.com
    </p>
  `

  return resend.emails.send({
    from: FROM_SCHOLARSHIP,
    to,
    subject:
      'Your 5 Scholarship Matches Are Ready — Review Them Now',
    html: baseTemplate(content),
  })
}

// ── EMAIL 3: Matches Verified ──
export async function sendMatchesVerifiedEmail({
  to,
  name,
  packageName,
}: {
  to: string
  name: string
  packageName: string
}) {
  const content = `
    <h2 style="color:#062850; font-size:20px; margin:0 0 16px 0; font-weight:bold;">
      Your Matches Have Been Verified ✓
    </h2>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      Hi ${name},
    </p>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      Our team has manually reviewed and verified all 5 of your scholarship matches. Each match has been confirmed as <strong>active, current, and eligible</strong> for your profile.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0FDF4; border-radius:12px; border:1px solid #86EFAC; margin-bottom:24px;">
      <tr>
        <td style="padding:16px;">
          <p style="color:#166534; font-size:13px; font-weight:bold; margin:0 0 8px 0;">Your matches are verified and ready:</p>
          <p style="color:#166534; font-size:13px; margin:0 0 6px 0;">✓ &nbsp;All 5 matches confirmed active and eligible</p>
          <p style="color:#166534; font-size:13px; margin:0 0 6px 0;">✓ &nbsp;Deadlines and requirements verified</p>
          <p style="color:#166534; font-size:13px; margin:0;">✓ &nbsp;Proceed with your applications with confidence</p>
        </td>
      </tr>
    </table>

    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 24px 0;">
      Based on your <strong>${packageName} Package</strong>, here is what happens next:
    </p>

    ${
      packageName.toLowerCase() === 'basic'
        ? `<p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 24px 0;">
            Your match report includes full details for each scholarship — country, deadline, eligibility, and required documents. You can now begin applying directly on each scholarship's website.
           </p>`
        : packageName.toLowerCase() === 'standard'
        ? `<p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 24px 0;">
            Our team will now begin reviewing your SOP and CV. Please log in to your dashboard to upload your documents or send them to scholarship@averraknowledgeacademy.com
           </p>`
        : `<p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 24px 0;">
            Our team will contact you shortly on WhatsApp to begin your profile boosting coaching and interview preparation. Please ensure your WhatsApp number is up to date in your profile.
           </p>`
    }

    ${emailButton('View My Verified Matches', 'https://averraknowledgeacademy.com/dashboard/matches')}

    <hr style="border:none; border-top:1px solid #E5E7EB; margin:24px 0;">
    <p style="color:#999999; font-size:11px; line-height:16px; margin:0;">
      Questions about your matches? Contact us at scholarship@averraknowledgeacademy.com or reply to this email.
    </p>
  `

  return resend.emails.send({
    from: FROM_SCHOLARSHIP,
    to,
    subject:
      'Your Scholarship Matches Are Verified — Start Your Applications',
    html: baseTemplate(content),
  })
}

// ── EMAIL 4: Admin Reply to Student Message ──
export async function sendMessageReplyEmail({
  to,
  name,
  subject,
  replyContent,
  department,
}: {
  to: string
  name: string
  subject: string
  replyContent: string
  department: string
}) {
  const content = `
    <h2 style="color:#062850; font-size:20px; margin:0 0 16px 0; font-weight:bold;">
      New Reply from Averra Team
    </h2>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      Hi ${name},
    </p>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      You have received a reply from our <strong>${department}</strong> team regarding:
    </p>
    <p style="color:#062850; font-size:14px; font-weight:bold; margin:0 0 16px 0;">
      "${subject}"
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F6FB; border-radius:12px; border-left:4px solid #497296; margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="color:#555555; font-size:14px; line-height:22px; margin:0; white-space:pre-line;">
            ${replyContent}
          </p>
        </td>
      </tr>
    </table>

    ${emailButton('View Full Conversation', 'https://averraknowledgeacademy.com/dashboard/messages')}

    <hr style="border:none; border-top:1px solid #E5E7EB; margin:24px 0;">
    <p style="color:#999999; font-size:11px; line-height:16px; margin:0;">
      To reply, log in to your dashboard and go to Messages.
    </p>
  `

  return resend.emails.send({
    from: FROM_SUPPORT,
    to,
    subject: `Re: ${subject} — Averra Knowledge Academy`,
    html: baseTemplate(content),
  })
}

// ── EMAIL 5: Match Edited by Admin ──
export async function sendMatchEditedEmail({
  to,
  name,
}: {
  to: string
  name: string
}) {
  const content = `
    <h2 style="color:#062850; font-size:20px; margin:0 0 16px 0; font-weight:bold;">
      Your Scholarship Match Has Been Updated
    </h2>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      Hi ${name},
    </p>
    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 16px 0;">
      Our scholarship team has reviewed your matches and made an update to ensure you have the most accurate and current information available.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F6FB; border-radius:12px; border-left:4px solid #497296; margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="color:#062850; font-size:13px; font-weight:bold; margin:0 0 8px 0;">What was updated:</p>
          <p style="color:#555555; font-size:13px; margin:0 0 6px 0;">✓ &nbsp;One or more of your scholarship matches has been reviewed and updated</p>
          <p style="color:#555555; font-size:13px; margin:0 0 6px 0;">✓ &nbsp;All details have been verified for accuracy</p>
          <p style="color:#555555; font-size:13px; margin:0;">✓ &nbsp;Your matches continue to be the best fit for your profile</p>
        </td>
      </tr>
    </table>

    <p style="color:#555555; font-size:14px; line-height:22px; margin:0 0 24px 0;">
      Please log in to your dashboard to view the updated match details. If you have any questions about the changes, send us a message and our team will be happy to explain.
    </p>

    ${emailButton('View Updated Matches', 'https://averraknowledgeacademy.com/dashboard/matches')}

    <hr style="border:none; border-top:1px solid #E5E7EB; margin:24px 0;">
    <p style="color:#999999; font-size:11px; line-height:16px; margin:0;">
      Questions? Contact us at scholarship@averraknowledgeacademy.com
    </p>
  `

  return resend.emails.send({
    from: FROM_SCHOLARSHIP,
    to,
    subject:
      'Your Scholarship Match Has Been Updated — Averra Knowledge Academy',
    html: baseTemplate(content),
  })
}