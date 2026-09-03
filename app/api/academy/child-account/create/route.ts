import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

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
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()
    const { child_db_id, child_email, child_name, temp_password } = await request.json()

    if (!child_db_id || !child_email || !child_name || !temp_password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    // Verify parent owns this child
    const { data: child } = await admin
      .from('academy_children')
      .select('id, enrollment_id, full_name')
      .eq('id', child_db_id)
      .single()

    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

    const { data: enrollment } = await admin
      .from('academy_enrollments')
      .select('parent_id')
      .eq('id', child.enrollment_id)
      .single()

    if (enrollment?.parent_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create child auth account
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: child_email,
      password: temp_password,
      email_confirm: true,
      user_metadata: {
        full_name: child_name,
        account_type: 'child',
        parent_user_id: user.id,
        child_db_id,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const childUserId = authData.user.id

    // Update profile with child account type and parent link
    await admin.from('profiles').update({
      full_name: child_name,
      account_type: 'child',
      parent_user_id: user.id,
    }).eq('id', childUserId)

    // Link child auth account to child DB record
    await admin.from('academy_children').update({
      child_user_id: childUserId,
    }).eq('id', child_db_id)

    // Get parent profile for email
    const { data: parentProfile } = await admin
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    // Send welcome email to child
    await resend.emails.send({
      from: 'Averra Knowledge Academy <info@averraknowledgeacademy.com>',
      to: child_email,
      subject: `Welcome to Averra Academy, ${child_name}!`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F0F6FB;padding:40px 16px;">
          <div style="background:#062850;border-radius:16px 16px 0 0;padding:28px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:22px;">Welcome to Averra Academy!</h1>
          </div>
          <div style="background:#ffffff;padding:36px 40px;">
            <h2 style="color:#062850;">Hi ${child_name}! 👋</h2>
            <p style="color:#374151;">Your parent ${parentProfile?.full_name || ''} has created an account for you on Averra Knowledge Academy.</p>
            <p style="color:#374151;">You can now log in to:</p>
            <ul style="color:#374151;">
              <li>See your class timetable</li>
              <li>Do your classwork and homework</li>
              <li>View your learning roadmap</li>
              <li>Join your classes</li>
            </ul>
            <div style="background:#F0F6FB;border-radius:10px;padding:16px;margin:20px 0;">
              <p style="margin:0;color:#062850;font-weight:bold;">Your login details:</p>
              <p style="margin:8px 0 0;color:#497296;">Email: ${child_email}</p>
              <p style="margin:4px 0 0;color:#497296;">Temporary password: ${temp_password}</p>
              <p style="margin:8px 0 0;font-size:12px;color:#9CA3AF;">Please change your password when you first log in.</p>
            </div>
            <div style="text-align:center;margin:28px 0;">
              <a href="https://www.averraknowledgeacademy.com/auth/login"
                style="background:#062850;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;display:inline-block;">
                Log In Now &rarr;
              </a>
            </div>
          </div>
          <div style="background:#062850;border-radius:0 0 16px 16px;padding:20px;text-align:center;">
            <p style="color:#97C3E0;margin:0;font-size:12px;">&copy; ${new Date().getFullYear()} Averra Knowledge Academy</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, child_user_id: childUserId })
  } catch (err) {
    console.error('Child account create error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
