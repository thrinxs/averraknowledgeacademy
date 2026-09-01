import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-server'
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
    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || !['admin', 'staff'].includes(profile.role)) {
      return NextResponse.json({ error: 'Admin or staff only' }, { status: 403 })
    }

    const { child_id, enrollment_id, timetable } = await request.json()
    if (!child_id || !enrollment_id || !timetable) {
      return NextResponse.json({ error: 'child_id, enrollment_id and timetable required' }, { status: 400 })
    }

    // Update child timetable
    await admin.from('academy_children').update({
      timetable,
      timetable_confirmed: true,
    }).eq('id', child_id)

    // Update enrollment timetable status
    await admin.from('academy_enrollments').update({
      timetable_confirmed: true,
      timetable_confirmed_at: new Date().toISOString(),
    }).eq('id', enrollment_id)

    // Get parent info
    const { data: enrollment } = await admin
      .from('academy_enrollments')
      .select('parent_id, profiles(full_name, email)')
      .eq('id', enrollment_id)
      .single()

    const rawProfiles = (enrollment as unknown as { profiles: unknown }).profiles
    const parentProfile: { full_name: string; email: string } | null = enrollment
      ? (Array.isArray(rawProfiles) ? rawProfiles[0] : rawProfiles) as { full_name: string; email: string }
      : null

    if (enrollment && parentProfile) {
      // Notify parent in-app
      await admin.from('notifications').insert({
        user_id: enrollment.parent_id,
        type: 'timetable',
        title: '📅 Timetable Confirmed!',
        message: 'Your class timetable has been confirmed. You can now view it on your dashboard.',
        is_read: false,
        link: '/dashboard/academy',
      })

      // Send email to parent
      if (parentProfile.email) {
        const timetableText = typeof timetable === 'string'
          ? timetable
          : JSON.stringify(timetable, null, 2)

        await resend.emails.send({
          from: 'Averra Knowledge Academy <info@averraknowledgeacademy.com>',
          to: parentProfile.email,
          subject: 'Your Timetable is Confirmed — Averra Academy',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F0F6FB;padding:40px 16px;">
              <div style="background:#062850;border-radius:16px 16px 0 0;padding:28px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:22px;">Averra Knowledge Academy</h1>
              </div>
              <div style="background:#ffffff;padding:36px 40px;">
                <h2 style="color:#062850;">📅 Timetable Confirmed!</h2>
                <p style="color:#374151;">Dear ${parentProfile.full_name?.split(' ')[0] || 'Parent'},</p>
                <p style="color:#374151;">Great news! Your class timetable has been confirmed. Classes will begin as scheduled.</p>
                <div style="background:#F0F6FB;border-radius:12px;padding:20px;margin:20px 0;border-left:4px solid #497296;">
                  <pre style="color:#062850;font-size:14px;margin:0;white-space:pre-wrap;">${timetableText}</pre>
                </div>
                <p style="color:#374151;">Log in to your dashboard to view full details and track your progress.</p>
                <div style="text-align:center;margin:28px 0;">
                  <a href="https://www.averraknowledgeacademy.com/dashboard/academy"
                    style="background:#062850;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;display:inline-block;">
                    View My Dashboard &rarr;
                  </a>
                </div>
              </div>
              <div style="background:#062850;border-radius:0 0 16px 16px;padding:20px;text-align:center;">
                <p style="color:#97C3E0;margin:0;font-size:12px;">&copy; ${new Date().getFullYear()} Averra Knowledge Academy</p>
              </div>
            </div>
          `,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Timetable error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
