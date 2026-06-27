import { NextRequest } from 'next/server'

function getResend() {
  const { Resend } = require('resend')
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: 'Name, email, subject and message are required.' },
        { status: 400 }
      )
    }

    await getResend().emails.send({
      from:    'Averra Website <noreply@averraknowledgeacademy.com>',
      to:      'info@averraknowledgeacademy.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#F0F6FB;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:40px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                  <tr>
                    <td style="background:linear-gradient(135deg,#062850 0%,#1D4469 100%);padding:32px 40px;text-align:center;">
                      <h1 style="color:#fff;font-size:20px;margin:0;">New Contact Form Submission</h1>
                      <p style="color:#97C3E0;font-size:13px;margin:8px 0 0 0;">Averra Knowledge Academy Website</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F6FB;border-radius:12px;margin-bottom:24px;">
                        <tr><td style="padding:16px 20px;">
                          <p style="color:#062850;font-size:13px;font-weight:bold;margin:0 0 12px 0;">Sender Details</p>
                          <p style="color:#555;font-size:14px;margin:0 0 6px 0;"><strong>Name:</strong> ${name}</p>
                          <p style="color:#555;font-size:14px;margin:0 0 6px 0;"><strong>Email:</strong> ${email}</p>
                          ${phone ? `<p style="color:#555;font-size:14px;margin:0 0 6px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
                          <p style="color:#555;font-size:14px;margin:0;"><strong>Subject:</strong> ${subject}</p>
                        </td></tr>
                      </table>
                      <p style="color:#062850;font-size:13px;font-weight:bold;margin:0 0 8px 0;">Message</p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F6FB;border-radius:12px;border-left:4px solid #497296;margin-bottom:24px;">
                        <tr><td style="padding:16px 20px;">
                          <p style="color:#555;font-size:14px;line-height:22px;margin:0;white-space:pre-line;">${message}</p>
                        </td></tr>
                      </table>
                      <p style="color:#999;font-size:12px;margin:0;">
                        Reply directly to this email to respond to ${name}.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#062850;padding:20px 40px;text-align:center;">
                      <p style="color:#97C3E0;font-size:11px;margin:0;">Averra Knowledge Academy — averraknowledgeacademy.com</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    // Auto-reply to sender
    await getResend().emails.send({
      from:    'Averra Knowledge Academy <info@averraknowledgeacademy.com>',
      to:      email,
      subject: 'We received your message — Averra Knowledge Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#F0F6FB;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:40px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                  <tr>
                    <td style="background:linear-gradient(135deg,#062850 0%,#1D4469 100%);padding:32px 40px;text-align:center;">
                      <h1 style="color:#fff;font-size:20px;margin:0;">Thank You for Reaching Out</h1>
                      <p style="color:#97C3E0;font-size:13px;margin:8px 0 0 0;">Averra Knowledge Academy</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="color:#555;font-size:14px;line-height:22px;margin:0 0 16px 0;">Hi ${name},</p>
                      <p style="color:#555;font-size:14px;line-height:22px;margin:0 0 16px 0;">
                        Thank you for contacting Averra Knowledge Academy. We have received your message and our team will get back to you within <strong>24 hours</strong>.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F6FB;border-radius:12px;margin-bottom:24px;">
                        <tr><td style="padding:16px 20px;">
                          <p style="color:#062850;font-size:13px;font-weight:bold;margin:0 0 8px 0;">Your message:</p>
                          <p style="color:#555;font-size:13px;line-height:20px;margin:0;white-space:pre-line;">${message}</p>
                        </td></tr>
                      </table>
                      <p style="color:#555;font-size:14px;line-height:22px;margin:0 0 24px 0;">
                        In the meantime, feel free to explore our services at
                        <a href="https://averraknowledgeacademy.com" style="color:#062850;font-weight:bold;">averraknowledgeacademy.com</a>
                      </p>
                      <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 16px 0;">
                      <p style="color:#999;font-size:12px;margin:0;">
                        📞 +234 903 344 0966 &nbsp;|&nbsp; ✉️ info@averraknowledgeacademy.com
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#062850;padding:20px 40px;text-align:center;">
                      <p style="color:#97C3E0;font-size:11px;margin:0;">Averra Knowledge Academy — The Right Knowledge.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return Response.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}