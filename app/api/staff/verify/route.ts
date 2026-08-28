import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const ROLE_REDIRECTS: Record<string, string> = {
  admin: '/admin/dashboard',
  staff: '/staff/dashboard',
  trainer: '/trainer/dashboard',
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const admin = getAdminClient()
    const body = await request.json()
    const { step } = body

    // Get credentials
    const { data: creds } = await admin
      .from('staff_credentials')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!creds) return NextResponse.json({ error: 'No staff credentials found' }, { status: 404 })

    // Check if locked
    if (creds.locked_at) {
      return NextResponse.json({ locked: true }, { status: 403 })
    }

    if (step === 'get_question') {
      return NextResponse.json({ secret_question: creds.secret_question })
    }

    if (step === 'verify_answer') {
      const { secret_answer } = body
      const match = await bcrypt.compare(
        secret_answer.toLowerCase().trim(),
        creds.secret_answer_hash
      )

      if (!match) {
        const newAttempts = (creds.failed_attempts || 0) + 1
        const updates: Record<string, unknown> = { failed_attempts: newAttempts }
        if (newAttempts >= 3) {
          updates.locked_at = new Date().toISOString()
          // Notify admin
          await notifyAdminLocked(admin, user.id, user.email || '')
        }
        await admin.from('staff_credentials').update(updates).eq('user_id', user.id)
        if (newAttempts >= 3) {
          await supabase.auth.signOut()
          return NextResponse.json({ locked: true, failed_attempts: newAttempts })
        }
        return NextResponse.json({ success: false, failed_attempts: newAttempts }, { status: 400 })
      }

      // Reset attempts on success
      await admin.from('staff_credentials').update({ failed_attempts: 0 }).eq('user_id', user.id)
      return NextResponse.json({ success: true })
    }

    if (step === 'verify_code') {
      const { secret_code } = body
      const match = await bcrypt.compare(secret_code, creds.secret_code_hash)

      if (!match) {
        const newAttempts = (creds.failed_attempts || 0) + 1
        const updates: Record<string, unknown> = { failed_attempts: newAttempts }
        if (newAttempts >= 3) {
          updates.locked_at = new Date().toISOString()
          await notifyAdminLocked(admin, user.id, user.email || '')
        }
        await admin.from('staff_credentials').update(updates).eq('user_id', user.id)
        if (newAttempts >= 3) {
          await supabase.auth.signOut()
          return NextResponse.json({ locked: true, failed_attempts: newAttempts })
        }
        return NextResponse.json({ success: false, failed_attempts: newAttempts }, { status: 400 })
      }

      // Reset + get role redirect
      await admin.from('staff_credentials').update({ failed_attempts: 0 }).eq('user_id', user.id)
      const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
      const redirect = ROLE_REDIRECTS[profile?.role || 'staff'] || '/staff/dashboard'
      return NextResponse.json({ success: true, redirect })
    }

    return NextResponse.json({ error: 'Invalid step' }, { status: 400 })
  } catch (err) {
    console.error('Staff verify error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function notifyAdminLocked(
  admin: ReturnType<typeof getAdminClient>,
  userId: string,
  email: string
) {
  try {
    const { data: adminUsers } = await admin
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
    if (adminUsers && adminUsers[0]) {
      await admin.from('notifications').insert({
        user_id: adminUsers[0].id,
        type: 'security',
        title: '🔒 Staff Account Locked',
        message: `Staff account ${email} has been locked after 3 failed login attempts.`,
        is_read: false,
        link: '/admin/dashboard/staff',
      })
    }
  } catch (e) {
    console.error('Failed to notify admin:', e)
  }
}
