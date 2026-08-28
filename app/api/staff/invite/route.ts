import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    // Verify requester is admin
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()
    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { full_name, email, role } = await request.json()
    if (!full_name || !email || !role) return NextResponse.json({ error: 'full_name, email and role are required' }, { status: 400 })
    if (!['admin', 'staff', 'trainer'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

    // Create auth user with temporary password
    const tempPassword = crypto.randomBytes(16).toString('hex')
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name, role },
    })

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })
    const newUserId = authData.user.id

    // Update profile
    await admin.from('profiles').update({ full_name, role }).eq('id', newUserId)

    // Generate onboarding token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours

    // Create staff_credentials row
    await admin.from('staff_credentials').insert({
      user_id: newUserId,
      secret_question: '',
      secret_answer_hash: '',
      secret_code_hash: '',
      onboarding_token: token,
      onboarding_token_expires_at: expiresAt,
      onboarding_completed: false,
    })

    // Send onboarding email
    const onboardingUrl = `https://www.averraknowledgeacademy.com/auth/staff-onboarding?token=${token}`
    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)

    await resend.emails.send({
      from: 'Averra Knowledge Academy <info@averraknowledgeacademy.com>',
      to: email,
      subject: `You have been invited to join Averra Knowledge Academy as ${roleLabel === 'Admin' ? 'an' : 'a'} ${roleLabel}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#F0F6FB;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F6FB;padding:40px 16px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(6,40,80,0.10);">
                <tr>
                  <td style="background:#062850;padding:28px 40px;text-align:center;">
                    <img src="https://www.averraknowledgeacademy.com/logo.png" alt="Averra" width="64" height="64" style="display:inline-block;" />
                    <p style="color:#97C3E0;margin:10px 0 0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:bold;">Averra Knowledge Academy</p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#ffffff;padding:40px;">
                    <h2 style="color:#062850;margin:0 0 8px;font-size:22px;">Welcome to the Team, ${full_name.split(' ')[0]}!</h2>
                    <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 24px;">
                      You have been invited to join <strong>Averra Knowledge Academy</strong> as a <strong>${roleLabel}</strong>.
                      Click the button below to set up your account, upload your photo, and create your security credentials.
                    </p>
                    <div style="background:#F0F6FB;border-radius:10px;padding:16px;margin-bottom:24px;border-left:4px solid #497296;">
                      <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">
                        <strong>This link expires in 48 hours.</strong> If it expires, contact your administrator for a new one.
                      </p>
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td align="center">
                          <a href="${onboardingUrl}"
                            style="display:inline-block;background:#062850;color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:10px;font-weight:bold;font-size:16px;">
                            Complete My Account Setup &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color:#6B7280;font-size:12px;margin:0;">
                      If the button does not work, copy this link: <br />
                      <a href="${onboardingUrl}" style="color:#497296;word-break:break-all;">${onboardingUrl}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#062850;padding:24px 40px;text-align:center;">
                    <p style="color:#97C3E0;margin:0;font-size:12px;">&copy; ${new Date().getFullYear()} Averra Knowledge Academy</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true, message: `Invitation sent to ${email}` })
  } catch (err) {
    console.error('Staff invite error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
