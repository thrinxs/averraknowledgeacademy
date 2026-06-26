import {
  sendPaymentConfirmedEmail,
} from '@/lib/email'
import { runMatchingAlgorithm } from '@/lib/matching'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl       = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const paystackSecretKey  = process.env.PAYSTACK_SECRET_KEY!

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const reference  = requestUrl.searchParams.get('reference')
  const trxref     = requestUrl.searchParams.get('trxref')
  const ref        = reference || trxref

  if (!ref) {
    return NextResponse.redirect(
      new URL(
        '/dashboard?payment=failed&reason=no_reference',
        requestUrl.origin
      )
    )
  }

  try {
    // ── Verify payment with Paystack ─────────────────
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    )

    const verifyData = await verifyResponse.json()

    if (
      !verifyData.status ||
      verifyData.data.status !== 'success'
    ) {
      const userId = verifyData.data?.metadata?.user_id

      if (userId) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        await supabase
          .from('scholarship_preferences')
          .update({ payment_status: 'failed' })
          .eq('user_id', userId)
      }

      return NextResponse.redirect(
        new URL('/dashboard?payment=failed', requestUrl.origin)
      )
    }

    const userId    = verifyData.data.metadata.user_id
    const amountPaid = verifyData.data.amount / 100

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // ── Guard: check if already processed ────────────
    const { data: existing } = await supabase
      .from('scholarship_preferences')
      .select('payment_status')
      .eq('user_id', userId)
      .single()

    if (existing?.payment_status === 'paid') {
      // Already processed — safe redirect
      return NextResponse.redirect(
        new URL('/dashboard?payment=success', requestUrl.origin)
      )
    }

    // ── Update payment status to paid ─────────────────
    await supabase
      .from('scholarship_preferences')
      .update({
        payment_status: 'paid',
        final_price:    amountPaid,
      })
      .eq('user_id', userId)

    // ── Get user details for email ────────────────────
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .single()

    const { data: userPrefs } = await supabase
      .from('scholarship_preferences')
      .select('selected_package')
      .eq('user_id', userId)
      .single()

    // ── Send payment confirmed email ──────────────────
    if (userProfile?.email) {
      await sendPaymentConfirmedEmail({
        to:          userProfile.email,
        name:        userProfile.full_name || 'Student',
        packageName: userPrefs?.selected_package || 'Basic',
        amount:      amountPaid,
      }).catch((err) =>
        console.error('[Callback] Payment email error:', err)
      )
    }

    // ── Create payment confirmed notification ─────────
    await supabase.from('notifications').insert({
      user_id: userId,
      type:    'payment',
      title:   'Payment Confirmed',
      message:
        'Your payment has been confirmed. ' +
        'Your scholarship matches are being ' +
        'prepared and will be delivered within ' +
        '1 hour. Our team will manually verify ' +
        'them within 24 hours.',
      is_read: false,
      link:    '/dashboard/matches',
    })

    // ── Create payment confirmed message ──────────────
    await supabase.from('messages').insert({
      receiver_id: userId,
      sender_id:   null,
      topic:       'Payment Confirmation',
      content:
        'Thank you for your payment. Your ' +
        'scholarship matching process has begun. ' +
        'You will receive your 5 personalised ' +
        'scholarship matches within 1 hour. ' +
        'Our team will then manually verify each ' +
        'match within 24 hours to ensure accuracy ' +
        'and eligibility.',
      is_read: false,
    })

    // ── Credit affiliate if referral code was used ────
    const { data: prefs } = await supabase
      .from('scholarship_preferences')
      .select('referral_code')
      .eq('user_id', userId)
      .single()

    if (prefs?.referral_code) {
      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('id, user_id')
        .eq('referral_code', prefs.referral_code)
        .single()

      if (affiliate) {
        const commission = amountPaid * 0.1
        await supabase.from('commissions').insert({
          affiliate_id: affiliate.id,
          user_id:      userId,
          amount:       amountPaid,
          commission,
          status:       'pending',
        })
      }
    }

    // ── Run matching algorithm directly — AWAITED ─────
    // This replaces the old fire-and-forget fetch().
    // Running it directly ensures it completes before
    // the function returns, even on Vercel serverless.
    const matchResult = await runMatchingAlgorithm(userId)

    if (!matchResult.success) {
      console.error(
        '[Callback] Matching failed:',
        matchResult.error
      )
    } else {
      console.log(
        `[Callback] ✅ ${matchResult.matchCount} matches generated for user ${userId}`
      )
    }

    // ── Redirect user to success page ─────────────────
    return NextResponse.redirect(
      new URL('/dashboard?payment=success', requestUrl.origin)
    )

  } catch (err) {
    console.error('[Callback] Unexpected error:', err)
    return NextResponse.redirect(
      new URL(
        '/dashboard?payment=failed&reason=verification_error',
        requestUrl.origin
      )
    )
  }
}