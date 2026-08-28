import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// GET — validate token
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ valid: false })

  const admin = getAdminClient()
  const { data: creds } = await admin
    .from('staff_credentials')
    .select('user_id, onboarding_token_expires_at, onboarding_completed')
    .eq('onboarding_token', token)
    .single()

  if (!creds) return NextResponse.json({ valid: false })
  if (creds.onboarding_completed) return NextResponse.json({ valid: false, reason: 'already_completed' })
  if (new Date(creds.onboarding_token_expires_at) < new Date()) return NextResponse.json({ valid: false, reason: 'expired' })

  const { data: profile } = await admin
    .from('profiles')
    .select('full_name')
    .eq('id', creds.user_id)
    .single()

  return NextResponse.json({ valid: true, full_name: profile?.full_name || '' })
}

// POST — complete onboarding
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const token = formData.get('token') as string
    const avatarFile = formData.get('avatar') as File
    const secretQuestion = formData.get('secret_question') as string
    const secretAnswer = (formData.get('secret_answer') as string).toLowerCase().trim()
    const secretCode = formData.get('secret_code') as string
    const password = formData.get('password') as string

    if (!token || !avatarFile || !secretQuestion || !secretAnswer || !secretCode || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const admin = getAdminClient()

    // Validate token
    const { data: creds } = await admin
      .from('staff_credentials')
      .select('user_id, onboarding_token_expires_at, onboarding_completed')
      .eq('onboarding_token', token)
      .single()

    if (!creds || creds.onboarding_completed) {
      return NextResponse.json({ error: 'Invalid or already used link' }, { status: 400 })
    }
    if (new Date(creds.onboarding_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'This link has expired. Please contact admin.' }, { status: 400 })
    }

    const userId = creds.user_id

    // Upload avatar
    const ext = avatarFile.name.split('.').pop()
    const avatarPath = `avatars/${userId}/avatar.${ext}`
    const arrayBuffer = await avatarFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await admin.storage.from('avatars').upload(avatarPath, buffer, {
      contentType: avatarFile.type,
      upsert: true,
    })
    const { data: { publicUrl } } = admin.storage.from('avatars').getPublicUrl(avatarPath)

    // Hash credentials
    const answerHash = await bcrypt.hash(secretAnswer, 12)
    const codeHash = await bcrypt.hash(secretCode, 12)

    // Update staff_credentials
    await admin.from('staff_credentials').update({
      secret_question: secretQuestion,
      secret_answer_hash: answerHash,
      secret_code_hash: codeHash,
      onboarding_completed: true,
      onboarding_token: null,
      onboarding_token_expires_at: null,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId)

    // Update profile avatar
    await admin.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)

    // Update password
    await admin.auth.admin.updateUserById(userId, { password })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Staff onboarding error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
