import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-server'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// GET — get referral stats for current user
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getAdminClient()

    const { data: referrals } = await admin
      .from('academy_referrals')
      .select('*')
      .eq('referrer_id', user.id)

    const totalEarned = (referrals || []).reduce((sum, r) => sum + (r.commission_amount || 0), 0)
    const paid = (referrals || []).filter(r => r.status === 'paid').reduce((sum, r) => sum + (r.commission_amount || 0), 0)

    // Generate referral links per division
    const BASE = 'https://www.averraknowledgeacademy.com'
    const code = user.id.slice(0, 8).toUpperCase()
    const divisions = [
      { name: 'Junior Academy', slug: 'junior', code: `ACAD-JNR-${code}` },
      { name: 'University Academy', slug: 'university', code: `ACAD-UNI-${code}` },
      { name: 'Adult Education', slug: 'adult', code: `ACAD-ADULT-${code}` },
      { name: 'Language Academy', slug: 'languages', code: `ACAD-LANG-${code}` },
      { name: 'Educators Academy', slug: 'teachers', code: `ACAD-TCH-${code}` },
      { name: 'Professional Academy', slug: 'professional', code: `ACAD-PRO-${code}` },
    ].map(d => ({
      ...d,
      url: `${BASE}/academy/${d.slug}?ref=${d.code}`,
    }))

    return NextResponse.json({
      referrals: referrals || [],
      total_earned: totalEarned,
      total_paid: paid,
      pending: totalEarned - paid,
      referral_count: (referrals || []).length,
      divisions,
    })
  } catch (err) {
    console.error('Referral GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST — record a referral when someone enrols using a ref code
export async function POST(request: NextRequest) {
  try {
    const { ref_code, enrollment_id, first_month_amount, currency } = await request.json()
    if (!ref_code || !enrollment_id) {
      return NextResponse.json({ error: 'ref_code and enrollment_id required' }, { status: 400 })
    }

    const admin = getAdminClient()

    // Extract user ID from ref code (last 8 chars before any suffix)
    const parts = ref_code.split('-')
    const userCodePart = parts[parts.length - 1]

    // Find referrer by matching first 8 chars of their ID
    const { data: profiles } = await admin
      .from('profiles')
      .select('id')
      .ilike('id', `${userCodePart.toLowerCase()}%`)
      .limit(1)

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
    }

    const referrerId = profiles[0].id
    const commissionAmount = Math.round((first_month_amount || 0) * 0.1 * 100) / 100

    await admin.from('academy_referrals').insert({
      referrer_id: referrerId,
      enrollment_id,
      ref_code,
      currency,
      first_month_amount,
      commission_amount: commissionAmount,
      status: 'pending',
    })

    return NextResponse.json({ success: true, commission_amount: commissionAmount })
  } catch (err) {
    console.error('Referral POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
