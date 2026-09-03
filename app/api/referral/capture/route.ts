import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Called after a referred user makes their first payment
// Credits commission to referrer wallet
export async function POST(request: NextRequest) {
  try {
    const {
      referred_user_id,
      service,
      payment_amount,
      currency,
      ref_code,
    } = await request.json()

    if (!referred_user_id || !service || !payment_amount || !ref_code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const admin = getAdminClient()

    // Check if referral already recorded for this user+service
    const { data: existing } = await admin
      .from('referrals')
      .select('id')
      .eq('referred_user_id', referred_user_id)
      .eq('service', service)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already recorded' })
    }

    // Find referrer by ref code (first 8 chars of user ID)
    const { data: profiles } = await admin
      .from('profiles')
      .select('id')
      .ilike('id', ref_code.toLowerCase() + '%')
      .limit(1)

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
    }

    const referrerId = profiles[0].id

    // Do not credit self-referrals
    if (referrerId === referred_user_id) {
      return NextResponse.json({ success: true, message: 'Self-referral ignored' })
    }

    // Calculate commission (10% of first month fee)
    const commissionAmount = Math.round(payment_amount * 0.1 * 100) / 100

    // Record referral
    await admin.from('referrals').insert({
      referrer_id: referrerId,
      referred_user_id,
      service,
      ref_code,
      status: 'earned',
      commission_amount: commissionAmount,
      currency: currency || 'NGN',
      payment_amount,
      earned_at: new Date().toISOString(),
    })

    // Credit wallet
    const { data: wallet } = await admin
      .from('referral_wallet')
      .select('total_earned, pending_payout')
      .eq('user_id', referrerId)
      .maybeSingle()

    if (wallet) {
      await admin.from('referral_wallet').update({
        total_earned: (wallet.total_earned || 0) + commissionAmount,
        pending_payout: (wallet.pending_payout || 0) + commissionAmount,
        updated_at: new Date().toISOString(),
      }).eq('user_id', referrerId)
    } else {
      await admin.from('referral_wallet').insert({
        user_id: referrerId,
        total_earned: commissionAmount,
        pending_payout: commissionAmount,
      })
    }

    // Notify referrer
    await admin.from('notifications').insert({
      user_id: referrerId,
      type: 'referral',
      title: '💰 Referral Commission Earned!',
      message: `You earned ₦${commissionAmount.toLocaleString()} commission from a referral to ${service}!`,
      is_read: false,
      link: '/dashboard/earn',
    })

    return NextResponse.json({
      success: true,
      commission_amount: commissionAmount,
      referrer_id: referrerId,
    })
  } catch (err) {
    console.error('Referral capture error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
