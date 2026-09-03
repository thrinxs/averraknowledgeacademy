import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPaymentConfirmedEmail } from '@/lib/academy-emails'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const enrollmentId = searchParams.get('enrollment_id')

    if (!reference || !enrollmentId) {
      return NextResponse.redirect(
        new URL('/dashboard/academy?payment=failed', request.url)
      )
    }

    // Verify with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const verifyData = await verifyRes.json()

    const supabase = getAdminClient()

    if (
      !verifyData.status ||
      verifyData.data?.status !== 'success'
    ) {
      await supabase
        .from('academy_enrollments')
        .update({ payment_status: 'failed' })
        .eq('id', enrollmentId)

      return NextResponse.redirect(
        new URL('/dashboard/academy?payment=failed', request.url)
      )
    }

    // Mark enrollment as paid
    await supabase
      .from('academy_enrollments')
      .update({ payment_status: 'paid' })
      .eq('id', enrollmentId)

    // Activate all children for this enrollment
    await supabase
      .from('academy_children')
      .update({ status: 'active' })
      .eq('enrollment_id', enrollmentId)

    // Send payment confirmed email
    try {
      const { data: enrollment } = await supabase
        .from('academy_enrollments')
        .select('email, full_name, currency, billing_amount, parent_id')
        .eq('id', enrollmentId)
        .single()

      if (enrollment?.email) {
        await sendPaymentConfirmedEmail({
          to: enrollment.email,
          parentName: enrollment.full_name || 'there',
          currency: enrollment.currency || 'NGN',
          billingAmount: enrollment.billing_amount || 0,
          paymentMethod: 'paystack',
        })
      }

      // Credit referral commission if ref code exists
      const refCode = request.cookies.get('averra_ref')?.value
      if (refCode && enrollment?.parent_id) {
        try {
          const origin = request.headers.get('origin') || 'https://www.averraknowledgeacademy.com'
          await fetch(`${origin}/api/referral/capture`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              referred_user_id: enrollment.parent_id,
              service: 'academy_junior',
              payment_amount: enrollment.billing_amount || 0,
              currency: enrollment.currency || 'NGN',
              ref_code: refCode,
            }),
          })
        } catch (refErr) {
          console.error('Referral capture error (non-fatal):', refErr)
        }
      }
    } catch (emailErr) {
      console.error('Payment confirmed email error (non-fatal):', emailErr)
    }

    return NextResponse.redirect(
      new URL('/dashboard/academy?payment=success', request.url)
    )

  } catch (err: unknown) {
    console.error('Academy Paystack callback error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/academy?payment=failed', request.url)
    )
  }
}
